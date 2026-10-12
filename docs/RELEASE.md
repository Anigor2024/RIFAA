# Atheeldar 2.1 — Property and client journey

Date: 12 October 2026

Continuation of the published real-estate release at `ec6bada6025ae79f2d5731b8a1f56803009eb53a`. The deployment destination remains `https://atheeldar.vercel.app` and the source branch remains `atheeldar-real-estate`.

## What changed

- Rebuilt all nine property detail pages around photography, clear prices and units, specifications, neighborhood context, and working favorite/comparison/viewing actions. Removed the arbitrary property scores and purchase-finance estimates from the detail page. Related listings respect the sale/rental purpose and residential category.
- Added a keyboard-accessible image gallery with named images, focus containment/return, Escape and RTL arrow controls. A one-image listing does not display misleading next/previous arrows. Sharing uses the direct property URL and supports manual copying.
- Added per-property private notes and a five-item personal checklist. Notes migrate from the earlier text format, save through the shared browser store, and appear in the client workspace. Partial storage failures are handled explicitly: a failed note payload cannot mark migration complete, and deliberate deletion cannot revive legacy text.
- Added editable local viewing proposals with valid calendar dates and future Saudi-time slots. Updating a property's proposal updates its existing local record instead of creating duplicates. Adding to a full six-property viewing plan never evicts another selection. Proposals remain unconfirmed and unsent.
- Replaced the finance page with validated purchase assumptions, zero-rate/cash-purchase support, editable upfront and monthly costs, affordability based on a user-selected income allocation, two named saved scenarios, and an annual repayment schedule. Sale-property links prefill the selected price; rental prices are never treated as purchase prices.
- Replaced the account page with actual browser-stored favorites, comparison, viewing plans, saved searches and notes. Added tab keyboard navigation and deep links, actual next-step prompts, readable viewing drafts, and useful empty states.
- Added a versioned JSON export/import for those five personal sections plus viewing duration. Files are limited to 1 MiB, validated before mutation, previewed with counts, and applied only through an explicit merge or replace action. Merge retains existing choices and reports capacity conflicts. Viewing request drafts, finance scenarios and legacy deal/inspection state are outside this backup format.
- Connected the printable decision pack to current typed property notes, preserving selected properties and note line breaks across updates and clearing.
- Repaired the legacy deal-room mount/autosave race, retained existing offers/notes, corrected annual rental amounts, and linked sale finance to the current property. Inspection report reset now also removes its stale journal rating while preserving the visitor's other decision notes. Both tools validate stored data and announce temporary persistence failures.

## Verification

- The production Next.js build succeeds with 88 generated pages. The project passes TypeScript; changed components pass targeted ESLint. Existing image advisories on older routes remain non-blocking.
- 40 new domain checks pass: 13 finance calculations/validation, 18 backup/import scenarios, 6 note migration/persistence cases, and 3 Saudi date/calendar checks.
- Rendered Chromium checks cover the new detail experience (6 groups), finance (8 groups), client workspace (12 groups) legacy deal/inspection reliability (7 groups), and printable note updates (3 groups). Tested desktop and 390/360 px mobile layouts without horizontal page overflow or JavaScript/hydration errors in these flows.
- Real interactions covered image overlays, capacity limits without eviction, note/checklist persistence, editable viewing drafts, property-to-finance linking, scenario restoration, annual rental units, invalid backup rejection, previewed merge/replace, exported JSON, Arabic saved-search restoration, and blocked browser storage.
- Property-to-workspace checks initially needed a wait for the rendered destination, rather than the URL change alone. Their focused rerun passed without an application change. A separate finance check used a fresh Chromium run after an environment-specific second-context cleanup failure.
- Desktop and mobile screenshots were visually reviewed for typography, image framing, control sizes, section order and unobstructed navigation.

## Operating scope

The catalog and imagery remain illustrative. Client data is stored in the visitor's browser; this release does not add server accounts, live inventory, lender approval, or actual appointment delivery. Finance values come from visible assumptions rather than a lender quote. The backup scope is deliberately explicit in the interface.

The release is deployed from its exact GitHub commit as a Vercel preview and assigned to the existing Atheeldar alias. The repository's separate main-branch production site is not part of this release.

---

# Atheeldar 2.0 — Release notes

Date: 12 October 2026

