import { Type } from "@openmrs/esm-framework";

export interface ImplementerToolsOwnConfig {
  allowConfigPost: boolean;
  configPostUrl: string;
}

export const configSchema = {
  allowConfigPost: {
    _default: true,
    _type: Type.Boolean,
    _description: "Whether to show a 'Save Config to Server' button",
  },
  configPostUrl: {
    _default: "/${openmrsBase}/ws/spa/config.json",
    _type: Type.String,
    _description:
      "The URL to post the config to when 'Save Config to Server' is clicked.",
  },
};
