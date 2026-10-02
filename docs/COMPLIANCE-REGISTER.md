# AEONAE compliance action register

Prepared 2026-10-02 for a U.S. direct-to-consumer brand selling a topical GHK-Cu (copper tripeptide-1) cosmetic serum.

> **Not legal advice.** This register is an engineering and risk-triage document. The risk labels are internal
> priorities, not legal conclusions. Items marked "Specialist review" need a qualified attorney, regulatory consultant
> or the manufacturer. Passing these checks does not make the store compliant.

**How sources were gathered.** This environment's network policy blocked direct access to fda.gov and ftc.gov. Facts were
taken from search-engine excerpts of those agencies' pages and from law-firm and compliance-firm summaries, which are
cited below. Before relying on any item, re-read the primary source linked in the "Primary source" column.

**Status key:**
- **Confirmed**: seen in the theme or store.
- **Investigate**: needs facts I could not see.
- **Docs needed**: evidence must be produced.
- **Fixed (theme)**: fixed in code.
- **May not apply**: possibly out of scope.

**Risk key** (triage only):
- **Critical**: could trigger regulatory action or deceive consumers today.
- **High**: likely problem before launch.
- **Medium**: should fix soon.
- **Low**: good practice.

## A. FDA: cosmetics and MoCRA

| # | Requirement / issue | Primary source | Status | Risk | Why it matters | Action (owner / developer) | Evidence needed | Theme fix? | Specialist review? |
|---|---|---|---|---|---|---|---|---|---|
| A1 | **Serious adverse event reporting** to FDA within 15 business days. Applies to all businesses, including small ones. | [FDA MoCRA page](https://www.fda.gov/cosmetics/cosmetics-laws-regulations/modernization-cosmetics-regulation-act-2022-mocra); summary: [Global Cosmetic Regs](https://globalcosmeticregs.com/guides/us/mocra-adverse-event-reporting) | Investigate | High | Mandatory for the "responsible person" (manufacturer, packer or distributor named on the label) | Owner: name the responsible person; set up an intake and reporting process. Developer: none. | Written procedure; adverse-event log | No | Yes |
| A2 | **Label contact info**: since Dec 29, 2024 each label must carry a domestic address, phone, or electronic contact for adverse-event reports. | Same as A1; [Registrar Corp](https://www.registrarcorp.com/blog/cosmetics/mocra/mocra-exemptions/) | Investigate | High | Applies even to small businesses exempt from registration | Owner: confirm the physical label has it. The product photo in the theme shows "Net 1 fl oz (30 mL)" but the back label was not visible. | Label proof | No | Yes |
| A3 | **Facility registration and product listing** (deadline July 1, 2024). A small-business exemption exists for average U.S. cosmetic sales under $1M over 3 years, except products that touch the eye's mucous membrane, are injected, are for internal use, or alter appearance for more than 24 hours. | [FDA draft guidance](https://www.fda.gov/cosmetics/cosmetics-news-events/fda-issues-draft-guidance-registration-and-listing-cosmetic-product-facilities-and-products); [Wiley](https://www.wiley.law/alert-Times-Up-Cosmetic-Facilities-Must-Comply-With-FDAs-New-Registration-Requirements-by-July-1); [Obelis](https://www.obelis.us/2024/05/mocra-exemptions-for-small-businesses-explained/) | Investigate | Medium | Even if AEONAE is exempt, the contract manufacturer's facility may need to register | Owner: confirm sales level and manufacturer's registration. Do not assume the exemption. | Sales figures; manufacturer's FEI / registration confirmation | No | Yes |
| A4 | **Safety substantiation and records** (MoCRA requires adequate substantiation of safety) | FDA MoCRA page | Docs needed | High | Required regardless of size | Owner: safety assessment from the formulator, including the royal jelly allergen and the 1% GHK-Cu level | Safety dossier | No | Yes |
| A5 | **Cosmetic vs. drug: intended use.** Claims about collagen production, repairing skin, wound healing or "stimulating fibroblasts" make a product a drug. A 2025 warning letter to a GHK-Cu serum brand is reported for "rebuilds damaged skin tissue" / "stimulates fibroblast activity". | FDA "Is it a cosmetic, a drug, or both?"; secondary report (unverified): [PeptideLaws](https://peptidelaws.com/news/fda-ghk-cu-cosmetic-peptide-ingredients-regulations-2026) | **Confirmed, mostly compliant** | High | Drug claims on a cosmetic make it an unapproved new drug | Theme copy already uses appearance language ("the look of firmer, smoother skin"). Never add "collagen", "repair", "heal", "regenerate", "anti-inflammatory". Also review product descriptions, ads, emails and influencer posts, which I could not see. | Copy review of all channels | Partly (theme copy) | Yes |
| A6 | **DSHEA-style disclaimer on a cosmetic** ("These statements have not been evaluated by the FDA… not intended to diagnose, treat, cure, or prevent any disease"). It is used for dietary supplements, and on a cosmetic it can suggest drug-like intent. | FDA intended-use guidance (A5) | Confirmed (footer) | Medium | May undermine the cosmetic positioning | Owner and counsel decide whether to keep it. It is editable in Footer > Disclaimer. "This product is a cosmetic" and "Contains royal jelly" are accurate. | n/a | Yes, after decision | Yes |
| A7 | **Ingredient declaration and net quantity** on the label match the site | 21 CFR 701 (cosmetic labeling) | Investigate | Medium | Inconsistency between site INCI and label | Owner: confirm the theme's INCI list (product tab and Science page) matches the printed label exactly | Label proof | Yes (edit text) | No |

## B. FTC: advertising, claims, testimonials, pricing

| # | Requirement / issue | Primary source | Status | Risk | Why it matters | Action | Evidence needed | Theme fix? | Specialist review? |
|---|---|---|---|---|---|---|---|---|---|
| B1 | **Substantiation of objective claims** ("the look of firmer, smoother skin", results timeline weeks 2–12, "many people find…", "gentle enough for… sensitive skin") | [FTC Health Products Compliance Guidance](https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance) | Confirmed claims; evidence unknown | **Critical** for the timeline; High for the others | Ingredient literature does not substantiate claims about the finished formula | Owner: provide product-specific evidence (consumer perception study, HRIPT) or soften the copy. Full list in `CLAIMS-REVIEW.md` (V1–V8). | Study reports | Yes (edit copy) | Yes |
| B2 | **Consumer Reviews and Testimonials Rule** (effective Oct 21, 2024): no fake, AI-generated or insider reviews undisclosed, no suppression of negative reviews, no incentives conditioned on sentiment. Civil penalties apply. | [FTC rule Q&A](https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers); [WilmerHale](https://www.wilmerhale.com/en/insights/client-alerts/20241009-ftc-finalizes-rule-banning-fake-reviews-and-testimonials-and-touts-new-rule-at-open-commission-meeting) | **Fixed (theme)** | High | The reference design shipped a fake in-browser review form | Theme shows only real review-app data or an honest "No reviews yet" state. Owner: review-request emails must not be conditioned on positive reviews; disclose any incentive. | Review app settings | Done | No |
| B3 | **Before/after imagery** must be real, representative and unretouched | FTC guidance (B1) | Placeholders only | High at launch | Unrepresentative results are deceptive | Use only consented, unretouched photos, or turn on Results > Before and after > "Hide until real photos are uploaded" | Consent forms | Yes (setting) | No |
| B4 | **Made in USA**: an unqualified claim requires "all or virtually all" U.S. content, including ingredients. The label rule (16 CFR 323, effective Aug 13, 2021) covers labels and online marketing; penalties are reported around $53k per violation. A March 2026 executive order signals more enforcement. | [FTC Made in USA](https://www.ftc.gov/business-guidance/resources/complying-made-usa-standard); [Holland & Knight 2026](https://www.hklaw.com/en/insights/publications/2026/03/executive-order-signals-heightened-enforcement-of-made-in-us); [Foley](https://www.foley.com/insights/publications/2024/09/multinational-company-made-in-usa-labeling-requirements/) | Confirmed claim; basis unknown | **Critical** until verified | Copper peptides and botanical extracts are often imported | Owner: get a bill-of-materials origin statement from the manufacturer. If not "all or virtually all" U.S., change it to a qualified claim, e.g. "Formulated and filled in the USA with domestic and imported ingredients". The claim appears in the ticker, hero, trust strip, product trust row and Our Story tab. | Supplier origin documentation | Yes (edit copy) | Yes |
| B5 | **Scarcity and urgency**: "Only N left" must be true | FTC Act §5 | **Fixed (theme)** | Medium | The reference design hardcoded "Only 3 left" | Count now comes from live Shopify inventory, shown only when tracked and at or below the threshold. Owner: resolve the "no restock" vs "waitlist" contradiction (CLAIMS-REVIEW B6). | n/a | Done | No |
| B6 | **Offers and discounts**: "10% off your first order" must exist and be honored | FTC Act §5 | Confirmed copy; offer unverified | High | Advertising an offer that isn't delivered is deceptive | Owner: create the welcome discount and deliver it through Klaviyo, or remove the ticker and newsletter lines. The theme never prints a code. | Klaviyo flow + discount | Yes (edit copy) | No |
| B7 | **Installment messaging** (Shop Pay "4 interest-free installments", seen in your screenshot) | Shopify-provided | Confirmed | Low | Generated by Shopify from real terms, not theme copy | None; do not add custom financing text | n/a | n/a | No |

## C. Privacy, email and SMS

| # | Requirement / issue | Primary source | Status | Risk | Action | Theme fix? | Specialist review? |
|---|---|---|---|---|---|---|---|
| C1 | **CAN-SPAM**: physical postal address in every marketing email, working unsubscribe honored within 10 business days, no deceptive subject lines | FTC CAN-SPAM guide; summary: [UnsubCentral](https://www.unsubcentral.com/can-spam-compliance/) | Investigate (Klaviyo not visible to me) | High | Owner: confirm the Klaviyo footer includes a valid postal address (the footer address "10 Woodmint Terrace, Box 2, Sterling, VA" must be a real mailing address) and that unsubscribe works | No | No |
| C2 | **TCPA (SMS)**: prior express written consent, disclosure that consent is not a condition of purchase, opt-out instructions | [TermsFeed](https://www.termsfeed.com/blog/sms-marketing-consent/); [ActiveProspect](https://activeprospect.com/blog/sms-consent/) | Investigate | High if SMS is used | Owner: use Klaviyo's TCPA-compliant SMS consent form and keep the consent records | No | Yes |
| C3 | **Newsletter consent wording**: the theme's Shopify form tags signups "newsletter" | — | Confirmed | Medium | Optional "Fine print" setting under Home > Newsletter. Add consent wording such as "By signing up you agree to receive marketing emails. Unsubscribe any time." Developer can't decide this wording. | Yes (setting) | No |
| C4 | **State privacy laws**: Virginia CDPA applies at ≥100,000 consumers per year (or ≥25,000 with >50% revenue from data sales); other states have similar thresholds | [Bloomberg Law](https://pro.bloomberglaw.com/insights/privacy/virginia-consumer-data-protection-act-vcdpa/) | Likely does not apply yet | Low | Keep Shopify's privacy policy, the "Your Privacy Choices" link and Global Privacy Control support. Footer docs updated to keep that link. | Done (footer note) | Yes, at scale |
| C5 | **Privacy policy accuracy**: the store's Shopify-generated policy names the store "My Store" and lists generic practices | Store audit | Confirmed (store I can access) | Medium | Owner: set the legal name, then review that listed apps (Klaviyo, reviews app, pixels) are disclosed | No | Yes |

## D. Accessibility

| # | Item | Source | Status | Risk | Action |
|---|---|---|---|---|---|
| D1 | DOJ: ADA Title III applies to businesses open to the public; DOJ points to WCAG as a helpful standard. WCAG 2.1/2.2 AA is the engineering target. | [ADA.gov web guidance](https://www.ada.gov/resources/web-guidance/) | Engineering target met in local tests (see HANDOFF) | Medium | Keep testing on the real store with a screen reader; automated scans are not proof of compliance |
| D2 | Contact form: visible bounded inputs, programmatic labels, inline errors, focus management | WCAG 1.3.1, 1.4.11, 3.3.1, 3.3.2 | **Fixed (theme)** | — | — |
| D3 | Menu drawer: single close control, Esc, focus trap, return focus, no see-through panel | WCAG 2.1.2, 2.4.3, 2.4.7 | **Fixed (theme)** | — | — |

## E. Policies and consumer representations

| # | Item | Status | Risk | Action |
|---|---|---|---|---|
| E1 | Shipping, refund and terms policies are missing in the store I can access (only Privacy exists) | Confirmed | **Critical** before selling | Owner: create them in Settings > Policies. The product tab, FAQ and guarantee copy must match them word for word (CLAIMS-REVIEW B3/B4). Baymard reports 13% of users abandon over unsatisfactory return policies and 44% of sites don't show return info on the product page ([Baymard](https://baymard.com/research/product-page)). |
| E2 | "Free US shipping, no minimum" and "ships in 1–3 business days, tracked" | Confirmed copy | High | Must match the shipping profile and real fulfillment times |
| E3 | Subscription terms ("Cancel or skip anytime") | Hidden until a subscription app exists | Medium | If subscriptions launch, state the renewal terms clearly at checkout (state auto-renewal laws apply) |
| E4 | Store legal name / address | Confirmed "My Store" in the accessible store | Medium | Set it in Settings > General. Verify the footer address. |

## Completed technical fixes this round

- Lost colour schemes: a safety net in `snippets/aeonae-head.liquid`, explicit `current` settings, and AEONAE schema defaults.
- Menu drawer:
  - single close control
  - light veil instead of a dark screen
  - solid panel mounted on `<body>`
- Contact page: rebuilt on Shopify's native contact form (`sections/aeonae-contact.liquid`).
- Header: nearly opaque, so the page no longer shows through it.
- Catalog: one-product-friendly grid, trust strip, editorial card typography.
