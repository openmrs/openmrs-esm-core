import { Type } from "@openmrs/esm-framework";

export const esmStyleGuideSchema = {
  "Brand color #1": {
    _default: "#005d5d",
    _type: Type.String,
  },
  "Brand color #2": {
    _default: "#004144",
    _type: Type.String,
  },
  "Brand color #3": {
    _default: "#007d79",
    _type: Type.String,
  },
  preferredCalendar: {
    _type: Type.Object,
    _default: {
      am: "ethiopic",
    },
  },
};
