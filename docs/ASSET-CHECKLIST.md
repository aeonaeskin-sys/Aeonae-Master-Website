# Asset replacement checklist

Every image slot in the theme has a fallback, so nothing renders broken:

- **No image uploaded:** a branded placeholder frame, or the bottle illustration from the reference design.
- **Placeholder labels:** inside the theme editor, each placeholder is labeled with what belongs there and the
  recommended size. Shoppers never see those labels.

Photograph your **real** packaging and real use. Do not use stock or AI-generated images anywhere the copy promises
real photos (Results page), and do not stage props that imply claims, such as lab equipment or certifications.

All sizes are recommended source sizes. Shopify generates the responsive versions automatically.

## Priority 1: needed for launch

| # | Where (theme editor path) | Setting | Size | Ratio | What to shoot | Until replaced |
|---|---|---|---|---|---|---|
| 1 | **Products > 1% GHK-Cu Copper Peptide Serum > Media** (Shopify admin, not the theme editor) | Product media, 4 images | 2000 x 2000 px | 1:1 | (1) Bottle, front-on, on a warm bone/cream backdrop. (2) Carton and bottle together. (3) Texture: macro of a clear serum drop. (4) In use: dropper over a hand or face. Add alt text to each. The first image also appears in the Home spotlight, the cart drawer and the Shopify checkout. | Bottle illustration stage on the product page and spotlight |
| 2 | Home > Hero | `image` | 1600 x 2000 px (photo) or ~900 x 1400 px transparent PNG (with *Image style = Product cut-out*) | 4:5, or natural for a cut-out | The bottle upright on a warm cream backdrop, soft light behind it, no hands. This is the largest image on the site and loads first, so export a compressed JPG/WebP. | Floating bottle illustration with halo |

## Priority 2: Results and Ritual page

These frames sit under copy that promises **real, unretouched customer photos**. Until you have them, consider turning on
**Before and after > Hide until real photos are uploaded** and **Customer photos > Hide empty frames**.

| # | Where | Setting | Size | Ratio | What to shoot | Until replaced |
|---|---|---|---|---|---|---|
| 3 | Results > Captioned media grid > Photo "Texture macro" | `image` | 1200 x 1500 px | 4:5 | Macro of the clear, water-light serum spreading on glass or skin | Placeholder frame tagged "Texture macro" |
| 4 | … > Photo "The dropper" | `image` | 1200 x 1500 px | 4:5 | The glass dropper releasing a drop, bottle in soft focus | Tagged "The dropper" |
| 5 | … > Photo "On the skin" | `image` | 1200 x 1500 px | 4:5 | Serum pressed into the back of a hand or cheek, showing it absorbs | Tagged "On the skin" |
| 6 | … > Photo "The finish" | `image` | 1200 x 1500 px | 4:5 | Skin after absorption: soft, natural finish | Tagged "The finish". The footnote hides once all four are uploaded |
| 7–12 | Results > Before and after > cards "Customer, week 4 / 8 / 12" | `before_image`, `after_image` (2 per card) | 1000 x 1000 px | 1:1 | The same consenting customer at day 0 and at the week shown. Identical framing, light and angle, unretouched. Keep the written consent on file. | Frames tagged Before / After |
| 13–16 | Results > Customer photos > Photo 1–4 | `image` (+ alt text per block) | 1000 x 1000 px | 1:1 | Verified customer photos shared with permission. Alternatively, add your reviews app's photo-gallery app block to this section; the placeholder grid then hides automatically. | Frames labeled "Customer photo" |

## Priority 3: optional brand assets (bundled fallbacks already in place)

| # | Where | Setting | Size | Ratio | Notes |
|---|---|---|---|---|---|
| 17 | Theme settings > Logo > Favicon | `favicon` | 512 x 512 px | 1:1 | The DNA-leaf mark centered on transparent or bone (#F4EDE1). **There is no favicon until you set one.** |
| 18 | Header > AEONAE header | `logo_mark` | ≥ 242 x 265 px, transparent PNG/SVG | ~0.91:1 | The DNA mark only, no text. Falls back to `assets/aeonae-logo-mark.png`. |
| 19 | Footer > Footer | `logo` | ≥ 300 px tall, transparent PNG/SVG | ~1.48:1 | The full lockup (mark, AEONAE, SKIN LONGEVITY). Falls back to `aeonae-logo-full.png`, or the light version on a dark color scheme. |
| 20 | Theme settings > Logo | `logo` | ≥ 600 px long side | — | Leave empty. If set, it overrides **both** the header mark and the footer lockup with one file, so prefer 18 and 19. |
| 21 | Home > Hero | `image_mobile` | 1200 x 1500 px | 4:5 | Optional tighter crop for phones. The frame keeps the desktop image's ratio, so use the same ratio. |
| 22–25 | Science > Page hero, Science > Ingredient label, Results > Page hero, Our Story > Page hero | `mark_image` | ≥ 240 px tall, transparent | ~0.91:1 | Optional. The DNA mark is used when empty. |

## Bundled assets (already in the theme)

| File | Use |
|---|---|
| `assets/aeonae-logo-mark.png` (242 x 265) | Header mark, page hero marks, ingredient label mark |
| `assets/aeonae-logo-full.png` (520 x 351) | Footer lockup on light backgrounds |
| `assets/aeonae-logo-full-light.png` (520 x 351) | Footer lockup on dark backgrounds |
| `snippets/aeonae-bottle.liquid` | Vector bottle illustration from the reference design, used until product photos exist |
| `assets/aeonae-fraunces*.woff2`, `assets/aeonae-hanken-grotesk.woff2` | Self-hosted brand fonts (SIL Open Font License) |

These logo files were extracted from the reference design at modest resolution. Replace them with vector (SVG) or
high-resolution master files from your brand designer when available. Re-upload them in place in Online Store > Themes >
Edit code > Assets, or set slots 18 and 19.
