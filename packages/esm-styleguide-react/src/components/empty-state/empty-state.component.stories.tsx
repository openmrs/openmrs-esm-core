import React from "react";
import { EmptyStateProps, EmptyState } from "./empty-state.component";
import { Story } from "@storybook/react/types-6-0";
import "@openmrs/esm-styleguide/src/style.css";

export default {
  component: EmptyState,
  title: "EmptyState",
  argTypes: {}
};

const Template: Story<EmptyStateProps> = args => <EmptyState {...args} />;

export const Default = Template.bind({});
Default.args = {
  headerTitle: "Diagnosis",
  message: "There are no diagnosis to display for this patient"
};
