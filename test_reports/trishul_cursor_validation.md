# Trishul cursor refinement

User choice: **Minimal antique-gold trishul with the existing subtle dotted mesh**.

Implemented as a native 32×40 SVG cursor using site gold `#a98046`, a fine ivory contrast edge, and central spear-tip hotspot `(16, 2)`. Uses CSS on hover/fine-pointer devices. Existing mesh rendering is unchanged.

Browser self-tests on the configured external preview URL:
- SVG loads/decodes at expected dimensions: PASS.
- Body, links and buttons use custom cursor with correct hotspot: PASS.
- Dotted mesh remains visible on regular desktop: PASS.
- Navigation and form typing unaffected: PASS.
- Textarea uses text cursor; disabled button uses not-allowed; enabled button returns to trishul: PASS.
- Reduced-motion preference retains static trishul and suppresses mesh: PASS.
- Emulated coarse-pointer/touch device does not enable trishul cursor; tap navigation to explorer works: PASS.

Screenshots do not capture native OS cursors. Cursor resource decode, computed CSS and hotspot were verified directly. Homepage screenshot `/app/test_reports/trishul-home.jpg` confirms unchanged layout and retained mesh.

No new dependencies, mocked integrations, authentication changes, or outstanding failures.