// Static checklist template, sourced from WebYes_GTM_Playbook_Feature_Releases.docx (v1.0, June 2026).
// Each item has a stable "key" used to store its done/na status per release in the item_status table.
// Do not change existing keys once releases have data against them — add new items with new keys instead.

const TIERS = {
  1: {
    label: "Tier 1: Major release",
    banner:
      "New feature, new integration, new module, plan or pricing change, or new standalone product. Marketing lead time: 7+ working days. Examples: JIRA integration, Real User Monitoring, WebYes Performance standalone.",
    sections: [
      {
        title: "Timeline (T = release day, working days)",
        items: [
          { key: "timeline-0", when: "T-7", owner: "Safwana", text: "Classify the release, fill the one-page GTM plan, brief Melwyn and Sidharth (and Naseem if visuals are needed)" },
          { key: "timeline-1", when: "T-5", owner: "Sidharth", text: "Docs page drafted. Docs are a release blocker — no docs, no announcement" },
          { key: "timeline-2", when: "T-5", owner: "Melwyn", text: "Feature/product page copy and launch blog post drafted" },
          { key: "timeline-3", when: "T-3", owner: "Melwyn + Sidharth", text: "Existing-asset sweep completed (see Asset Sweep section below)" },
          { key: "timeline-4", when: "T-3", owner: "Melwyn / Safwana", text: "Announcement email drafted, segmented by plan availability. Melwyn drafts, Safwana approves" },
          { key: "timeline-5", when: "T-3", owner: "Melwyn", text: "LinkedIn launch post plus one follow-up post drafted" },
          { key: "timeline-6", when: "T-1", owner: "Naseem", text: "Final screenshots and visuals delivered" },
          { key: "timeline-7", when: "T-1", owner: "Melwyn", text: "Video walkthrough recorded and edited (major releases only) — short screen-capture demo, script leads with the user benefit, not a feature tour" },
          { key: "timeline-8", when: "Day 0", owner: "All / Safwana", text: "Docs live, product page updated, blog published, changelog entry posted, email sent, LinkedIn launch post out. Safwana confirms each" },
          { key: "timeline-11", when: "Day 0 (or T+1 if not ready)", owner: "Melwyn / Naseem", text: "Video walkthrough embedded on the product/blog page and posted natively to LinkedIn — tracked separately since editing usually runs behind the rest of Day 0" },
          { key: "timeline-9", when: "T+2", owner: "Melwyn / Anjaly", text: "Reddit post if it fits the Reddit content plan; Extension and plugin store listings or CTAs updated if the release overlaps them" },
          { key: "timeline-10", when: "T+7", owner: "Safwana", text: "Measure and log results (see T+7 Review section below)" }
        ]
      },
      {
        title: "Existing-asset sweep (run at T-3)",
        items: [
          { key: "sweep-0", owner: "Melwyn", text: "Feature/module product page — feature lists, claims, screenshots, CTA relevance" },
          { key: "sweep-1", owner: "Melwyn / Safwana", text: "Homepage — headline claims, module lists, feature mentions" },
          { key: "sweep-2", owner: "Melwyn", text: "Pricing page — plan entitlements and feature-by-plan table; verify with product" },
          { key: "sweep-3", owner: "Melwyn", text: "Comparison / competitor pages — capability tables vs Silktide, SiteImprove, Screaming Frog; a new feature can flip a 'no' to a 'yes'" },
          { key: "sweep-4", owner: "Sidharth", text: "Documentation — new page, related pages, internal links, sidebar navigation" },
          { key: "sweep-5", owner: "Sidharth", text: "FAQ and help content — answers the release makes wrong or incomplete" },
          { key: "sweep-6", owner: "Safwana", text: "Free tool pages and CTAs — any overlap between the release and a free tool's pitch or CTA" },
          { key: "sweep-7", owner: "Anjaly", text: "Chrome Extension and WP plugin store listings — descriptions, screenshots, CTA into WebYes" },
          { key: "sweep-8", owner: "Melwyn", text: "Onboarding and lifecycle emails — any email referencing features" },
          { key: "sweep-9", owner: "Naseem", text: "Screenshots site-wide — UI changes silently date every old screenshot" },
          { key: "sweep-10", owner: "Sidharth", text: "Changelog / release notes — entry in the agreed template" }
        ]
      },
      {
        title: "T+7 review",
        items: [
          { key: "review-0", owner: "Safwana", text: "Sign-ups: release week vs prior week, total and organic share (custom dashboard)" },
          { key: "review-1", owner: "Safwana", text: "New pages: GSC impressions and clicks for the feature page, blog post, and docs page" },
          { key: "review-2", owner: "Safwana", text: "Email: open and click rate" },
          { key: "review-3", owner: "Safwana", text: "LinkedIn: engagement on launch and follow-up posts" },
          { key: "review-4", owner: "Safwana", text: "Docs traffic: views on the new docs page" },
          { key: "review-5", owner: "Safwana", text: "Video walkthrough: views and watch-through rate (LinkedIn native + embedded page)" },
          { key: "review-6", owner: "Safwana", text: "Log one learning from this release in the playbook release log" }
        ]
      }
    ]
  },
  2: {
    label: "Tier 2: Minor release",
    banner:
      "Meaningful improvement to an existing capability that users will notice. Marketing lead time: 3 working days. Examples: new WCAG version filter, report export upgrade, scan speed improvement.",
    sections: [
      {
        title: "Minor release checklist",
        items: [
          { key: "minor-0", owner: "Sidharth", text: "Changelog entry on day 0" },
          { key: "minor-1", owner: "Sidharth", text: "Docs updated by day 0" },
          { key: "minor-2", owner: "Melwyn", text: "Product page section updated, if the feature is listed anywhere on the site" },
          { key: "minor-3", owner: "Melwyn", text: "One LinkedIn post within the release week" },
          { key: "minor-4", owner: "Melwyn", text: "Add to the monthly roundup (blog or Weekly Accessibility Digest once live)" }
        ]
      },
      {
        title: "T+7 review (lighter pass)",
        items: [
          { key: "minor-review-0", owner: "Safwana", text: "Sign-ups: release week vs prior week, total and organic share" },
          { key: "minor-review-1", owner: "Safwana", text: "Docs traffic: views on the updated docs page" },
          { key: "minor-review-2", owner: "Safwana", text: "Log one learning if anything stood out" }
        ]
      }
    ]
  },
  3: {
    label: "Tier 3: Patch",
    banner:
      "Bug fixes, small tweaks, internal changes. No marketing lead time — changelog only, at release. Examples: scan engine fix, UI copy correction.",
    sections: [
      {
        title: "Patch checklist",
        items: [
          { key: "patch-0", owner: "Sidharth", text: "Changelog entry" },
          { key: "patch-1", owner: "Sidharth", text: "Docs touch-up only if behaviour changed" },
          { key: "patch-2", owner: "—", text: "Nothing else. Resist the urge to announce patches — it trains the audience to ignore real announcements" }
        ]
      }
    ]
  },
  4: {
    label: "New Product Launch",
    banner:
      "A brand-new standalone product under the WebYes/Mozilor umbrella (e.g. WebYes Performance, WebYes SEO, an AccessYes-style spin-off). Bigger than a feature release — it needs its own positioning, pricing, and site presence before Day 0. Full GTM lead time: 30+ working days.",
    sections: [
      {
        title: "Pre-launch (T-30 to T-14)",
        items: [
          { key: "product-0", when: "T-30", owner: "Safwana", text: "Define positioning, target audience, and pricing tier(s) for the new product; align the launch date with leadership/product" },
          { key: "product-1", when: "T-30", owner: "Safwana", text: "Brief Melwyn, Sidharth, Anjaly, and Naseem on launch scope, timeline, and their individual roles" },
          { key: "product-2", when: "T-21", owner: "Melwyn", text: "Draft the standalone product page or mini-site copy (or a dedicated section on webyes.io if no separate domain)" },
          { key: "product-3", when: "T-21", owner: "Sidharth", text: "Scope and start documentation for the new product from scratch — this is not an add-on to existing docs" },
          { key: "product-4", when: "T-14", owner: "Naseem", text: "Logo/branding assets, hero visuals, and screenshots for the new product" },
          { key: "product-5", when: "T-14", owner: "Melwyn", text: "Comparison and competitor pages for the new product's category" }
        ]
      },
      {
        title: "Launch build (T-10 to T-1)",
        items: [
          { key: "product-6", when: "T-10", owner: "Shamnas", text: "Site/domain setup, pricing page, and sign-up flow for the new product — needs its own written brief, likely spanning more than one Monday" },
          { key: "product-7", when: "T-7", owner: "Melwyn", text: "Launch blog post / press release drafted" },
          { key: "product-8", when: "T-5", owner: "Melwyn", text: "Launch email sequence drafted, segmented appropriately" },
          { key: "product-9", when: "T-3", owner: "Melwyn", text: "Social and community launch plan (LinkedIn, Reddit, and any communities specific to this product's category)" },
          { key: "product-10", when: "T-3", owner: "Sidharth", text: "Docs published in review; FAQ drafted" },
          { key: "product-11", when: "T-1", owner: "Naseem", text: "Final visuals and screenshots delivered" }
        ]
      },
      {
        title: "Day 0",
        items: [
          { key: "product-12", when: "Day 0", owner: "All / Safwana", text: "Product live, site/pages live, docs live, launch post out, email sent, social posts out. Safwana confirms each" }
        ]
      },
      {
        title: "T+30 review",
        items: [
          { key: "product-13", owner: "Safwana", text: "Sign-ups/trials for the new product specifically, not blended into overall WebYes numbers" },
          { key: "product-14", owner: "Safwana", text: "Traffic to the new product's pages (GSC + web analytics)" },
          { key: "product-15", owner: "Safwana", text: "Press or partner pickup, if any outreach was done" },
          { key: "product-16", owner: "Safwana", text: "Log what worked, what didn't, and the decision on next iteration" }
        ]
      }
    ]
  }
};

module.exports = { TIERS };
