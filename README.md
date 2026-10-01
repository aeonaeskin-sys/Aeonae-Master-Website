# Aeonae-Master-Website

The AEONAE storefront theme: a premium GHK-Cu copper peptide serum brand with a luxurious, minimalist,
science-inspired design. It is a Shopify Online Store 2.0 theme built on **Shopify Dawn 16.0.0**. The AEONAE reference
design is rebuilt as native, theme-editor-configurable sections.

## Start here

- [`docs/HANDOFF.md`](docs/HANDOFF.md): what was built, store audit, testing, limitations
- [`docs/MERCHANT-SETUP.md`](docs/MERCHANT-SETUP.md): connect the theme, create the product, pages, policies, menus, apps
- [`docs/CLAIMS-REVIEW.md`](docs/CLAIMS-REVIEW.md): copy to verify before publishing
- [`docs/ASSET-CHECKLIST.md`](docs/ASSET-CHECKLIST.md): photography and logo slots

## Layout

Standard Shopify theme folders (`assets`, `config`, `layout`, `locales`, `sections`, `snippets`, `templates`).
AEONAE files are prefixed `aeonae-` and listed in the handoff, alongside the few stock Dawn files that were edited.
Shopify's GitHub integration ignores `docs/`, this README and `LICENSE-DAWN.md`.

## Develop

```bash
npm install -g @shopify/cli
shopify theme dev --store 1a7s1x-wd.myshopify.com   # local preview against the store
shopify theme check                                  # lint (expect 0 errors; Dawn's baseline warnings remain)
```

## Licenses

- Dawn: © Shopify, see [`LICENSE-DAWN.md`](LICENSE-DAWN.md).
- Fraunces and Hanken Grotesk (self-hosted in `assets/`): SIL Open Font License 1.1, see [`docs/licenses/`](docs/licenses/).
