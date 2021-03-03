import React from "react";
import { EmptyStateProps, EmptyState } from "./empty-state.component";
import { Story, Meta } from "@storybook/react/types-6-0";
import "@openmrs/esm-styleguide/src/style.css";

export default {
  component: EmptyState,
  title: "EmptyState",
  argTypes: {}
} as Meta;

const Template: Story<EmptyStateProps> = args => <EmptyState {...args} />;

export const Default = Template.bind({});
Default.args = {
  headerTitle: "Diagnosis",
  displayText: "diagnosis"
};
