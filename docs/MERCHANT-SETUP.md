# AEONAE theme: merchant setup

This repository is a Shopify Online Store 2.0 theme built on **Dawn 16.0.0**. It does not touch the store's live
theme (Horizon). Follow these steps in order to preview it, fill it with real data and publish it when ready.

## 1. Add the theme to the store (unpublished)

1. Shopify admin > **Online Store > Themes > Add theme > Connect from GitHub**.
2. Pick the `aeonaeskin-sys/Aeonae-Master-Website` repository and the branch you want to preview.
3. The theme arrives **unpublished**. Use **Customize** and **Preview** freely; your live theme is unaffected.
4. Shopify syncs editor changes back to the branch as commits, so theme-editor edits stay in version control.

> The store is on a trial plan. You'll need to upgrade before you can start selling. The storefront stays behind the
> store password until then.

## 2. Create the product

Products > Add product:

| Field | Value (from the reference design) |
|---|---|
| Title | 1% GHK-Cu Copper Peptide Serum |
| URL handle | `copper-peptide-serum` (the theme's links, menus and CTAs use this handle) |
| Price | $58.00 |
| Inventory | Track quantity **on** if you want the "Only N left" edition band. Set the real count. |
| Description | Product copy (shown by the Description block if you add one) |
| Media | Bottle, carton, texture, in-use photos (see `ASSET-CHECKLIST.md`). Until you add them, the product page shows the bottle illustration. |
| Theme template | `product` (default) |

Then, in the theme editor, select this product in:
- **Home > Product spotlight > Product**
- **Footer > Mobile buy bar > Product** (the bar on non-product pages)

## 3. Create the content pages

Online Store > Pages > Add page. The page body can stay empty, because the template sections hold the content.

| Page title | Handle | Theme template |
|---|---|---|
| The Science | `science` | `page.science` |
| Results and Ritual | `results` | `page.results` |
| Our Story | `our-story` | `page.story` |
| FAQ | `faq` | `page.faq` |

`Contact` already exists and uses Dawn's contact form template.

## 4. Policies (required, missing today)

Settings > Policies: add a **Refund policy**, **Shipping policy** and **Terms of service**. The product page
"Shipping and Returns" tab and the FAQ repeat these terms. Keep them identical, or edit the tab and FAQ text to match.
Also change **Settings > General > Store name** from "My Store" to "AEONAE". The Shopify-generated privacy policy uses it.

## 5. Navigation

Online Store > Navigation. The header drawer shows each top-level item **with children** as a group heading followed by
its links. Top-level items **without** children are listed together at the end.

**Main menu** (`main-menu`), recommended to match the reference design:

- **Shop**
  - Copper Peptide Serum: `/products/copper-peptide-serum`
  - Subscribe and Save: `/products/copper-peptide-serum#subscribe` (add only after a subscription app is live)
- **Learn**
  - The Science: `/pages/science`
  - Results and Ritual: `/pages/results`
  - Our Standard: `/pages/our-story#standard`
  - FAQ: `/pages/faq`
- **Company**
  - Our Story: `/pages/our-story`
  - Reviews: `/products/copper-peptide-serum#reviews`
  - Shipping and Returns: `/policies/shipping-policy`
  - Contact: `/pages/contact`

**Footer menus**: create three menus and pick them in **Footer > Menu columns**:
- *Shop*: Copper Peptide Serum, Subscribe and Save
- *Explore*: The Science, Results and Ritual, Our Story
- *Help*: FAQ, Reviews, Shipping and Returns (the column can also add the support email link)

## 6. Apps

None of these apps are installed today. The theme leaves a place for each one without depending on it.

| Need | What to do | Where it shows |
|---|---|---|
| **Reviews** (any app that uses Shopify app blocks and the standard `reviews.rating` metafields, for example Judge.me, Okendo, Yotpo or Loox) | Install the app, enable its app embed (Customize > App embeds), then add its blocks: star rating in **Product information** (under the title) and the review widget in **Reviews**. | Product page stars, Reviews section, optional photo gallery on Results |
| **Klaviyo** (pop-ups, signup, flows) | Install Klaviyo, connect the store, enable **Klaviyo onsite JavaScript** in Customize > App embeds. Pop-ups are configured in Klaviyo and need no theme change. For the in-page signup, set **Newsletter > Signup provider = Klaviyo** and paste the embedded form ID, or add a Klaviyo app block. | Site-wide pop-ups; Home newsletter |
| **Subscriptions** (Shopify Subscriptions, Recharge, Skio, …) | Install, create a selling plan for the serum. The product page **Purchase options** block appears automatically. If the app provides its own widget block, use that instead and remove the AEONAE block, so there is one picker. | Product page |
| **Back-in-stock** | Klaviyo's back-in-stock feature or a dedicated app. | Product page when sold out |

## 7. Before you publish

Work through `CLAIMS-REVIEW.md` (all **Blockers**) and `ASSET-CHECKLIST.md`.
Then preview on a phone and on desktop and walk the purchase path: home → product → add to cart → cart drawer → checkout.
