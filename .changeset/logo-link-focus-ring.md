---
'@openmrs/esm-primary-navigation-app': patch
---

(fix) Centre the navbar logo and give its link a focus ring that matches the other header actions. The logo link had no focus style, so keyboard focus showed the browser's default rounded blue ring. It now shows the same 2px white ring as the header actions. The link also fills the header height with even padding, so the logo sits in the middle of the ring: before, the 16px gap on its left sat inside the link and the SVG's text baseline pushed the logo up. A logo configured as a name now shows as white text instead of a blue underlined link.
