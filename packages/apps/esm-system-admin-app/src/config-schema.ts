import { Type } from "@openmrs/esm-framework";

export const configSchema = {
  oclLink: {
    _type: Type.String,
    _description: "Provides link to OCL",
    _default: "http",
  },
};
