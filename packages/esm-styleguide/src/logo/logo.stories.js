import { storiesOf } from "@storybook/html";
import { htmlStory } from "../story-helpers";
import ejs from "ejs";
import html from "./logo.stories.html";
import { radios } from "@storybook/addon-knobs";
import "./logo.js";

storiesOf("OpenMRS Styleguide", module).add("Logos", () => {
  const logoType = radios(
    "Logo Type",
    {
      Full: "full",
      Partial: "partial",
      Icon: "icon",
    },
    "full"
  );

  const logoColor = radios(
    "Logo Color",
    {
      "With Colors": "color",
      "Mono / Grey": "mono",
      Grey: "grey",
    },
    "color"
  );

  const href = `#omrs-logo-${logoType}-${logoColor}`;

  return htmlStory(ejs.render(html, { href }));
});
