---
'@openmrs/esm-styleguide': patch
---

(fix) Fix styleguide overrides that broke layouts, focus rings and hover states, and remove ones that no longer match anything.

- In right-to-left languages, pages whose `main` element wraps a `section` (like Patient lists and Laboratory) left an empty 16rem gap next to the left nav. `main` already makes room for the nav, so the extra margin on the `section` doubled it.
- In right-to-left languages, primary and tertiary buttons used fixed padding instead of Carbon's padding for each size. Small buttons grew from 32px to 42px, and icon-only tertiary buttons grew from 48px to 80px wide with the icon off-centre. Carbon already flips button padding for right-to-left, so the fixed padding is gone.
- Every Carbon table toolbar was absolutely positioned, so it sat on top of the table header. Many apps undid this in their own styles. Toolbars now follow the normal layout again.
- The selected content switcher lost its keyboard focus ring.
- Zebra-striped tables hid the hover and selected colours on their rows.
- The tertiary action button in low-contrast actionable notifications didn't change colour on hover, focus or press. It now uses Carbon's blue styles in every state.
- Removed overrides that had no effect: the definition tooltip underline (Carbon 11 renders `.cds--definition-term`, not `.cds--tooltip--definition`), the fixed `left` and `top` on flipped overflow menus (Carbon positions those menus with inline styles), and a `p` text-align rule in right-to-left accordions (it only matched titles passed as a `<p>`, and Carbon's `text-align: start` already right-aligns those).
