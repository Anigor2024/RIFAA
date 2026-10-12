# RIFAA fitting room: what runs, what needs activation

## On-device preview (working without external credentials)
`/fitting-room` provides a deliberately labeled 2D photo composition, using three reviewed clipping guides over existing garment reference photographs (m-01, m-07, w-01). It is NOT neural try-on, automatic person segmentation, physical cloth simulation, body measurement or a fit predictor. Photograph quality, pose and manual positioning affect the result. Clipping guides may retain edge/background artifacts; production catalog onboarding should supply approved transparent garment assets per variant. Product color selection affects the order, not recoloring the reference photo.

The customer chooses a JPG/PNG/WebP (8MB, 40MP maximum), decoded and resized to 1440px in their browser. JPEG re-encoding strips EXIF. The original file URL is revoked. Personal images, local session looks and AI results are held in page memory only, not localStorage, Supabase or a public bucket. At most three local looks can be kept. Explicit export writes a labeled JPEG to the customer's device. Clearing or leaving the page removes in-app references; this is not a promise to securely erase browser/OS RAM or exported files.

## Provider-powered try-on (implemented adapter, off by default)
The server adapter implements FASHN `tryon-v1.6` submission and polling. No live provider request has been made without merchant credentials. This remains an external integration dependency, not a completed live AI capability.

Activation requires ALL of:
- server-only `FASHN_API_KEY` on the intended Vercel environment;
- server-only `TRYON_AI_ENABLED=true`;
- existing Supabase public URL/publishable key and the bounded quota migration;
- merchant approval of the processor, privacy notice, adult-photo policy and reference garment assets;
- test with approved adult sample photographs, including abayas/thobes, unsuitable poses, timeouts, content rejection and output fidelity before public activation.

Do not use NEXT_PUBLIC for the provider key. Do not change payment mode to enable try-on. The UI requires explicit versioned consent and an authenticated customer. The API verifies a confirmed email, rejects non-catalog product IDs, non-adult clothing categories, non-JPEG payloads, oversized bodies and cross-origin POSTs. It submits one sample with conservative moderation and base64 photo input/output. Provider job IDs are returned only inside short-lived HMAC tickets bound to the authenticated customer. Polling verifies both ownership and expiry. No photo, JWT or provider response is written to application logs.

## Spending guard and data minimization
`reserve_tryon_attempt()` uses transactional row locks: maximum 3 submissions per user and 30 globally per UTC day. This is a count cap, not a currency budget. Failures count; no blind retry. The API fails closed if the quota service is unavailable. Counter tables have RLS and no client grants; only an authenticated RPC may reserve. Counters hold day/user/count only. Signing up many users can exhaust the global allowance but cannot exceed it. Separate provider-side billing caps and abuse controls are still recommended when activating.

FASHN documentation reviewed 2026-10-12:
- https://docs.fashn.ai/api-reference/tryon-v1-6
- https://docs.fashn.ai/api-overview/data-retention-privacy
Temporary base64 input processing copies are deleted after processing, with a one-day cleanup backstop. Base64 outputs are available for up to 60 minutes. Request metadata is not automatically deleted; the provider currently has no deletion API. Do not promise immediate external deletion. Cancelling local waiting cannot cancel a submitted provider job and may still consume an attempt/credit.

## Commerce boundary
The bag now rebuilds product data/prices from the canonical catalog, validates colors/sizes, consolidates variants, and caps quantities at 20. Customers can change variants inside the bag dialog. These are storefront integrity protections, NOT server payment authorization. Live merchant activation still requires authoritative server pricing, stock reservation, verified payment webhooks, fulfillment and approved commercial policies. Existing demo-order RPCs are not a live order/payment ledger. No delivery, payment or AI completion is fabricated.
