import { storiesOf } from "@storybook/html";
import { htmlStory } from "../story-helpers";
import ejs from "ejs";
import html from "./buttons-and-links.stories.html";
import { radios, boolean, select, button } from "@storybook/addon-knobs";
import "./buttons-and-links.css";

storiesOf("OpenMRS Styleguide", module).add("Links and Buttons", () => {
  const buttonType = select(
    "Type",
    {
      Unstyled: "unstyled",
      Filled: "filled",
      Outlined: "outlined",
      Text: "text",
    },
    "filled"
  );

  const styleType = radios(
    "Style type",
    {
      Action: "action",
      Neutral: "neutral",
      Destructive: "destructive",
      Disabled: "disabled",
    },
    "action"
  );

  const isRounded = boolean("Rounded", false);

  const isLarge = boolean("Large", false);

  return htmlStory(
    ejs.render(html, {
      determineStyle,
      disabledAttribute,
      buttonType,
      styleType,
      isRounded,
      isLarge,
    })
  );
});

function determineStyle(
  elementType,
  buttonType,
  styleType,
  isRounded,
  isLarge
) {
  const isButton = elementType === "button";
  if (buttonType === "unstyled") {
    return `omrs-unstyled ${
      isButton || styleType !== "disabled" ? "" : "omrs-disabled"
    }`.trim();
  }
  const elementName = isButton ? "btn" : "link";
  const disabledClass =
    !isButton && styleType === "disabled" ? " omrs-disabled" : "";
  const suffix = styleType === "disabled" ? "" : `-${styleType}`;
  const styles = `omrs-${elementName} omrs-${buttonType}${suffix}${disabledClass}`;
  if (!isRounded && isLarge) {
    return `${styles} omrs-${elementName}-lg`;
  } else if (isRounded && !isLarge) {
    return `${styles} omrs-rounded`;
  } else if (isRounded && isLarge) {
    return `${styles} omrs-rounded-lg`;
  }
  return styles;
}

function disabledAttribute(styleType) {
  return styleType === "disabled" ? "disabled" : "";
}