## Recovery and scope

The real-estate application was recovered from `Anigor2024/RIFAA`, branch `atheeldar-real-estate`, starting at commit `9e0d0b4d9576c50b79de39f27b57860d5a86c55b`. The public destination is `https://atheeldar.vercel.app`.

This release belongs to the real-estate branch. Deployment uses a preview from its exact tested commit and assigns the existing Atheeldar alias to that deployment. It does not promote this branch to the repository's separate main-branch production deployment.

## Experience changes

- Rebuilt the homepage around an original evening villa hero, Arabic typography, ivory and forest colors, a prominent property search, and listing cards immediately after search.
- Added a four-question home finder with purpose, city, budget, rooms and optional priorities. Residential journeys exclude offices and land; budget and room constraints stay explicit. Empty states suggest only deliberate, user-selected changes.
- Rebuilt the header with four clear navigation destinations, cross-site search, keyboard support, a mobile menu and a persistent mobile navigation bar.
- Added a searchable directory for 26 decision tools and linked the core comparison, finance and viewing workflows directly from the homepage.
- Implemented Arabic search parsing for Arabic/Persian numerals, thousands, millions, rooms and square meters. Search controls round-trip through the URL, including reload, Back and Forward.
- Added active filter chips, shareable result links, reopenable saved searches, and a compact expandable mobile filter panel.
- Unified favorites, comparison and viewing-plan state with cross-tab updates and a session fallback when persistent browser storage is unavailable.
- Corrected the comparison destination: it retains the actual selected assets, enforces a three-property limit and remains empty after clearing. Annual rent and annual rent per square meter have explicit units.
- Made the viewing planner calculate the visitor's chosen viewing durations only. It does not invent driving times or confirmed appointments.
- Improved dialog focus containment, focus restoration, Escape handling, background isolation, tab keyboard navigation and reduced-motion behavior.
- Cached 38 inherited catalog photographs locally and added three credited city photographs. Replaced one unavailable neighborhood image with an explicitly illustrative photograph of Jeddah. The homepage hero is newly generated artwork. See IMAGE-CREDITS.md.
- Added sitemap and robots output, sharing metadata and a locked dependency tree; removed unused Firebase CLI and Google GenAI dependencies.

## Validation performed

- Production Next.js build completed successfully and generated 88 static pages/routes. TypeScript passed. Existing advisory image-optimization lint warnings remain; there are no build-blocking lint errors.
- 16 property-search tests and 12 home-matching tests passed.
- Independent eligibility/URL review checked 1,452 combinations of city, purpose, budget and bedroom count without mismatches between the home finder and property explorer.
- Chromium/Playwright tested the rendered production build at desktop 1440 px and mobile 390/360 px widths. The cloud browser could not access the executor's loopback, so local Playwright was used.
- Passed browser scenarios: home rental form; natural-language rent query; URL reload/history; saved search reopening; city-specific illustrative map; favorite persistence; comparison capacity and clear/reload; quick-preview focus restoration; header search dialog/background isolation; viewing-plan restoration; four-step finder and its results link; mobile menu, expandable filters and tool search/navigation.
- No JavaScript runtime or hydration errors were observed in those scenarios.
- All 31 URLs included in the sitemap returned HTTP 200 from the production build. All referenced local catalog images exist and decode as JPEGs. Homepage images loaded successfully.
- Desktop and mobile screenshots were reviewed against the accepted design concepts. No horizontal page overflow was observed on the tested home, property search and tools screens at 390/360 px.
- Three initial browser checks needed selector scoping/navigation waits in the verification harness; the focused rerun passed. These were harness issues and did not require application changes.

## Operating boundaries

The restored catalog remains illustrative: nine property records, sample projects, sample neighborhood figures, and illustrative media. Search and recommendation rules operate on those records; they are not a live inventory or an AI valuation service.

Favorites, searches, requests and viewing plans are stored in the visitor's browser, with temporary memory fallback where supported. Contact and appointment forms save local drafts and explicitly state that they have not sent a request or confirmed an appointment. The map is an illustrative explorer, not a geographic navigation service. Finance/investment tools use visible scenario assumptions and do not represent lender offers.

A real operating platform would separately need a verified listing data source, server-side accounts and permissions, actual request delivery, availability/appointment integration and map coordinates. This release does not claim those integrations exist.
