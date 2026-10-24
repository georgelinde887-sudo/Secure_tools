import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Tool slug is required' }, { status: 400 });
    }

    // 1. Check current logged-in user session
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Fetch all reviews for this tool
    const admin = getAdminClient();
    const { data: reviews, error } = await admin
      .from('user_reviews')
      .select('id, user_name, user_email, user_id, rating, title, comment, created_at')
      .eq('tool_slug', slug)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    interface ReviewRow {
      id: string;
      user_name: string;
      user_email?: string;
      user_id?: string;
      rating: number;
      title?: string;
      comment: string;
      created_at: string;
    }

    const list: ReviewRow[] = (reviews as unknown as ReviewRow[]) || [];
    const count = list.length;

    // Check if the current authenticated user has already submitted a review for this tool
    let userHasReviewed = false;
    let userReview: Partial<ReviewRow> | null = null;

    if (user) {
      const existing = list.find(r => 
        (r.user_id && r.user_id === user.id) || 
        (r.user_email && user.email && r.user_email.toLowerCase() === user.email.toLowerCase())
      );
      if (existing) {
        userHasReviewed = true;
        userReview = {
          id: existing.id,
          rating: existing.rating,
          title: existing.title,
          comment: existing.comment,
          created_at: existing.created_at,
        };
      }
    }

    const starCounts: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let sum = 0;

    for (const r of list) {
      const star = Math.min(5, Math.max(1, Math.round(r.rating || 5)));
      starCounts[star] = (starCounts[star] || 0) + 1;
      sum += star;
    }

    const averageRating = count > 0 ? Number((sum / count).toFixed(1)) : 5.0;

    const starPercentages: Record<number, number> = {
      5: count > 0 ? Math.round((starCounts[5] / count) * 100) : 100,
      4: count > 0 ? Math.round((starCounts[4] / count) * 100) : 0,
      3: count > 0 ? Math.round((starCounts[3] / count) * 100) : 0,
      2: count > 0 ? Math.round((starCounts[2] / count) * 100) : 0,
      1: count > 0 ? Math.round((starCounts[1] / count) * 100) : 0,
    };

    // Strip user_email from public review list to maintain privacy
    const publicReviews = list.map(r => ({
      id: r.id,
      user_name: r.user_name,
      rating: r.rating,
      title: r.title,
      comment: r.comment,
      created_at: r.created_at,
    }));

    return NextResponse.json({
      success: true,
      count,
      averageRating,
      starCounts,
      starPercentages,
      reviews: publicReviews,
      userHasReviewed,
      userReview,
      currentUser: user ? {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0],
      } : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // 1. Enforce Authentication — Only logged-in users can review
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        {
          error: 'Authentication required. Please sign in to submit a review.',
          code: 'UNAUTHENTICATED',
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { toolSlug, listingId, userName, rating, title, comment } = body;

    if (!toolSlug || !rating || !comment) {
      return NextResponse.json(
        { error: 'Rating (1-5) and review comment are required.' },
        { status: 400 }
      );
    }

    const admin = getAdminClient();

    // 2. Prevent Duplicate Reviews — 1 review per product per user
    const { data: existingReview } = await (admin.from('user_reviews') as any)
      .select('id')
      .eq('tool_slug', toolSlug)
      .or(`user_id.eq.${user.id},user_email.ilike.${user.email}`)
      .maybeSingle();

    if (existingReview) {
      return NextResponse.json(
        {
          error: 'You have already submitted a review for this product. Each user is limited to one review per product.',
          code: 'DUPLICATE_REVIEW',
        },
        { status: 409 }
      );
    }

    const numRating = Math.min(5, Math.max(1, parseInt(rating, 10)));
    const resolvedName = (userName && userName.trim()) || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Community Member';

    // 3. Insert review with authenticated user credentials
    const { data: inserted, error: insertError } = await (admin.from('user_reviews') as any)
      .insert({
        tool_slug: toolSlug,
        listing_id: listingId || toolSlug,
        user_id: user.id,
        user_email: user.email,
        user_name: resolvedName,
        rating: numRating,
        title: title ? title.trim() : '',
        comment: comment.trim(),
      })
      .select('id, user_name, rating, title, comment, created_at')
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // 4. Revalidate cache
    try {
      const { revalidatePath } = await import('next/cache');
      revalidatePath('/', 'layout');
      revalidatePath('/tools');
      revalidatePath(`/tools/${toolSlug}`);
      revalidatePath(`/extensions/${toolSlug}`);
      revalidatePath(`/open-source/${toolSlug}`);
      revalidatePath(`/plugins/${toolSlug}`);
    } catch {}

    return NextResponse.json({
      success: true,
      review: inserted,
      message: 'Review successfully submitted!',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
