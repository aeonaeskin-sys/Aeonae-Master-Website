# UX research notes and how they shaped the theme

Gathered 2026-10-02. Direct page fetches to some sites were blocked by this environment's network policy, so findings
come from search-engine excerpts of the cited pages. Observed features are kept separate from effects. Nothing here
claims a conversion lift for AEONAE.

## Findings

| Source | Observed finding | Relevance to AEONAE | What the theme does |
|---|---|---|---|
| [Baymard: product page research](https://baymard.com/research/product-page) | 64% of users look for shipping information on the product page, but 43% of sites don't provide it there. 13% abandon over unsatisfactory return policies; 44% of sites don't show or link return info on the product page. | High: one product, so the product page carries the purchase decision | Shipping and returns appear next to the buy button: inline trust row, guarantee card, Shipping and Returns tab. The footer lists policy links once the policies exist. |
| [Baymard: "Free Shipping" shouldn't only be in a site-wide banner](https://baymard.com/blog/avoid-banners-only-free-shipping) | Banner-only free-shipping messages are often missed | High | Free shipping is stated on the product page itself and in the cart drawer, not just the ticker |
| [Baymard: links to returns and shipping info](https://baymard.com/blog/footer-needs-return-shipping-links) | Users look for returns and shipping links in the footer | Medium | Footer shows Shopify policy links automatically. The Help menu should include Shipping and Returns (MERCHANT-SETUP §5). |
| [The Ordinary: ingredient-led product pages](https://theordinary.com/en-us/category/skincare/shop-by-ingredients) | Products are framed by targets, format and size, with full ingredient lists | High: AEONAE's positioning is "full disclosure" | Spec chips (size, format, fragrance, skin types), the full INCI in the "What is inside" tab (now open by default) and on the Science page |
| [Medik8: routine and layering guidance](https://us.medik8.com/blogs/lab-notes/skincare-routine-guide) | Education-first: when to apply, what to layer, introduce one product at a time | Medium | "How to use" tab, Science page "How to layer it" card, Results page ritual steps |
| [DOJ ADA web guidance](https://www.ada.gov/resources/web-guidance/) | ADA applies to businesses open to the public; WCAG is the reference standard | High | WCAG 2.2 AA engineering target: keyboard drawer, form labels and errors, contrast, reduced motion |

## Applied in this round

1. **Contact page.**
   - Clear, bounded fields and labels above the inputs.
   - Inline errors, a topic chooser, the support email and a privacy note.
   - Unnecessary friction is the most common contact-form failure, and the old page didn't look clickable.
2. **Navigation drawer.**
   - One obvious close control and a light backdrop.
   - The menu stays readable and connected to the page instead of "breaking" it.
3. **Catalog.**
   - A one-product catalog is presented as a feature (three-column grid capped at a single card width, with a hover second image).
   - It is not a sparse four-column grid with empty sort and filter controls.
   - The trust strip repeats the shipping and returns facts.
4. **Product page.**
   - The ingredients tab is open by default (transparency positioning).
   - Shipping and returns sit beside the purchase controls (Baymard).

## Not applied, and why

- **Ratings near the title / review counts:** only when real reviews exist. The FTC Consumer Reviews Rule and brand honesty rule out anything else.
- **Bestseller, "selling fast" or countdown badges:** no evidence; would be fake urgency.
- **Filters and sorting on the catalog:** pointless with one product. They can be turned on in Customize > Collection > Product grid when more products launch.
