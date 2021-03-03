import React from "react";
import { Story, Meta } from "@storybook/react/types-6-0";
import "@openmrs/esm-styleguide/src/style.css";
import SummaryCard from "./summary-card.component";

export default {
  component: SummaryCard,
  title: "Cards/SummaryCard",
  argTypes: {}
} as Meta;

const Template = args => <SummaryCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "Summary card",
  children: (
    <div>
      <p>Child component</p>
    </div>
  )
};
