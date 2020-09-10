#! /usr/bin/env node
var browserSync = require("browser-sync");

browserSync({
  proxy: "https://openmrs-spa.org/",
  files: ["../omod/src/main/webapp/resources/openmrs.js"],
  serveStatic: ["dist"],
  open: false,
  rewriteRules: [
    {
      match: new RegExp("openmrs/moduleResources/spa/openmrs.js"),
      fn: function () {
        return "openmrs.js";
      },
    },
  ],
});
