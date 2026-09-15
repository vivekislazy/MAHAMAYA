# Immersive upgrade — final verification

## Scope
Tilted interactive trishul + click flourish and mesh; rotating alpona; detailed 3D architecture/materials/offerings/lighting/incense; stylized animated worshipper; ritual camera; motion controls; EN/BN labels. No backend, authentication, provider or dependency changes.

## Initial agent validation
`iteration_2.json`: core cursor interactions, cultural decorations, all 3 discoveries, sanctuary lamps/offerings/reset/expand/Escape, ritual and altar views, translation, desktop/mobile/tablet fit and original route smoke tests passed. Reported four follow-ups were addressed below.

## Fixes and follow-up checks
1. **Dynamic reduced motion:** Replaced the Framer reduced-motion hook for scene logic with a `useSyncExternalStore` subscription to the actual browser media query. Three consecutive reduce → no-preference cycles update disabled state and animation state correctly without reload. Manual pause/resume also passes.
2. **Background and visibility pausing:** Added focus/blur, visibilitychange, pagehide/pageshow, and interaction recovery signals. A scene stops when less than 12% is unobscured by the sticky header. Browser blur/focus and mostly-hidden/footer → visible transitions passed. Initial footer test still had a narrow part of the scene visible; threshold now intentionally handles mostly-hidden scenes too.
3. **Map readiness:** React-Leaflet does not forward arbitrary data props onto the native MapContainer div. Set test marker and readiness on `map.getContainer()` instead. Added ResizeObserver invalidation. Three consecutive sanctuary → explorer → sanctuary journeys passed, including 12 markers, search, and actual map readiness. Tile abort messages during map fly/route teardown are expected cancellation, not failed map state.
4. **Mobile readability:** Mobile controls now use an explicit two-column grid, 11px high-contrast labels, minimum 42px targets, and a full-width 46px entry action. Original mobile/tablet flows were validated by the agent before this readability refinement.
5. **Cursor cleanup:** Initial visual review caught a null ref during cleanup. Capture DOM elements inside effect so cleanup does not dereference cleared React refs. Subsequent navigation and cursor checks passed.
6. **Visual refinement:** Settled offerings on the upper altar surface and reduced the worshipper gesture excursion. Final detailed ritual screenshot captured after all functional fixes.

## Final evidence
- `/app/test_reports/immersive-upgrade-build.log`: **Compiled successfully**.
- Screenshot artifacts: upgraded-home.jpg, upgraded-threshold.jpg, upgraded-interior.jpg, upgraded-ritual.jpg, upgrade-final-ritual.jpg (where available in screenshot tool's persistent output).
- Final browser log: `/root/.emergent/automation_output/20260915_163931/console_20260915_163931.log`.
- Three preference-cycle/manual/focus checks: `/root/.emergent/automation_output/20260915_163656/console_20260915_163656.log`.

No outstanding reproduced core functional defect. The 3D figure and sacred arrangements are artistic/stylized rather than photoreal scans; the shrine remains a photograph in a 3D setting, accurately disclosed in the UI.