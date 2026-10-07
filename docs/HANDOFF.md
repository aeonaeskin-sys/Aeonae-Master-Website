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

## Round 2 (2026-10-02): live-store bug fixes

**Root cause of the "unstyled" storefront in the merchant's screenshots.** The pages rendered with:
- a white background and pure black text
- buttons with no fill
- invisible input borders and a see-through menu drawer and header

That is what Dawn outputs when the store has **no saved color schemes**: the CSS color variables are never written. It
followed a Shopify sync commit that briefly replaced `config/settings_schema.json` with an empty list. That removed the
settings, and the color schemes have no schema defaults to fall back to. Fixes:
- `snippets/aeonae-head.liquid` writes the AEONAE color schemes itself whenever the store has none, so the theme can no
  longer fall back to an unstyled state. Verified locally by rendering with an empty scheme list.
- `config/settings_data.json` stores the AEONAE values directly in `current` (still also as a preset), and the schema
  defaults now match them (cart drawer, radii, input borders, currency format).

**Navigation drawer.**
- Only one close control (the burger no longer turns into a second X).
- A light warm veil with a slight blur replaces the dark screen.
- The drawer is a solid panel mounted on `<body>`.
- Keyboard and focus behavior is re-tested.

**Contact page.** `templates/page.contact.json` now uses `sections/aeonae-contact.liquid`:
- Shopify's native contact form, so messages still arrive in the store inbox.
- Introduction, topic list and chooser, support email, privacy-policy link.
- Bordered, labelled fields; inline errors with focus on the first invalid field; a "Sending…" state that blocks double
  submits.
- Shows the page's own admin content if any.

**Header.** 95% opaque, so product photos no longer blur through it.

**Catalog** (`templates/collection.json`):
- Three-column portrait cards, capped at one card's width when there is a single product.
- Hover second image, no empty sort or filter controls, trust strip below.
- Editorial card typography.

**Docs.** [`COMPLIANCE-REGISTER.md`](COMPLIANCE-REGISTER.md) and [`RESEARCH.md`](RESEARCH.md).

**Not verifiable from here:**
- The connected store ("Aeonae") is not the store this session's Shopify connector can read ("My Store"), so its
  products, apps (reviews, Klaviyo) and saved settings could not be inspected.
- The contact form's success state could not be rendered by the local harness. It uses Shopify's standard
  `form.posted_successfully?`.

## Round 3 (2026-10-07): premium pass, working directly in the store

The Admin connector now reaches the Aeonae store, so this round used real store data. The AEONAE theme is the
**live theme** (the store is password protected). An unpublished copy, **"AEONAE backup 2026-10-07 (before premium
pass)"**, was made before any change; publish it to roll back.

**Store changes (Admin API, all additive, nothing deleted):**

| Area | Change |
|---|---|
| Pages | Created **The Science** (`/pages/science`, template `science`), **Results and Ritual** (`/pages/results`), **Our Story** (`/pages/our-story`, template `story`) and **Shipping and Returns** (`/pages/shipping-and-returns`, same text as the product tab). The menu links to these used to 404. |
| Main menu | Shop / Learn / Company groups, matching the artifact's menu (Subscribe and Save left out: no subscriptions exist). |
| Footer menus | New "Footer: Shop" and "Footer: Explore"; "Footer menu" now starts with Shipping and Returns and still has Search and Your Privacy Choices. |
| Product | Vendor "My Store" → AEONAE, type Serum, a description (it was empty, and it feeds Google, Facebook and TikTok listings), SEO title and description, alt text on the 3 photos. Title, price, inventory and images are unchanged. |

**Theme changes:**
- **Links:** every link, the home spotlight, the mobile buy bar and the ingredient label now point to the real product handle `ghk-cu-copper-peptide-serum` (they used `copper-peptide-serum`, which 404s).
- **Unbacked offer removed:** "10% off" in the ticker and newsletter. The store has no discounts (CLAIMS-REVIEW B1).
- **Product page:**
  - Live total in Add to cart: price × quantity, using the subscription price when a plan is chosen, hidden when sold out (block setting).
  - "Buy it now" spans the full row.
  - Key ingredients, the daily ritual and the FAQ follow the buy box, using the copy already on the Science, Results and Home pages.
  - The reviews empty state is now a card with a support link.
  - The "Can I cancel my subscription?" FAQ is hidden on Home and Product (not deleted).
- **Header:** the Shop pill stays on phones down to 370px (the logo mark gives way instead).
- **Password page:** branded "opening soon" page with the bottle, the brand promise and an email signup. Signups are tagged `newsletter` and `prelaunch`, and Dawn's password login is kept.
- **Generic pages** (`page.json`: Shipping and Returns, Privacy Choices, any new page): AEONAE page hero, an editorial text column and a support card.
- **Catalog:** centered title and a centered single-product card.
- **Cart drawer:** "Free US shipping on this order" banner (Theme settings > AEONAE brand > Cart drawer banner). It is true today: the only US rate is $0.

**Tested** in the local render harness with the store's real product data (title, handle, price, 3 images at their real
sizes, tracked inventory of 12):

| Check | Result |
|---|---|
| Theme Check | 0 errors; same 9 warnings as stock Dawn |
| Horizontal overflow and script errors | None, on 10 pages × 6 widths (320–1440) |
| axe-core | No violations except Dawn's own heading-order note on the catalog card |
| Button total | 1 → 2 → 5 bottles, subscription plans, back to one time, and sold out |
| Cart drawer | Add to cart opens it with the banner |

**Not verifiable here:**
- The store's storefront, CDN and product photos are blocked by this environment's network, so the real photos were never seen.
- Payment, checkout and app behavior.

**Apps:** none were installed. The Admin API cannot install apps, and only a store owner can approve one. The single
artifact feature that needs an app is **reviews**. The recommended free option is **Judge.me** (its free plan covers
review collection, request emails and the `reviews.rating` metafields this theme reads). Setup is in MERCHANT-SETUP §Apps.
