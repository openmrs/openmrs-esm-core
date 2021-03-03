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
  error: {
    response: {
      status: "500",
      statusText: "Internal Server Error"
    }
  },
  headerTitle: "Vitals"
};
