const path = require("path");
const fs = require("fs");

describe("svgs", () => {
  const svgs = [];

  beforeAll(() => {
    // eslint-disable-next-line no-undef
    const svgFilePaths = fs.readdirSync(path.join(__dirname, "svgs"));
    const domParser = new DOMParser();

    svgFilePaths.forEach((filePath) => {
      const svgString = fs.readFileSync(
        // eslint-disable-next-line no-undef
        path.resolve(__dirname, "svgs", filePath)
      );
      const svgDoc = domParser.parseFromString(svgString, "text/html");
      const svgEl = svgDoc.querySelector("svg");
      if (svgEl) {
        svgs.push({ filePath, svgEl: svgEl, svgDoc });
      }
    });
  });

  it("does not have a specified fill color, so that the color can be specified by css", () => {
    svgs.forEach((svg) => {
      if (svg.svgDoc.querySelector("[fill]")) {
        fail(
          `svg ${svg.filePath} has a "fill" attribute in it, which makes it impossible for CSS to change its color\n${svg.svgEl.outerHTML}`
        );
      }
    });
  });

  it('has a viewBox="0 0 24 24" attribute on the svg', () => {
    svgs.forEach((svg) => {
      if (svg.svgEl.getAttribute("viewBox") !== "0 0 24 24") {
        // If we get an svg that isn't based on a 24px grid, we can update this test to allow for other viewBoxes.
        fail(
          `svg ${svg.filePath} does not have viewBox="0 0 24 24", which makes it impossible for CSS to change its size\n${svg.svgEl.outerHTML}`
        );
      }
    });
  });

  it("should have a title tag defined for the svg", () => {
    svgs.forEach((svg) => {
      if (svg.svgEl.querySelector("title") === null) {
        fail(`svg ${svg.filePath} does not have a title defined for it`);
      }
    });
  });

  it("should have a text description on the title tag", () => {
    svgs.forEach((svg) => {
      if (svg.svgEl.querySelector("title").innerHTML === "") {
        fail(`svg ${svg.filePath} does not have a title defined for it`);
      }
    });
  });
});
