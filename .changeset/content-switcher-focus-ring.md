---
'@openmrs/esm-styleguide': patch
---

(fix) Show the focus ring on the selected content switcher button. The styleguide removed the box shadow from the selected button's `::after`, which is where Carbon draws the focus ring. Carbon's content switcher moves the selection with the arrow keys, so keyboard focus always lands on the selected button, and keyboard users saw no focus indicator at all. The selected button now shows Carbon's focus ring when it has focus. The implementer tools' dark theme switcher doesn't change.
