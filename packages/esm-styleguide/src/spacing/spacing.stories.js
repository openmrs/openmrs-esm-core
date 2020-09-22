import { storiesOf } from "@storybook/html";
import html from "./spacing.stories.html";
import "./spacing.css";
import { htmlStory } from "../story-helpers";

storiesOf("OpenMRS Styleguide", module).add(
  "Spacing, Padding, and Margin",
  () => htmlStory(html)
);
