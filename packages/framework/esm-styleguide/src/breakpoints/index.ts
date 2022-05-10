const BREAKPOINT_PHONE_MIN = 0;
const BREAKPOINT_PHONE_MAX = 600;

const BREAKPOINT_TABLET_MIN = 601;
const BREAKPOINT_TABLET_MAX = 1023;

const BREAKPOINT_SMALL_DESKTOP_MIN = 1024;
const BREAKPOINT_SMALL_DESKTOP_MAX = 1439;

const BREAKPOINT_LARGE_DESKTOP_MIN = 1440;
const BREAKPOINT_LARGE_DESKTOP_MAX = Number.MAX_SAFE_INTEGER;

function setBodyCssClasses() {
  document.body.classList.toggle(
    "omrs-breakpoint-lt-tablet",
    window.innerWidth <= BREAKPOINT_PHONE_MAX
  );

  document.body.classList.toggle(
    "omrs-breakpoint-gt-phone",
    window.innerWidth >= BREAKPOINT_TABLET_MIN
  );

  document.body.classList.toggle(
    "omrs-breakpoint-gt-tablet",
    window.innerWidth >= BREAKPOINT_SMALL_DESKTOP_MIN
  );
  document.body.classList.toggle(
    "omrs-breakpoint-lt-small-desktop",
    window.innerWidth < BREAKPOINT_SMALL_DESKTOP_MIN
  );

  document.body.classList.toggle(
    "omrs-breakpoint-gt-small-desktop",
    window.innerWidth >= BREAKPOINT_LARGE_DESKTOP_MIN
  );
}

export function integrateBreakpoints() {
  window.addEventListener("resize", setBodyCssClasses);
  setBodyCssClasses();
}
