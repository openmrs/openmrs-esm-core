import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import { Button } from "carbon-components-react";
import "@openmrs/esm-styleguide/src/style.css";
import HorizontalLabelValue, {
  HorizontalLabelValueProps
} from "./horizontal-label-value.component";

export default {
  component: HorizontalLabelValue,
  title: "Cards/HorizontalLabelValue",
  argTypes: {}
} as Meta;

const Template: Story<HorizontalLabelValueProps> = args => (
  <HorizontalLabelValue {...args} />
);

export const Default = Template.bind({});
Default.args = {
  label: "label",
  value: <Button>Button</Button>,
  specialKey: true
};
