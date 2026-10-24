import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';
import { getAllCategories } from '@/lib/data';
import { captureAndStoreWebsiteScreenshot } from '@/lib/screenshot';
import { findDuplicateMatch } from '@/lib/duplicate-check';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ authenticated: false, activeListing: null, hasActiveSubmission: false });
    }

    const admin = getAdminClient();
    let { data: listings } = await admin
      .from('listings')
      .select('id, name, submission_status, submitted_at')
      .eq('owner_id', user.id)
      .order('submitted_at', { ascending: false });

    // Fallback reconciliation if owner_id was disassociated
    if ((!listings || listings.length === 0) && user.email) {
      const { data: details } = await admin
        .from('listing_details')
        .select('listing_id, extra_metadata')
        .contains('extra_metadata', { userEmail: user.email });

      if (details && details.length > 0) {
        const listingIds = details.map((d: any) => d.listing_id).filter(Boolean);
        if (listingIds.length > 0) {
          await (admin.from('listings') as any).update({ owner_id: user.id }).in('id', listingIds);
          const { data: reconciled } = await admin
            .from('listings')
            .select('id, name, submission_status, submitted_at')
            .in('id', listingIds)
            .order('submitted_at', { ascending: false });
          if (reconciled && reconciled.length > 0) {
            listings = reconciled;
          }
        }
      }
    }

    const activeListing = listings?.find(
      (l: any) => l.submission_status === 'pending_review' || l.submission_status === 'under_review'
    ) || null;

    return NextResponse.json({
      authenticated: true,
      activeListing,
      hasActiveSubmission: Boolean(activeListing),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 });
    }

    const admin = getAdminClient();

    // 1. Fetch listing to verify ownership
    const { data: listing, error: findError } = await admin
      .from('listings')
      .select('id, owner_id, name')
      .eq('id', id)
      .maybeSingle();

    if (findError || !listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 });
    }

    // 2. Verify ownership or admin permission
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .maybeSingle();

    const isAdmin = (profile as any)?.role === 'admin';
    const listingData = listing as any;
    if (listingData.owner_id !== user.id && !isAdmin) {
      return NextResponse.json({ error: 'Forbidden. You do not have permission to delete this listing.' }, { status: 403 });
    }

    // 3. Delete from listings (CASCADE handles details and assets)
    const { error: deleteError } = await admin
      .from('listings')
      .delete()
      .eq('id', id);

    if (deleteError) {
      console.error('Error deleting listing:', deleteError);
      return NextResponse.json({ error: 'Failed to delete listing: ' + deleteError.message }, { status: 500 });
    }

    // Clean up any related records explicitly
    await admin.from('listing_details').delete().eq('listing_id', id);
    await admin.from('listing_assets').delete().eq('listing_id', id);

    return NextResponse.json({ success: true, deletedId: id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Verify User Authentication
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Authentication required. Please sign in with your Google account or business email to submit software.',
          code: 'UNAUTHENTICATED',
        },
        { status: 401 }
      );
    }

    const admin = getAdminClient();

    // 1b. Check Free User Limit: 1 active tool under review per account
    const { data: existingUserListings } = await admin
      .from('listings')
      .select('id, name, submission_status')
      .eq('owner_id', user.id);

    if (existingUserListings && existingUserListings.length > 0) {
      const activePending = (existingUserListings as any[]).find(
        (l: any) => l.submission_status === 'pending_review' || l.submission_status === 'under_review'
      );
      if (activePending) {
        return NextResponse.json(
          {
            error: `Free accounts are limited to 1 active submission at a time. Your tool "${activePending.name}" (${activePending.id}) is currently under review. Once reviewed, you can submit additional tools.`,
            code: 'SUBMISSION_LIMIT_REACHED',
            activeListing: activePending,
          },
          { status: 403 }
        );
      }
    }

    // 2. Parse Payload
    const data = await request.json();

    const {
      itemType = 'software',
      softwareName,
      tagline,
      shortDescription,
      fullOverview,
      websiteUrl,
      repositoryUrl,
      extensionStoreUrl,
      packageUrl,
      primaryCategory,
      pricingModel = 'Free',
      startingPrice = '',
      logoUrl,
      screenshots = [],
      submitterName = '',
      submitterEmail = '',
      relationship = 'Founder / Team Member',
    } = data;

    // 3. Validation
    const resolvedDescription = (shortDescription || data.description || tagline || '').toString().trim();
    const resolvedOverview = (fullOverview || resolvedDescription).toString().trim();
    const mainUrl = (websiteUrl || repositoryUrl || extensionStoreUrl || packageUrl || '').toString().trim();

    if (!softwareName?.toString().trim() || !resolvedDescription || !primaryCategory || !mainUrl) {
      return NextResponse.json(
        { error: 'Please provide all required fields: Product Name, Category, Description, and valid Website/Repository URL.' },
        { status: 400 }
      );
    }

    // 3b. Verify Category Scope Match
    const validCategories = getAllCategories().map(c => c.slug);
    if (!validCategories.includes(primaryCategory) || primaryCategory === 'incompatible-category') {
      const typeLabel = itemType === 'open-source' ? 'open-source repository'
        : itemType === 'extension' ? 'browser extension'
        : itemType === 'plugin' ? 'MCP server / plugin'
        : 'software';

      return NextResponse.json(
        {
          error: `This ${typeLabel} does not match any category in our directory. SecureTools.live exclusively features secure file sharing, cloud storage, database & backend security, virtual data rooms, document systems, and cybersecurity tools. This ${typeLabel} is not applicable.`,
          code: 'CATEGORY_NOT_SUPPORTED',
          category: primaryCategory
        },
        { status: 400 }
      );
    }

    // 3c. Verify Product Legitimacy (Block Informational Blogs, Content Directories, Buying Guides)
    const lowerMainUrl = mainUrl.toLowerCase();
    const isBlogOrDirectory = 
      lowerMainUrl.includes('.blog') || 
      lowerMainUrl.includes('vdrdirectory') || 
      lowerMainUrl.includes('softwaredirectory') ||
      lowerMainUrl.includes('.wordpress.com') ||
      lowerMainUrl.includes('.medium.com') ||
      lowerMainUrl.includes('.substack.com') ||
      lowerMainUrl.includes('/blog') ||
      lowerMainUrl.includes('/directory');

    if (isBlogOrDirectory) {
      return NextResponse.json(
        {
          error: `The submitted website "${mainUrl}" appears to be an informational blog, directory, or article guide rather than a functional software application or SaaS tool. SecureTools.live exclusively accepts functional software products. Blogs and content directories are not eligible for listing.`,
          code: 'INELIGIBLE_CONTENT_SITE'
        },
        { status: 400 }
      );
    }

    // 3d. Verify No Duplicate URLs across Commercial Tools, Open Source, Extensions, and MCP Plugins
    const duplicateCandidateUrls = [
      websiteUrl,
      repositoryUrl,
      extensionStoreUrl,
      packageUrl,
      mainUrl,
      data.targetUrl,
    ].filter(Boolean);

    const duplicateMatch = await findDuplicateMatch(duplicateCandidateUrls);
    if (duplicateMatch) {
      const typeLabel = duplicateMatch.itemType === 'open-source' ? 'Open Source software'
        : duplicateMatch.itemType === 'extension' ? 'Browser Extension'
        : duplicateMatch.itemType === 'plugin' ? 'MCP Plugin'
        : 'Commercial Tool';

      return NextResponse.json(
        {
          error: `This product or URL is already listed in SecureTools.live under "${duplicateMatch.name}" (${typeLabel}). Duplicate listings are strictly prohibited.`,
          code: 'DUPLICATE_URL_EXISTS',
          duplicate: duplicateMatch,
        },
        { status: 409 }
      );
    }

    // 4. Generate Unique Reference ID & Slug
    const year = new Date().getFullYear();
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const submissionId = `ST-${year}-${randomSuffix}`;

    const baseSlug = slugify(softwareName) || `tool-${randomSuffix.toLowerCase()}`;
    let uniqueSlug = baseSlug;

    // Check for slug collision
    const { data: existingSlug } = await admin
      .from('listings')
      .select('id')
      .eq('slug', uniqueSlug)
      .maybeSingle();

    if (existingSlug) {
      uniqueSlug = `${baseSlug}-${randomSuffix.toLowerCase()}`;
    }

    // Upload base64 logo to Supabase Storage if necessary to keep DB rows and Next.js cache lightweight
    let finalLogoUrl = logoUrl || null;
    if (finalLogoUrl && finalLogoUrl.startsWith('data:image/')) {
      try {
        const matches = finalLogoUrl.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
        if (matches) {
          const rawExt = matches[1].toLowerCase();
          const ext = rawExt === 'jpeg' ? 'jpg' : rawExt === 'svg+xml' ? 'svg' : rawExt;
          const buffer = Buffer.from(matches[2], 'base64');
          const filename = `logos/${submissionId}.${ext}`;
          const { error: uploadErr } = await admin.storage
            .from('listing-assets')
            .upload(filename, buffer, {
              contentType: `image/${rawExt}`,
              upsert: true,
            });
          if (!uploadErr) {
            const { data: publicUrlData } = admin.storage
              .from('listing-assets')
              .getPublicUrl(filename);
            if (publicUrlData?.publicUrl) {
              finalLogoUrl = publicUrlData.publicUrl;
            }
          } else {
            console.error('Failed to upload logo to storage, falling back:', uploadErr);
          }
        }
      } catch (uploadCatchErr) {
        console.error('Error uploading logo buffer:', uploadCatchErr);
      }
    }

    // 5. Insert Primary Listing
    const { error: listingError } = await admin.from('listings').insert({
      id: submissionId,
      owner_id: user.id,
      listing_type: itemType,
      name: softwareName.toString().trim(),
      slug: uniqueSlug,
      tagline: tagline ? tagline.toString().trim() : '',
      short_description: resolvedDescription,
      full_description: resolvedOverview,
      official_website_url: mainUrl,
      category_id: primaryCategory,
      logo_url: finalLogoUrl,
      pricing_model: pricingModel,
      starting_price: startingPrice,
      submission_plan: 'free',
      submission_status: 'pending_review',
      link_attribute: 'nofollow',
      submitted_at: new Date().toISOString(),
    } as any);

    if (listingError) {
      console.error('Error inserting listing:', listingError);
      return NextResponse.json(
        { error: 'Failed to create listing record: ' + listingError.message },
        { status: 500 }
      );
    }

    // 6. Insert Type-Specific & Submission Details
    const { error: detailsError } = await admin.from('listing_details').insert({
      listing_id: submissionId,
      extension_store_url: extensionStoreUrl || null,
      extension_id: data.extensionId || null,
      browser_compatibility: data.browserCompatibility || [],
      repository_url: repositoryUrl || null,
      license: itemType === 'open-source' ? (data.sourceCodeLicense || null) : null,
      package_url: packageUrl || null,
      mcp_platforms: data.mcpPlatforms || [],
      mcp_protocol: data.mcpProtocol || null,
      mcp_run_command: data.mcpRunCommand || null,
      mcp_config_snippet: data.mcpConfigSnippet || null,
      mcp_capabilities: data.mcpCapabilities || null,
      pricing_plans: data.pricingPlans || null,
      key_features: data.features || (data.mainFeatures ? [data.mainFeatures] : []),
      alternatives: data.alternatives || [],
      integrations: data.integrations || [],
      submitter_name: submitterName || user.user_metadata?.full_name || '',
      submitter_email: submitterEmail || user.email || '',
      relationship: relationship || '',
      extra_metadata: {
        submittedByUserId: user.id,
        userEmail: user.email,
        itemType,
        youtubeVideoUrl: data.videoUrl || data.youtubeVideoUrl || data.youtubeUrl || null,
        pricingUrl: data.pricingUrl || null,
      },
    } as any);

    if (detailsError) {
      console.error('Error inserting listing details:', detailsError);
      // Details failure is non-fatal if base listing was created, but log error
    }

    // 7. Insert Asset References (Screenshots / Logos)
    if (Array.isArray(screenshots) && screenshots.length > 0) {
      const assetRows = screenshots.map((url: string, index: number) => ({
        listing_id: submissionId,
        storage_key: url.startsWith('/api/media/') ? decodeURIComponent(url.replace('/api/media/', '')) : url,
        public_url: url,
        asset_type: 'screenshot' as const,
        display_order: index,
      }));

      await admin.from('listing_assets').insert(assetRows as any);
    } else if (mainUrl) {
      // Auto-capture screenshot of website in background and store in Supabase Storage
      captureAndStoreWebsiteScreenshot(mainUrl, uniqueSlug, submissionId).catch((err) => {
        console.warn('[AutoScreenshot] Background capture error:', err);
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Your software submission has been received and is pending editorial review.',
      submissionId,
      submission: {
        id: submissionId,
        name: softwareName,
        slug: uniqueSlug,
        itemType,
        status: 'Pending Review',
        submittedAt: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error('Submission API error:', err);
    return NextResponse.json(
      { error: 'An unexpected error occurred during submission: ' + (err.message || 'Internal Server Error') },
      { status: 500 }
    );
  }
}
