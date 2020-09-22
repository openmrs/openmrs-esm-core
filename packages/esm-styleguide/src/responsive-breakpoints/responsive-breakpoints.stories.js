import { storiesOf } from "@storybook/html";
import html from "./responsive-breakpoints.stories.html";
import "./responsive-breakpoints.js";
import { htmlStory } from "../story-helpers";

storiesOf("OpenMRS Styleguide", module).add("Responsive Breakpoints", () =>
  htmlStory(html)
);
