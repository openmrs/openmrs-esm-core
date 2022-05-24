export const Breakpoint = {
  PHONE_MIN: 0,
  PHONE_MAX: 600,
  TABLET_MIN: 601,
  TABLET_MAX: 1023,
  SMALL_DESKTOP_MIN: 1024,
  SMALL_DESKTOP_MAX: 1439,
  LARGE_DESKTOP_MIN: 1440,
  LARGE_DESKTOP_MAX: Number.MAX_SAFE_INTEGER,
} as const;

function setBodyCssClasses() {
  document.body.classList.toggle(
    "omrs-breakpoint-lt-tablet",
    window.innerWidth < Breakpoint.TABLET_MIN
  );
  document.body.classList.toggle(
    "omrs-breakpoint-gt-phone",
    window.innerWidth > Breakpoint.PHONE_MAX
  );
  document.body.classList.toggle(
    "omrs-breakpoint-gt-tablet",
    window.innerWidth > Breakpoint.TABLET_MAX
  );
  document.body.classList.toggle(
    "omrs-breakpoint-lt-desktop",
    window.innerWidth < Breakpoint.SMALL_DESKTOP_MIN
  );
  document.body.classList.toggle(
    "omrs-breakpoint-lt-small-desktop",
    window.innerWidth < Breakpoint.SMALL_DESKTOP_MIN
  );
  document.body.classList.toggle(
    "omrs-breakpoint-lt-large-desktop",
    window.innerWidth < Breakpoint.LARGE_DESKTOP_MIN
  );
  document.body.classList.toggle(
    "omrs-breakpoint-gt-small-desktop",
    window.innerWidth > Breakpoint.SMALL_DESKTOP_MAX
  );
}

export function integrateBreakpoints() {
  window.addEventListener("resize", setBodyCssClasses);
  setBodyCssClasses();
}
