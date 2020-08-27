import { storiesOf } from "@storybook/html";
import html from "./cards.stories.html";
import "./cards.css";
import ejs from "ejs";
import { text, withKnobs } from "@storybook/addon-knobs";
import { htmlStory } from "../story-helpers";

storiesOf("OpenMRS Styleguide", module).add("Cards", () => {
  const cardText = text("Card text", "This is an OpenMRS card.");
  return htmlStory(ejs.render(html, { text: cardText }));
});
