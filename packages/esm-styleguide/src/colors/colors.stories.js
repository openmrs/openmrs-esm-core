import { storiesOf } from "@storybook/html";
import html from "./colors.stories.html";
import "./colors.css";
import { htmlStory } from "../story-helpers";
import { select } from "@storybook/addon-knobs";
import ejs from "ejs";

export const options = {
  "Background high contrast": "--omrs-color-bg-high-contrast",
  "Background medium contrast": "--omrs-color-bg-medium-contrast",
  "Background low contrast": "--omrs-color-bg-low-contrast",
  "Background lowest contrast": "--omrs-color-bg-lowest-contrast",

  "Ink high contrast": "--omrs-color-ink-high-contrast",
  "Ink medium contrast": "--omrs-color-ink-medium-contrast",
  "Ink low contrast": "--omrs-color-ink-low-contrast",
  "Ink lowest contrast": "--omrs-color-ink-lowest-contrast",
  "Ink white": "--omrs-color-ink-white",

  "Interaction plus two": "--omrs-color-interaction-plus-two",
  "Interaction plus one": "--omrs-color-interaction-plus-one",
  Interaction: "--omrs-color-interaction",
  "Interaction minus one": "--omrs-color-interaction-minus-one",
  "interaction minus two": "--omrs-color-interaction-minus-two",

  Success: "--omrs-color-success",
  "Success two": "--omrs-color-success-two",
  Warning: "--omrs-color-warning",
  "Warning two": "--omrs-color-warning-two",
  Danger: "--omrs-color-danger",
  "Danger two": "--omrs-color-danger-two",

  "Color brand orange": "--omrs-color-brand-orange",
  "Color brand violet": "--omrs-color-brand-violet",
  "Color brand gold": "--omrs-color-brand-gold",
  "Color brand teal": "--omrs-color-brand-teal",
  "Color brand black": "--omrs-color-brand-black",
};

storiesOf("OpenMRS Styleguide", module).add("Colors", () => {
  const defaultValue = "--omrs-color-success";

  const chosenColor = select("OpenMRS Color", options, defaultValue);

  return htmlStory(
    ejs.render(html, { chosenColor, colors: Object.entries(options) })
  );
});
