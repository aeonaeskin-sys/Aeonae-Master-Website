# AEONAE storefront: handoff

This branch turns the AEONAE reference design (the Claude Artifact "AEONAE Skin Longevity") into a Shopify Online
Store 2.0 theme built on **Dawn 16.0.0**. The design, copy and interactions are rebuilt as native Liquid sections, blocks
and JSON templates. Everything is editable in the theme editor, and Dawn's product form, cart drawer, customer accounts,
localization and app blocks still work.

| Read next | For |
|---|---|
| [`MERCHANT-SETUP.md`](MERCHANT-SETUP.md) | Connecting the theme, creating the product, pages, policies, menus and apps |
| [`CLAIMS-REVIEW.md`](CLAIMS-REVIEW.md) | Copy that needs evidence, store settings or legal review before publishing (6 blockers) |
| [`ASSET-CHECKLIST.md`](ASSET-CHECKLIST.md) | Every image slot, its size and the photo brief |

## Store audit (2026-10-01, via the Shopify Admin API)

| Area | Finding | Consequence |
|---|---|---|
| Plan | Trial | You'll need to upgrade before you can start selling. |
| Live theme | **Horizon** (the store's default), no customizations | Untouched. This theme is a new, unpublished Dawn-based theme, because the brief requires Dawn. |
| Products / collections | 0 products; only the default "Home page" collection | Product-bound sections show designed empty states until the product exists. |
| Apps | Only the Claude connector app is visible. **No reviews app, no Klaviyo, no subscription app** detected. | Each one has a ready slot: app blocks, the `reviews.rating` metafields, a Klaviyo embed and app embeds, and native selling plans. |
| Selling plans / discounts | None | Subscribe and Save UI stays hidden; the "10% off" copy is unbacked (see CLAIMS-REVIEW B1/B2). |
| Policies | Privacy only | Shipping, refund and terms policies are missing (CLAIMS-REVIEW B3/B4). |
| Pages / menus | Contact, Your Privacy Choices; default main and footer menus | Recommended structure in MERCHANT-SETUP §3 and §5. |

## What was built

**Design system**:
- **Base files:** `assets/aeonae.css`, `snippets/aeonae-head.liquid` and `assets/aeonae.js`.
- **Colors:** the reference palette as 5 Dawn color schemes (bone, paper, mist, ink, linen).
- **Fonts:** self-hosted Fraunces and Hanken Grotesk.
- **Brand settings:** in Theme settings > AEONAE brand.
- **Shared pieces:** button, card, chip, accordion, placeholder and media primitives.
- **Motion:** the artifact's reveal timing on top of Dawn's scroll-reveal system, plus a floating bottle and parallax halo. All motion stops under `prefers-reduced-motion`.

| Template | Sections (all `sections/aeonae-*.liquid` unless noted) |
|---|---|
| Header group | `aeonae-marquee` (ticker with pause control), `aeonae-header` (sticky translucent bar, editorial menu drawer, Dawn cart bubble/account/search) |
| `index` | hero, trust-strip, spotlight (bound to a real product), explore, faq, newsletter |
| `product` | Dawn `main-product` + 8 new blocks: edition band (real inventory), benefits, spec chips, purchase options (native selling plans), guarantee, reassurance, trust row, allergen. Also a no-media bottle stage, and `aeonae-reviews` (app blocks + review metafields). |
| `page.science` | page-hero, ingredients, edu-cards, label-card (full INCI), cta-band |
| `page.results` | page-hero, media-grid, timeline, before-after, photo-grid (app-block takeover), steps, cta-band |
| `page.story` | page-hero, letter (letter + principles), tabs (WAI-ARIA), cta-band |
| Footer group | `aeonae-footer` (menus, Shopify payment icons, policies, legal), `aeonae-sticky-buy` (mobile buy bar that drives Dawn's product form) |

**Stock Dawn files changed** (all additive, so the stock sections can be switched back on):

| File | Change |
|---|---|
| `layout/theme.liquid` | Renders `aeonae-head`; skips Dawn font loading when the brand fonts are on; loads `aeonae.js` and the cart drawer styles; adds a `<noscript>` reveal fallback |
| `config/settings_schema.json` / `settings_data.json` | New "AEONAE brand" settings; AEONAE preset (schemes, radii, inputs, drawer cart, no currency code) |
| `sections/main-product.liquid` | 8 new block types, no-media stage, AEONAE CSS/JS includes, optional "Open by default" for collapsible tabs |
| `snippets/cart-drawer.liquid` | Prints the "Cart drawer reassurance line" setting under Check out |
| `sections/header-group.json` / `footer-group.json`, `templates/index.json` / `product.json` | Point at the AEONAE sections with the reference copy |

### Deliberate departures from the reference design

| Reference behaviour | Theme behaviour | Why |
|---|---|---|
| Hardcoded "Only 3 left" of 12 | "Only N left" from **real Shopify inventory**, shown only when tracked and at or below the threshold | No fake scarcity |
| Newsletter and welcome pop-up reveal code `WELCOME10` | Shopify customer form or Klaviyo, never prints a code. No theme pop-up: Klaviyo owns pop-ups. | No hardcoded discount codes; avoid duplicating Klaviyo |
| In-browser review form and fake ratings | Review app blocks plus the standard `reviews.rating` metafields, with an honest empty state | No fabricated reviews |
| Subscribe and Save at a fixed $52.20, 30/45/60 days | Native selling plans: prices and savings from the plan, hidden without a subscription app | Real pricing only |
| Text payment badges | Shopify's payment icons for methods actually enabled | Accuracy |
| Single-page app router | Real URLs: `/`, `/products/copper-peptide-serum`, `/pages/science`, `/pages/results`, `/pages/our-story`; FAQ at `/#faq` | Native Shopify |
| Copper text, sage "Save" text and pale-sage tab underline | Darkened to pass WCAG AA | Contrast |
| Blue halo glow (leftover from an earlier palette) | Sage glow, configurable in Theme settings | Palette consistency |

## Testing performed

| Check | Result |
|---|---|
| Shopify Theme Check (`@shopify/theme-check-node` 3.30) | **0 errors.** The 9 warnings are the same as stock Dawn 16. |
| Custom schema/template validator (name lengths, range steps, defaults, url/link_list rules, template ↔ schema types, presets, groups) | 0 violations in AEONAE files |
| Local render harness (liquidjs with mocked Shopify objects, Chromium via Playwright) at 320–1920 px | No horizontal overflow; JS runs without errors; cart bubble/drawer, variant change, selling-plan submit, buy bar, tabs, drawer focus trap and FAQ accordion work |
| Accessibility (axe-core, keyboard walks, contrast, reduced motion) | Focus rings on all buttons, keyboard-operable drawer/tabs/accordion/ticker, AA text contrast, motion stops under reduced motion |
| Independent review: 5 reviewers, each finding re-checked by a separate verifier | 18 confirmed issues, all fixed and re-tested |

**Not verified**, because these need a real Shopify store, which this environment could not render:
- checkout and payment
- the real dynamic checkout buttons
- Section Rendering API responses from Shopify
- theme-editor behaviour
- Klaviyo forms and pop-ups, review apps and subscription apps (none are installed)
- shipping rates

The harness mocks Shopify, so treat its results as strong pre-checks, not proof. **Preview the theme in the store**
(MERCHANT-SETUP §1) and walk home → product → add to cart → drawer → checkout on a phone and on desktop before
publishing.

## Known limitations and follow-ups

- **Single-product assumptions.**
  - The no-media bottle illustration is labeled "1% GHK-Cu", so it is only right for the serum. Upload real product media
    before adding other products.
  - Links and CTAs point to `/products/copper-peptide-serum`. Keep that handle or update the links.
- **Ingredient list lives in two places**: the product "What is inside" tab and the Science page label card.
  - Best practice: store the INCI in a product metafield (for example `custom.inci`).
  - The label card can read that metafield directly. The product tab can be connected to it through the editor's dynamic sources.
- **Page bodies are not shown.** The Science, Results and Our Story templates are section-built, so text typed into the page body in the admin does not appear.
- **Theme-editor preview quirk.** The mobile buy bar's "after an anchor jump" detection relies on an IntersectionObserver
  root margin, which browsers ignore inside cross-origin iframes. This only affects the editor preview: shoppers on the live
  storefront are unaffected, and the bar always shows while its section is selected in the editor.
- **Reduced-motion ticker.** When the visitor prefers reduced motion, the ticker wraps onto several lines (about 120px tall
  at 320px wide) so every message stays readable.
- **Short UI strings are English only** ("Pause announcements", "Quick purchase", editor hints). The store is
  English/US only; move them into locale files before adding languages.
- **Logo files** were extracted from the reference at modest resolution. Replace them with master or vector files (ASSET-CHECKLIST, bundled assets).
- **Not reproduced on purpose:**
  - the "Add to cart $58.00" live total on the button (Dawn's button is kept intact)
  - the reference's 50/50 product grid (Dawn's media-size setting controls it)
  - the "Be first to know" notify modal (use Klaviyo back-in-stock)
