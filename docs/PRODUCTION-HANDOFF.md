# RIFAA Production Handoff

RIFAA is a production-oriented bilingual Next.js ecommerce storefront. The repository is deliberately safe by default: checkout and account data remain in showcase mode until real merchant services are connected.

## What is already production-grade

- Responsive Arabic RTL and English LTR storefront
- Women, Men, Kids, New, Collections, Sale, Editorial, Search and Wishlist experiences
- Product detail pages with 6x / 9x fabric inspection zoom
- Local bag, wishlist, language, recently viewed and demo account persistence
- Checkout validation, delivery logic, promo engine and non-sensitive order summaries
- SEO metadata, sitemap, robots, manifest and branded app icon
- 404, route error, global error and loading recovery states
- Security headers and reduced-motion / keyboard-focus accessibility
- Runtime health endpoint at `/api/health`
- CI gates for catalog integrity, local media, lint and production build
- Vercel Git-based Preview and Production deployments

## Required before accepting real customer money

1. Create a dedicated RIFAA database/auth project. Do not reuse another product's database.
2. Connect a verified live payment merchant account and implement server-side payment authorization plus webhooks.
3. Replace showcase product inventory, tax treatment, shipping SLAs, return rules, contact details and legal text with approved merchant data.
4. Configure private provider credentials only in the hosting platform's protected environment settings. Never commit credentials to Git.
5. Connect transactional email/SMS and newsletter consent workflows.
6. Add real inventory reservation, order persistence, fulfillment states and refund workflows.
7. Obtain merchant-specific legal review for Terms, Privacy, Returns and tax/VAT statements.
8. Run payment-provider sandbox tests, webhook replay tests, accessibility QA and end-to-end mobile QA before enabling live commerce.

## Public runtime configuration

The storefront understands the public site URL and optional public support contact fields. Keep private credentials out of source control.

The current Vercel production URL can remain the canonical site during portfolio review. Replace it with the merchant's real domain when purchased or launched.

## Release policy

Every change should pass:
- `npm run validate:media`
- `npm run lint`
- `npm run build`

Production should deploy only from `main` after Preview verification.
