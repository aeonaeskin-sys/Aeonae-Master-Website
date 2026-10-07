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
| B1 | ~~"Take 10% off your first bottle." / "Join the list for a code" / ticker "10% off your first order"~~ | Home > Newsletter; Header > Announcement ticker | **Resolved 2026-10-07: removed.** The store still has no discount codes. The newsletter now offers early access to new editions, and the ticker slot reads "Every ingredient disclosed". If you create a real welcome offer (Discounts + a Klaviyo flow), you can put the line back in the theme editor. |
| B2 | "Subscribe and Save", "Save 10%" (menu), the computed "Save N%" on the subscription card, "Cancel or skip anytime. You confirm your email and delivery details at checkout.", "Can I cancel my subscription? Yes, any time…" | Product > Purchase options (card + plan note); Home > FAQ; Header menu | The store has **no selling plans** (no subscription app). The purchase-options block hides itself until a subscription app creates selling plans, and its savings figure is calculated from the plan, never typed in. Remove the FAQ answer and menu link until then, and make sure the app actually lets customers cancel or skip from their account. **2026-10-07:** the "Can I cancel my subscription?" FAQ block is now hidden (not deleted) on Home and Product; re-enable it in the editor once subscriptions exist. The new main menu has no Subscribe and Save link. |
| B3 | "Free US shipping" / "Free US shipping on every order", "no minimum", "ship within one to three business days, tracked", "Free US shipping and a 14 day promise." | Header > Ticker; Home > Hero trust items, Trust strip "Free shipping", Spotlight price note, FAQ; Product > Inline trust row, Shipping and Returns tab; Results > Call to action band; Theme settings > AEONAE brand > Cart drawer line | Must match the shipping rates in **Settings > Shipping and delivery**. **Verified 2026-10-07:** the General profile has one US rate, "Free Premium Shipping" at $0.00 with no conditions, so "free US shipping, no minimum" is true today. "One to three business days" is still unverified. The store has **no Shipping policy** yet; a "Shipping and Returns" page now exists at /pages/shipping-and-returns with the same text as the product tab. |
| B4 | "14 day returns", "On unopened bottles, no hassle.", "14 DAY PROMISE", "Unopened bottles can be returned within 14 days…", "send us a photo within 48 hours and we will replace it", "a 14 day promise" | Header > Ticker; Home > Hero trust items, Trust strip, FAQ; Product > Guarantee card, Shipping and Returns tab; Results > Call to action band | The store has **no Refund policy** yet. Add one in **Settings > Policies** that says the same thing. |
| B5 | "with every ingredient and every amount printed on the label" (hero lede) and "Every ingredient and amount, printed on the page." | Home > Hero; Home > Trust strip > "Full disclosure" item | Only GHK-Cu (1%) has a disclosed amount on any page. Both lines need the same fix: disclose all amounts, or say "the amounts that matter" as the rest of the copy does. |
| B6 | "First Edition of 12", "First Edition, edition of 12", "First Edition, an edition of 12", "A First Edition of twelve", "Once the First Edition of 12 sells out, a restock is not guaranteed" vs "When the edition sells out it moves to a waitlist" | Header > Ticker; Home > Spotlight badge; Product > eyebrow Text block, Edition stock band (label, low-stock note, default note); Our Story > Tabs > Edition | Confirm the real edition size, and pick one sold-out story (no restock, or waitlist). Then align the copy. The "Only N left" count is driven by **real Shopify inventory** and appears only when inventory is tracked and at or below the low-stock threshold. |

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
