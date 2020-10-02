window.addEventListener("resize", setBodyCssClasses);

if (document.readyState === "complete") {
  setBodyCssClasses();
} else {
  window.addEventListener("load", setBodyCssClasses);
}

function setBodyCssClasses() {
  document.body.classList.toggle(
    "omrs-breakpoint-lt-tablet",
    window.innerWidth < 600
  );
  document.body.classList.toggle(
    "omrs-breakpoint-gt-phone",
    window.innerWidth >= 600
  );
  document.body.classList.toggle(
    "omrs-breakpoint-lt-desktop",
    window.innerWidth < 1200
  );
  document.body.classList.toggle(
    "omrs-breakpoint-gt-tablet",
    window.innerWidth >= 1200
  );
}
