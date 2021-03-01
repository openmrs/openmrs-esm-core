import React from "react";
import EmptyState from "./empty-state.component";
import "@openmrs/esm-styleguide/src/style.css";
export default {
  component: EmptyState,
  title: "EmptyState"
};

export const Default = () => (
  <EmptyState headerTitle="Diagnosis" displayText="diagnosis" />
);
