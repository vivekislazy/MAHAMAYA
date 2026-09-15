# Post-report fixes

- Fixed Music D/B shortcuts after sound-pad button focus. Browser check clicked drum pad, then D then B; expected and actual count **3**.
- Updated Three.js to 0.175.0, compatible with Fiber 9.1.2/Drei10.0.7. `THREE.Clock` deprecation no longer emitted. No source changes to framework internals.
- Rechecked real 3D scene rendering, camera entry, idol hotspot open/close, and flower offering: passed.
- Memoized data/story fetch callbacks to remove React hook dependency warnings.
- Source and API pandal count each verified **12**, not 13 as noted in original report. No data correction needed.
- Screenshots: `music-shortcut-fixed.jpg`, `sanctuary-final.jpg`.
- Remaining headless browser ReadPixels messages are renderer/screenshot driver performance diagnostics, not broken app interactions.
- Final production build after direct Drei imports: **Compiled successfully**, without React hook or missing source-map warnings. Log: `/app/test_reports/final-build.log`.