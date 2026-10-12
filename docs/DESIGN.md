# Atheeldar — October 2026 design and experience

## Direction

Saudi architectural editorial: warm ivory `#f7f5ef`, forest `#163d32`, brass `#b6a17a`, charcoal `#25342c`. Preserve the Atheeldar Arabic wordmark and existing monogram. IBM Plex Sans Arabic, deliberate 16–18px body and controls, restrained radii, spacious photography. Existing deep tools remain reachable in a searchable directory.

## Accepted section references

Three Image Gen references inspected before implementation: `exec-028c4a55-09b2-4105-8dec-69b7014ec675.png` (hero/search), `exec-dbf715b4-8421-4f3e-9eb4-bc40fee11e42.png` (inventory/finder), and `exec-7df8ffee-f447-4ce4-ae35-01a83555d063.png` (cities/tools/footer). References are temporary design material; the selected standalone hero asset is versioned in `public/images/atheeldar/villa-dusk.png`.

## First viewport copy and layout

82–88px ivory header; brand on right, properties/projects/neighborhoods/decision tools navigation; search, favorites and “ابدأ رحلتك” controls. Full-width dusk villa image, right-aligned “مساحتك القادمة،” / “تبدأ من هنا.”, supporting copy “بيوت تشبهك. أحياء تناسب يومك. وقرار ترى تفاصيله بوضوح.”. Primary “اكتشف العقارات”, secondary “ساعدني أختار”. Photo is natural-color, with only a neutral edge shade for legibility. Lower-left caption: “تفاصيل تصنع الفارق” / “مساحات للعيش، لا للمشاهدة فقط”. Floating ivory search: purchase/rent/invest tabs, city/type/budget, search button, city shortcut chips.

## Order and implementation

1. Hero and functioning search form.
2. Inventory directly below search, tabs for all/family/rent/investment, three readable property cards.
3. Four-step home finder: purpose, city, budget, needs; reasoned results and explicit empty states.
4. City discovery photography; existing project detail reachable through navigation and tools.
5. Open comparison/finance/viewing columns and decision tools directory.
6. Compact footer with truthful sample-catalog disclosure.

Images are standalone assets; headings, labels, icons and controls are native components. Responsive behavior changes grids to horizontal city rails or vertical property cards and stacks the finder. Reduced-motion preference respected. No fabricated live inventory, verified licensing, AI service, yields or booking dispatch claims.

## Intentional adaptations

Retain the existing monogram instead of concept-generated logo variations. Preserve actual catalog names/prices instead of generated example copy. Use real licensed city photographs, with consistent framing. Preserve useful compare/viewing controls beyond the minimal concept card. Four-step finder extends its concept to accessible result and no-result states. All old routes remain available; tools are consolidated rather than deleted.

## Verification requirements

Compare hero composition, copy, palette, Arabic typography, photo framing, search spacing, cards, finder and footer against the three references. Exercise desktop/mobile search, URL restoration, favorite/compare persistence, quick preview keyboard behavior, eligible home matches, empty states, tools navigation and production route loading. Record real verification outcomes in RELEASE.md.

## Final implementation review

The production build was inspected on 1440 px desktop and 390/360 px mobile layouts. The implemented hierarchy follows the accepted concepts: cinematic hero, floating search, visible listings, the four-question finder, city photography, decision tools and a compact footer. Arabic headings, forest/ivory/brass colors and generous spacing were retained. The existing Atheeldar wordmark was redrawn as text plus a simple arch monogram, and actual licensed city photographs replaced generic concept imagery. Mobile search filters are expandable and the navigation dock remains reachable while scrolling. Catalog imagery is served locally for consistent loading.
