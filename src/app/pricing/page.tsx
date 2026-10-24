import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Listing Plans & Pricing | SecureTools.live',
  description: 'List and promote your software on SecureTools. Choose between free community submission and $19 instant publication.',
  alternates: {
    canonical: 'https://securetools.live/pricing',
  },
};

export default function PricingPage() {
  const plans = [
    {
      id: 'free',
      name: 'Free Listing',
      badge: null,
      description: 'Submit your open-source or free tool and get listed in our directory.',
      price: '$0',
      period: 'forever',
      buttonText: 'Submit Free Tool',
      buttonHref: '/submit',
      buttonClass: 'bg-white hover:bg-[#f4f4f5] text-[#09090b] border border-[#e4e4e7]',
      features: [
        { text: '1 active product submission per account', included: true },
        { text: 'Standard review queue (2–4 weeks)', included: true },
        { text: 'Dedicated product listing page', included: true },
        { text: 'Edit your tool anytime after publish', included: true },
        { text: 'Do-follow backlink to your website', included: false },
        { text: 'Verified editorial checkmark badge', included: false },
      ]
    },
    {
      id: 'instant',
      name: 'Instant Listing',
      badge: 'RECOMMENDED',
      description: 'Skip the queue — get reviewed, verified, and published within 48 hours.',
      price: '$19',
      period: 'one-time',
      buttonText: 'Get Instant Listing',
      buttonHref: '/submit?plan=instant',
      buttonClass: 'bg-[#09090b] hover:bg-black/85 text-white',
      features: [
        { text: 'Instant publication after validation (24–48h)', included: true },
        { text: 'Priority editorial review queue', included: true },
        { text: 'Verified editorial checkmark badge', included: true },
        { text: 'Permanent Do-follow backlink', included: true },
        { text: 'Edit your tool anytime after publish', included: true },
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12 font-geist">
      {/* Breadcrumbs */}
      <div className="mb-4">
        <Breadcrumbs items={[{ label: 'Pricing' }]} />
      </div>

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#09090b] tracking-tight">
          List Your Tool on SecureTools
        </h1>
        <p className="text-[13px] sm:text-[13.5px] text-[#71717a] mt-1.5 leading-normal">
          Choose the right plan to get your product verified, published, and discovered by active software buyers.
        </p>
      </div>

      {/* 2 Even Pricing Cards: Side-by-Side Clean White Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto items-stretch">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className="rounded-2xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-150 bg-white border border-[#e4e4e7] hover:border-[#d4d4d8] shadow-2xs relative overflow-hidden"
          >
            {/* Top-Right Corner Badge matching reference corner tab */}
            {plan.badge && (
              <div className="absolute top-0 right-0 bg-[#09090b] text-white text-[9.5px] font-bold tracking-wider uppercase px-3 py-1 rounded-bl-xl rounded-tr-2xl shadow-xs">
                {plan.badge}
              </div>
            )}

            <div>
              {/* Card Title - Fixed height so both titles align identically */}
              <div className="h-7 flex items-center mb-1">
                <h2 className="text-[18px] font-bold tracking-tight text-[#09090b] whitespace-nowrap">
                  {plan.name}
                </h2>
              </div>

              {/* Subtitle - Fixed height h-10 so price & button start at exact matching pixel */}
              <p className="text-[12.5px] text-[#71717a] leading-snug h-10 flex items-center mb-4">
                {plan.description}
              </p>

              {/* Price - Fixed height h-10 */}
              <div className="h-10 flex items-baseline gap-1.5 mb-5">
                <span className="text-3xl font-extrabold tracking-tight text-[#09090b]">
                  {plan.price}
                </span>
                <span className="text-[12px] font-medium text-[#71717a]">
                  / {plan.period}
                </span>
              </div>

              {/* Action Button - 100% Horizontal Straight Alignment across both cards */}
              <Link
                href={plan.buttonHref}
                className={`w-full h-10 rounded-xl text-[13px] font-medium flex items-center justify-center transition-all shadow-2xs mb-6 cursor-pointer ${plan.buttonClass}`}
              >
                <span>{plan.buttonText}</span>
              </Link>

              {/* Features List */}
              <div className="space-y-2.5 pt-3 border-t border-[#f4f4f5]">
                {plan.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2.5 text-[12.5px]">
                    {feat.included ? (
                      <div className="w-4 h-4 rounded-full bg-[#09090b] text-white flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-4 h-4 rounded-full bg-[#f4f4f5] text-[#a1a1aa] flex items-center justify-center shrink-0">
                        <X className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                    )}
                    <span className={feat.included ? 'text-[#3f3f46]' : 'text-[#a1a1aa]'}>
                      {feat.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Clean Bottom Note */}
      <div className="mt-8 text-center text-[12px] text-[#71717a]">
        <span>Have questions or need custom placement? </span>
        <Link href="/contact" className="text-[#09090b] font-medium underline underline-offset-2 hover:text-black">
          Contact our editorial team
        </Link>
      </div>
    </div>
  );
}
