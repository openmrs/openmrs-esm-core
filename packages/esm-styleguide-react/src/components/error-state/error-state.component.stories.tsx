import React from "react";
import { ErrorState, ErrorStateProps } from "./error-state.component";
import { Story, Meta } from "@storybook/react/types-6-0";
import "@openmrs/esm-styleguide/src/style.css";

export default {
  component: ErrorState,
  title: "ErrorState",
  argTypes: {}
} as Meta;

const Template: Story<ErrorStateProps> = args => <ErrorState {...args} />;

export const Default = Template.bind({});
Default.args = {
  error: "Error",
  headerText: "Vitals",
  status: "500",
  message: "Internal Server Error"
};
