import { storiesOf } from "@storybook/html";
import html from "./button-icons.stories.html";
import "./button-icons.css";
import ejs from "ejs";
import { htmlStory } from "../story-helpers";
import { select } from "@storybook/addon-knobs";
import { icons } from "../icons/icons.stories.js";

storiesOf("OpenMRS Styleguide", module).add("Button icons", () => {
  const sizeOptions = {
    Medium: "medium",
    Large: "large",
  };

  const iconChoice = select("Icon", icons, "visibility");

  const size = select("Size", sizeOptions, "medium");

  const href = `#omrs-icon-${iconChoice}`;

  const btnSize = `omrs-btn-icon-${size}`;

  return htmlStory(ejs.render(html, { href, btnSize }));
});
