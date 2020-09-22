import { storiesOf } from "@storybook/html";
import { htmlStory } from "../story-helpers";
import ejs from "ejs";
import html from "./input.stories.html";
import { radios, boolean, select } from "@storybook/addon-knobs";
import "./input.css";

storiesOf("OpenMRS Styleguide", module).add("Inputs", () => {
  const inputType = select(
    "Type",
    {
      Underlined: "underlined",
      Filled: "filled",
      Outlined: "outlined",
    },
    "outlined"
  );

  const isDanger = boolean("Is Danger", false);

  const determineStyle = (inputType, isDanger) =>
    `omrs-input-${inputType} ${isDanger ? "omrs-input-danger" : ""}`.trim();

  return htmlStory(
    ejs.render(html, {
      determineStyle,
      inputType,
      isDanger,
    })
  );
});
