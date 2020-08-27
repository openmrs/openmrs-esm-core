import { storiesOf } from "@storybook/html";
import html from "./main-content.stories.html";
import "./main-content.css";
import { htmlStory } from "../story-helpers";

storiesOf("OpenMRS Styleguide", module).add("Main Content", () =>
  htmlStory(html)
);
