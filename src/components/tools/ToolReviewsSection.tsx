'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Star, MessageSquarePlus, X, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface ReviewItem {
  id: string;
  user_name: string;
  rating: number;
  title?: string;
  comment: string;
  created_at: string;
}

interface ReviewsData {
  count: number;
  averageRating: number;
  starCounts: Record<number, number>;
  starPercentages: Record<number, number>;
  reviews: ReviewItem[];
}

interface ToolReviewsSectionProps {
  toolSlug: string;
  toolName: string;
  listingId?: string;
  initialRating?: number;
}

const STAR_LABELS: Record<number, string> = {
  1: 'Poor',
  2: 'Fair',
  3: 'Good',
  4: 'Very Good',
  5: 'Excellent',
};

export function ToolReviewsSection({
  toolSlug,
  toolName,
  listingId,
  initialRating = 4.9,
}: ToolReviewsSectionProps) {
  const [data, setData] = useState<ReviewsData>({
    count: 0,
    averageRating: initialRating,
    starCounts: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    starPercentages: { 5: 100, 4: 0, 3: 0, 2: 0, 1: 0 },
    reviews: [],
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Authenticated user state
  const [currentUser, setCurrentUser] = useState<{ id: string; email: string; name: string } | null>(null);
  const [userHasReviewed, setUserHasReviewed] = useState(false);
  const [userReview, setUserReview] = useState<Partial<ReviewItem> | null>(null);

  // Form state
  const [selectedRating, setSelectedRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userName, setUserName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 1. Check local client auth session immediately
  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          const name = user.user_metadata?.full_name || user.email?.split('@')[0] || '';
          setCurrentUser({
            id: user.id,
            email: user.email || '',
            name,
          });
          setUserName(name);
        }
      });
    } catch {}
  }, []);

  // 2. Fetch reviews & server-verified review status for this tool
  useEffect(() => {
    let isMounted = true;
    async function loadReviews() {
      try {
        const res = await fetch(`/api/reviews?slug=${encodeURIComponent(toolSlug)}`);
        const json = await res.json();
        if (isMounted && json.success) {
          setData(json);
          setUserHasReviewed(Boolean(json.userHasReviewed));
          if (json.userReview) {
            setUserReview(json.userReview);
          }
          if (json.currentUser) {
            setCurrentUser(json.currentUser);
            if (!userName && json.currentUser.name) {
              setUserName(json.currentUser.name);
            }
          }
        }
      } catch (err) {
        console.warn('Failed to load reviews:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadReviews();
    return () => {
      isMounted = false;
    };
  }, [toolSlug]);

  const handleWriteReviewClick = () => {
    if (!currentUser) {
      setShowAuthModal(true);
      return;
    }
    if (userHasReviewed) {
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      setErrorMessage('Please provide your review feedback.');
      return;
    }

    if (!currentUser) {
      setShowAuthModal(true);
      setIsModalOpen(false);
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolSlug,
          listingId: listingId || toolSlug,
          userName: (userName || currentUser.name || currentUser.email.split('@')[0]).trim(),
          rating: selectedRating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to submit review');
      }

      setSubmitSuccess(true);
      setUserHasReviewed(true);

      // Re-fetch reviews to update dynamic rating calculation and user review state
      const refreshRes = await fetch(`/api/reviews?slug=${encodeURIComponent(toolSlug)}`);
      const refreshJson = await refreshRes.json();
      if (refreshJson.success) {
        setData(refreshJson);
        setUserHasReviewed(true);
        if (refreshJson.userReview) {
          setUserReview(refreshJson.userReview);
        }
      }

      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
        setTitle('');
        setComment('');
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeStar = hoverRating || selectedRating;
  const currentPath = typeof window !== 'undefined' ? window.location.pathname + '#reviews-section' : '/tools';

  return (
    <section className="space-y-4 font-geist" id="reviews-section">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-[#09090b] tracking-tight">
            Verified User Reviews & Ratings
          </h2>
          <p className="text-xs text-[#71717a] mt-0.5">
            Authentic community ratings calculated dynamically across security, workflow, and pricing.
          </p>
        </div>

        {/* Write a Review CTA Button / Disabled state if already reviewed */}
        {userHasReviewed ? (
          <button
            type="button"
            disabled
            title="You have already submitted a verified review for this product."
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-[#71717a] text-xs font-medium cursor-not-allowed shadow-2xs shrink-0 select-none"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
            <span>Review Submitted</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handleWriteReviewClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-xs font-semibold shadow-2xs transition-all cursor-pointer border border-[#09090b] shrink-0"
          >
            <MessageSquarePlus className="w-3.5 h-3.5" />
            <span>Write a Review</span>
          </button>
        )}
      </div>

      {/* User already submitted review helper banner */}
      {userHasReviewed && (
        <div className="px-4 py-3 rounded-2xl bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-between gap-3 text-xs text-[#09090b] shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#16a34a] shrink-0" />
            <span>
              You have already submitted a verified review for <strong className="font-semibold">{toolName}</strong>. Thank you for contributing!
            </span>
          </div>
          <span className="font-mono text-[10.5px] text-[#71717a] shrink-0 hidden sm:inline-block">
            1 review per product limit
          </span>
        </div>
      )}

      {/* Aggregate Rating Summary Card */}
      <div className="rounded-2xl border border-[#e4e4e7] bg-white p-5 sm:p-6 shadow-2xs">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left: Overall Calculated Score */}
          <div className="md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-[#e4e4e7] pb-5 md:pb-0 md:pr-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl sm:text-5xl font-black text-[#09090b] tracking-tight">
                {data.averageRating.toFixed(1)}
              </span>
              <span className="text-xs font-mono font-semibold text-[#71717a]">/ 5.0</span>
            </div>

            {/* Stars row */}
            <div className="flex items-center gap-1 my-2">
              {[1, 2, 3, 4, 5].map((s) => {
                const filled = s <= Math.round(data.averageRating);
                return (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      filled
                        ? 'fill-[#09090b] text-[#09090b]'
                        : 'fill-transparent text-[#d4d4d8]'
                    }`}
                  />
                );
              })}
            </div>

            <p className="text-xs text-[#71717a] font-medium">
              Based on {data.count} verified {data.count === 1 ? 'review' : 'reviews'} & research benchmarks
            </p>
          </div>

          {/* Right: Star Distribution Breakdown */}
          <div className="md:col-span-8 space-y-2">
            {[5, 4, 3, 2, 1].map((star) => {
              const pct = data.starPercentages[star] || 0;
              const count = data.starCounts[star] || 0;

              return (
                <div key={star} className="flex items-center gap-3 text-xs">
                  <div className="w-8 font-mono font-semibold text-[#09090b] flex items-center gap-1">
                    <span>{star}</span>
                    <Star className="w-3 h-3 fill-[#09090b] text-[#09090b]" />
                  </div>

                  <div className="flex-1 h-2 rounded-full bg-[#f4f4f5] overflow-hidden border border-[#e4e4e7]">
                    <div
                      className="h-full bg-[#09090b] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>

                  <span className="font-mono text-[11px] text-[#71717a] w-10 text-right">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Review Cards List */}
      {data.reviews.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#09090b] tracking-tight">
            Recent User Feedback
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {data.reviews.map((rev) => {
              const initials = rev.user_name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase() || 'U';

              return (
                <div
                  key={rev.id}
                  className="rounded-2xl border border-[#e4e4e7] bg-white p-4 sm:p-5 shadow-2xs space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#09090b] text-white flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-2xs">
                          {initials}
                        </div>
                        <div>
                          <div className="text-xs font-bold text-[#09090b]">
                            {rev.user_name}
                          </div>
                          <div className="text-[10.5px] text-[#71717a]">
                            Verified Member
                          </div>
                        </div>
                      </div>

                      {/* Stars */}
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-3 h-3 ${
                              s <= rev.rating
                                ? 'fill-[#09090b] text-[#09090b]'
                                : 'fill-transparent text-[#e4e4e7]'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {rev.title && (
                      <h4 className="text-[13px] font-bold text-[#09090b] leading-snug">
                        {rev.title}
                      </h4>
                    )}

                    <p className="text-xs text-[#52525b] leading-relaxed line-clamp-4">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#f4f4f5] flex items-center justify-between text-[11px] font-mono text-[#a1a1aa]">
                    <span>
                      {new Date(rev.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                    {/* Verified Review with GREEN tick icon */}
                    <span className="inline-flex items-center gap-1 text-[#09090b] font-sans font-semibold text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a]" />
                      <span>Verified Review</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── MODAL 1: AUTH REQUIRED POPUP ── */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 font-geist">
          <div className="relative max-w-sm w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#e4e4e7] p-5 sm:p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-[#fafafa] border border-[#e4e4e7] flex items-center justify-center text-[#09090b] shadow-2xs">
                <Lock className="w-5 h-5 text-[#09090b]" />
              </div>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-7 h-7 rounded-lg bg-white border border-[#e4e4e7] hover:bg-[#f4f4f5] flex items-center justify-center text-[#71717a] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="font-bold text-base text-[#09090b] tracking-tight">
                Sign in to Write a Review
              </h3>
              <p className="text-xs text-[#71717a] leading-relaxed">
                Only verified members can review software on SecureTools.live to prevent fake ratings, astroturfing, and duplicate spam.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#fafafa] border border-[#e4e4e7] space-y-2 text-xs">
              <div className="flex items-center gap-2 text-[#09090b]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>1 verified review per product limit</span>
              </div>
              <div className="flex items-center gap-2 text-[#09090b]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>Instant rating benchmark recalculation</span>
              </div>
              <div className="flex items-center gap-2 text-[#09090b]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#16a34a] shrink-0" />
                <span>Sign in with Google or your business email</span>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <Link
                href={`/login?next=${encodeURIComponent(currentPath)}`}
                className="w-full h-10 rounded-xl bg-[#09090b] hover:bg-[#27272a] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-2xs transition-colors"
              >
                <span>Sign In to Continue</span>
              </Link>
              <button
                type="button"
                onClick={() => setShowAuthModal(false)}
                className="w-full h-9 rounded-xl border border-[#e4e4e7] hover:bg-[#f4f4f5] text-xs font-medium text-[#71717a] transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: INTERACTIVE WRITE A REVIEW MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-150 font-geist">
          <div className="relative max-w-lg w-full bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#e4e4e7]">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7] bg-[#fafafa]">
              <div>
                <h3 className="font-bold text-sm text-[#09090b]">
                  Write a Review for {toolName}
                </h3>
                <p className="text-[11.5px] text-[#71717a] mt-0.5">
                  Share your hands-on feedback to assist teams making software decisions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-7 h-7 rounded-lg bg-white border border-[#e4e4e7] hover:bg-[#f4f4f5] flex items-center justify-center text-[#71717a] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body / Form */}
            {submitSuccess ? (
              <div className="p-8 text-center space-y-3 font-geist">
                <div className="w-12 h-12 rounded-full bg-[#f0fdf4] border border-[#bbf7d0] flex items-center justify-center mx-auto text-[#16a34a]">
                  <CheckCircle2 className="w-6 h-6 text-[#16a34a]" />
                </div>
                <h4 className="font-bold text-base text-[#09090b]">Thank you for your review!</h4>
                <p className="text-xs text-[#71717a] max-w-xs mx-auto">
                  Your feedback has been securely recorded and the rating benchmark has been dynamically updated.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fecaca] text-[#dc2626] text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Authenticated User Account Pill (No email input needed) */}
                {currentUser && (
                  <div className="flex items-center gap-2.5 p-3 rounded-xl bg-[#fafafa] border border-[#e4e4e7] text-xs">
                    <div className="w-8 h-8 rounded-full bg-[#09090b] text-white flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-2xs">
                      {(userName || currentUser.name || currentUser.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-[#09090b] truncate">
                          {userName || currentUser.name || 'Verified Member'}
                        </span>
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#166534] bg-[#f0fdf4] border border-[#bbf7d0] px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-2.5 h-2.5 text-[#16a34a]" />
                          Verified Member
                        </span>
                      </div>
                      <div className="text-[11px] text-[#71717a] truncate font-mono mt-0.5">
                        {currentUser.email}
                      </div>
                    </div>
                  </div>
                )}

                {/* Star rating selector */}
                <div>
                  <label className="block text-xs font-semibold text-[#09090b] mb-1.5">
                    Your Rating <span className="text-[#ef4444]">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setSelectedRating(star)}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 cursor-pointer transition-transform hover:scale-110"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= activeStar
                                ? 'fill-[#09090b] text-[#09090b]'
                                : 'fill-transparent text-[#d4d4d8]'
                            }`}
                          />
                        </button>
                      ))}
                    </div>

                    <span className="font-mono text-xs font-bold text-[#09090b] bg-[#f4f4f5] px-2.5 py-1 rounded-md border border-[#e4e4e7]">
                      {activeStar} / 5 — {STAR_LABELS[activeStar]}
                    </span>
                  </div>
                </div>

                {/* Reviewer Display Name (Pre-filled from account, editable) */}
                <div>
                  <label className="block text-xs font-semibold text-[#09090b] mb-1">
                    Display Name <span className="text-[#ef4444]">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your Name or Role (e.g. Alex Morgan, Security Lead)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    required
                    className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] text-xs text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] shadow-2xs font-geist"
                  />
                </div>

                {/* Review Headline */}
                <div>
                  <label className="block text-xs font-semibold text-[#09090b] mb-1">
                    Review Headline <span className="text-[#71717a] font-normal text-[11px]">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Robust security and intuitive document tracking"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#e4e4e7] text-xs text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] shadow-2xs font-geist"
                  />
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#09090b] mb-1">
                    Your Experience & Review <span className="text-[#ef4444]">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe how you use this software, what features stand out, and any considerations for new teams..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full p-3 rounded-xl border border-[#e4e4e7] text-xs text-[#09090b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#09090b] shadow-2xs resize-none font-geist"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f4f4f5]">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-[#e4e4e7] text-xs font-semibold text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-[#09090b] hover:bg-[#27272a] disabled:opacity-60 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer border border-[#09090b]"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
