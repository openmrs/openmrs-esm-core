import { storiesOf } from "@storybook/html/dist/client/preview";
import { htmlStory } from "./story-helpers";
import html from "./intro.stories.html";

storiesOf("OpenMRS Styleguide", module).add("Styleguide Intro", () =>
  htmlStory(html)
);
