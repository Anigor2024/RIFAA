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
