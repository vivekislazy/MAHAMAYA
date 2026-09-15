# Mahamaya — Durga Puja Cultural Experience

## Original problem statement
build me a hi tech durga puja website where all 3d premium themes and fonts used, make smooth intros and transitions, include google map there to inspect all durga puja famous pandals in kolkata, make the map more interactive and attractive, and theme of website to look religious and event designed, include multiple web pages for all works, a music section where all bengali durga puja songs playlist is made, also include a section for a 3d game like thing where 3d pandal interactive game can be played we can click and enter pandal and see idol and like the real pandals, also include the story telling of maa durga differently, and innovatively, make the deepest details come true, because this website is made for the outsiders to visit west bengal at durga puja. also give some dotted matrix structure mesh around the cursor like ntigravity website has, also give photos section gallery of durga puja, all important dates, all types of mantras, sound effects, just very much premium , gpt 6 astra must use its top potential and add more extra stuffs as you wish maybe using other softwares too. BEST OF LUCK

## Explicit preferences and agreed first version
- Vermilion red, antique gold and warm ivory. English default with persistent Bengali option.
- Premium editorial art direction, oversized masked hero reveal, real photography, numbered chapters, slow marquee, Framer Motion and Lenis, subtle parallax, cursor dotted mesh.
- Both OpenStreetMap + Google directions and Google Maps integration selected, but no Google API key supplied. Implemented real OSM map and Google Maps outbound directions; no Google JS map required.
- Curated official YouTube recordings, crafted interactive storytelling plus live AI via universal provider key.
- 2026 visitor guide and one explorable stylized 3D pandal.

## Architecture
- React 19, CRA/Craco, React Router 7, shadcn Button/Dialog/Sonner, custom responsive editorial CSS.
- FastAPI, Motor and MongoDB using original MONGO_URL and DB_NAME. All frontend API traffic uses existing REACT_APP_BACKEND_URL.
- No auth requested. Anonymous random UUID retained in localStorage for saved trails and story history. No PII or uploads.
- Three.js 0.175.0 + Fiber 9.1.2 + Drei 10.0.7. Version alignment resolves Clock deprecation from newer Three release. 3D route lazy-loaded. Direct Drei component imports avoid unused MediaPipe source maps.
- Leaflet 1.9 + React-Leaflet 5, OSM standard tiles and attribution.
- Streaming SSE LlmChat via emergentintegrations, OpenAI `gpt-6-astra` verified available and operational. Secrets/model identifiers in backend .env. Independent Mongo story history. Error states, timeout, input length limits, basic per-IP throttling.
- Sources and caveats shown: 2026 panjika variations, approximate map pins/non-live guide, official music publishers, editorial Unsplash photographs.

## Implemented pages
1. `/`: cinematic arched Durga portrait, typography reveal, orbital outlines and stamp, hero parallax, festival ribbon, three discovery cards, marquee, story teaser, live-content date strip, visitor CTA.
2. `/explore`: 12 curated pandals, bilingual names/descriptions, English/Bengali search, regional/saved filters, linked map markers/details, approximate locations, Metro hints, Google directions, Mongo-persisted bookmarks, downloadable personal trail TXT.
3. `/experience`: real WebGL sanctuary, terracotta pillars/gilded arches, textured photo shrine, camera entry/exit/orbit/zoom, lamp lighting, three educational hotspots with discovery progress, virtual flower offering, reset and expand, WebGL fallback. Artistic environment with idol photograph, not a scanned real pandal or fully sculpted 3D idol; clearly described in UI.
4. `/story`: four illustrated mythology/cultural chapters, previous/next, three suggested questions, custom prompt, EN/BN live streamed AI story, persisted clickable history, transparent error handling and interpretation disclaimer.
5. `/music`: three verified official recordings (includes complete 89-minute Mahishasuramardini album), filters, selected track info, YouTube embedded playback and original publisher links, synthesized drum/bell pads and D/B shortcuts. No local copyrighted audio copies. YouTube availability depends on region/provider.
6. `/gallery`: seven editorial images, category filters, counts, responsive masonry, accessible shadcn lightbox with keyboard and previous/next, source attribution.
7. `/guide`: six important 2026 dates including Mahalaya, panjika caveats/source, ICS calendar download, travel/food/respect/accessibility advice, emergency tel112, five mantras with transliteration/Bengali/meaning and copy.

## APIs and Mongo
- GET /api/ health
- GET /api/pandals, GET /api/dates
- GET/PUT /api/itinerary/{visitor_id}; validate UUID, identity match, known IDs, max count, deduplicate
- POST /api/stories SSE (delta/done/error), GET /api/stories/{visitor_id}
- Collections: pandals (unique id), itineraries (unique visitor_id), stories. Exclude Mongo _id from returned data; use response models and ISO UTC dates.

## Validation
- /app/test_reports/iteration_1.json: 9/9 backend regression tests passed, extensive all-page browser flows passed including live EN/BN stories, save/reload, downloads, 3D, gallery, music, clipboard.
- Desktop, mobile 390px and tablet 768px validated without horizontal overflow.
- Found D/B hotkeys blocked after button focus; fixed guard to permit buttons and reject editable fields/modifiers/repeats. Self-test after clicking pad + D + B gives count 3.
- Three Clock deprecation resolved by matching renderer versions; sanctuary entry/hotspots/flowers reverified.
- Test report erroneously suggested 13 source pandals: direct source and public API inspection both confirmed exactly 12, so no data modification required.
- Browser screenshot driver can report GPU ReadPixels performance messages. Scene works; no outstanding functional defect observed. Aborted platform analytics requests during navigation are unrelated to app flows.
- Files under /app/test_reports include regression tests' JUnit output, screenshot checks, downloaded ICS/TXT, final build output. Agent added only backend regression test + report, no production modifications.

## Prioritized backlog / next tasks
- P0: No known unresolved core functional bugs from scoped tests.
- P1: Expand verified pandal catalogue and official recording selections; organizer-confirmed 2026 dates, access information and entry points closer to festival; shareable read-only trail links.
- P1: Commission/licence sculpted 3D idol and true photogrammetric pandal assets if exact real-pandal replicas desired.
- P2: Google Maps SDK only if user supplies suitable key and explicitly wants native Google map; audited additional languages; richer transit connections and offline visitor information.
- P2: Optional narrated stories and additional ritual interpretations after source review.

## Limitations to preserve honestly
No live crowd, opening-time or traffic feed. No fabricated 2026 theme information. The playlist is curated, not exhaustive of all Bengali music. Mantras are a starter collection, not complete ritual instruction. Artful virtual scene is not a scanned pandal. No authentication or payments. No upload/hosting functionality requested or implemented.