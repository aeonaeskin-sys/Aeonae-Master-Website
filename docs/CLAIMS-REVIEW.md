# Claims and content needing review before launch

The theme keeps the reference design's copy word for word. Nothing was strengthened, and no new claims were added.
The items below are statements that need evidence, a matching store setting, or regulatory review before the theme
is published. Every item is editable in the theme editor (location given), so you can change copy without touching code.

**Status key:**
- **Blocker**: false or unbacked as the store is configured today. Fix before publishing.
- **Verify**: needs evidence or a business check.
- **Advisory**: low risk, worth a look.

## Blockers (true only after store setup)

| # | Copy | Where | Why it is flagged |
|---|------|-------|-------------------|
| B1 | "Take 10% off your first bottle." / "Join the list for a code" / ticker "10% off your first order" | Home > Newsletter; Header > Announcement ticker | The store has **no discount codes** (checked 2026-10-01). Create the welcome offer in Shopify and deliver it through a Klaviyo flow, or remove these lines. The theme never prints a code. |
| B2 | "Subscribe and Save", "Save 10%", "Can I cancel my subscription? Yes, any time…" | Product > Purchase options block; FAQ; menu | The store has **no selling plans** (no subscription app). The purchase-options block hides itself until a subscription app creates selling plans. Remove the FAQ answer and menu link until then, and make sure the app actually lets customers cancel from their account. |
| B3 | "Free US shipping on every order", "no minimum", "ship within one to three business days, tracked" | Trust strip, hero, product tabs, FAQ, ticker, cart note | Must match the shipping rates in **Settings > Shipping and delivery**. The store has **no Shipping policy** yet. |
| B4 | "Unopened bottles can be returned within 14 days…", "send us a photo within 48 hours and we will replace it" | Product > Shipping and Returns tab; guarantee block; FAQ | The store has **no Refund policy** yet. Add one in **Settings > Policies** that says the same thing. |
| B5 | "with every ingredient and every amount printed on the label" (hero lede) | Home > Hero | Only GHK-Cu (1%) has a disclosed amount. Either disclose all amounts or soften this line. Elsewhere the copy says "the amounts that matter", which is consistent with disclosing only the hero active. |
| B6 | "First Edition of 12", "edition of twelve", "Once the First Edition of 12 sells out, a restock is not guaranteed" vs "When the edition sells out it moves to a waitlist" | Product > Edition block; Our Story > Tabs; badges | Confirm the real edition size, and pick one sold-out story (no restock, or waitlist). Then align the copy. The "Only N left" count is driven by **real Shopify inventory** and appears only when inventory is tracked and at or below the low-stock threshold. |

## Product efficacy and suitability (verify: needs substantiation)

| # | Copy | Where | Note |
|---|------|-------|------|
| V1 | "The look of firmer, smoother skin", "A more even, radiant looking tone" | Spotlight, product benefits | Appearance claims still need competent and reliable evidence, for example a consumer perception study on this formula. |
| V2 | Results timeline: "First two weeks: Skin feels comfortable, calm, and hydrated", "Weeks four to eight: The look of a smoother, more even surface", "Weeks eight to twelve: Firmer, more radiant looking skin for many people" | Results > Timeline | Time-bound outcomes need a study on this formula. "For many people" implies data. |
| V3 | "With consistent use, many people find their skin looks smoother and more radiant over time." | Results > Ritual steps | Same as V2. |
| V4 | "Gentle enough for daily use, including sensitive skin", "suitable for all skin types", "It suits most skin types, including sensitive skin" | Product reassurance; Science > Education cards; product description | Typically backed by safety testing such as HRIPT or a dermatologist-supervised test. |
| V5 | "Built on one of the most studied peptides in skin care", "researched in skin science for decades" | Science > Ingredients | This is educational ingredient information. Keep it clearly about GHK-Cu in general, not this formula, and keep sources on file. |
| V6 | "A small copper peptide, naturally present in skin" | Science > Education cards | GHK is usually described as naturally occurring in human plasma and tissues. Confirm the wording with your formulator. |
| V7 | Per-ingredient roles (Niacinamide "even complexion", Sodium Hyaluronate "plumper, more hydrated look", Aloe "calm and comfortable") | Product "What is inside" tab; Science > Ingredients | Generally accepted cosmetic functions. Keep them as appearance language. |
| V8 | "No added fragrance" / "Unscented" | Product spec chips; product description | Confirm with the formulator. The botanical extracts may have their own scent, so "no added fragrance" is the safer wording. |

## Origin, process, operations (verify)

| # | Copy | Where | Note |
|---|------|-------|------|
| O1 | "Made in the USA", "Formulated and filled domestically" | Trust strip, hero, product, Our Story, ticker | An unqualified "Made in USA" claim must meet the FTC "all or virtually all" standard, ingredients included. If ingredients are imported, use a qualified claim such as "Formulated and filled in the USA with domestic and imported ingredients". |
| O2 | "Small, controlled batches… tighter control and fresher product" | Our Story > Tabs | A process claim. Confirm it with your manufacturer. |
| O3 | "A real person replies, usually the same day" | Product reassurance; theme setting "Support reply note" | An operational promise. Keep it only if you can staff it. |
| O4 | Business address "10 Woodmint Terrace, Box 2, Sterling, VA 20164" | Footer | Confirm the address. The store's legal name is still "My Store" in **Settings > General**, and it appears in the Shopify-generated privacy policy. |

## Regulatory (advisory: have counsel review)

| # | Copy | Where | Note |
|---|------|-------|------|
| R1 | "These statements have not been evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease." | Footer legal text | This wording comes from dietary-supplement law (DSHEA). On a cosmetic it is unusual and can suggest drug-like claims. Ask counsel whether to keep it. The sentence "This product is a cosmetic." is accurate as written. |
| R2 | Copper peptide education pages | Science page | Keep "appearance" language throughout. Avoid words like *repair, heal, collagen production, treat*, which can make a cosmetic look like a drug claim. The current copy already avoids them. |
| R3 | MoCRA obligations (facility registration, product listing, adverse event contact) | n/a (not website copy) | Not a theme matter. Listed so it is not forgotten. |
| R4 | Allergen notice: "Contains royal jelly…" | Product allergen block; footer; label card | Correct and important. Keep it prominent. |

## Promises about imagery

- "Real customer photos, never stock or generated" (Results page): the theme ships with labeled placeholders only.
  Publish before/after photos only with written customer consent, unretouched, and with a date or week label. If no real
  photos exist at launch, hide the **Before and after** section (it has a "Hide until real photos are uploaded" option).
