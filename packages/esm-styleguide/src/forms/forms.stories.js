import { storiesOf } from "@storybook/html/dist/client/preview";
import html from "./forms.stories.html";
import { htmlStory } from "../story-helpers";
import "./forms.css";
import { select, boolean } from "@storybook/addon-knobs";
import ejs from "ejs";

storiesOf("OpenMRS Styleguide", module).add("Forms", () => {
  const inputType = select(
    "Type",
    {
      CheckBox: "checkbox",
      Radio: "radio",
      Date: "date",
      ToggleButton: "toggleButton",
      IncrementButtons: "incrementButton",
    },
    "checkbox"
  );

  const determineInputType = (inputType) => {
    switch (inputType) {
      case "checkbox":
        return "checkbox";
      case "radio":
        return "radio";
      case "date":
        return "date";
      case "toggleButton":
        return "toggleButton";
      case "incrementButton":
        return "incrementButton";
    }
  };

  const determineStyle = (inputType) => {
    switch (inputType) {
      case "checkbox":
        return "omrs-checkbox";
      case "radio":
        return "omrs-radio-button";
      case "date":
        return "omrs-datepicker";
    }
  };

  return htmlStory(
    ejs.render(html, {
      determineInputType,
      inputType,
      determineStyle,
    })
  );
});
