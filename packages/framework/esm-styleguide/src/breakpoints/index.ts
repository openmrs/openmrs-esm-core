function setBodyCssClasses() {
  document.body.classList.toggle(
    "omrs-breakpoint-lt-tablet",
    window.innerWidth <= 600
  );
  document.body.classList.toggle(
    "omrs-breakpoint-gt-phone",
    window.innerWidth > 600
  );
  document.body.classList.toggle(
    "omrs-breakpoint-lt-desktop",
    window.innerWidth < 1024
  );
  document.body.classList.toggle(
    "omrs-breakpoint-gt-tablet",
    window.innerWidth >= 1024
  );
}

export function integrateBreakpoints() {
  window.addEventListener("resize", setBodyCssClasses);
  setBodyCssClasses();
}
