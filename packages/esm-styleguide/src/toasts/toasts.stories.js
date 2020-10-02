import { storiesOf } from "@storybook/html";
import html from "./toasts.stories.html";
import "./toasts.css";
import ejs from "ejs";

import { htmlStory } from "../story-helpers";

storiesOf("OpenMRS Styleguide", module).add("Toasts", () => {
  return htmlStory(ejs.render(html));
});
