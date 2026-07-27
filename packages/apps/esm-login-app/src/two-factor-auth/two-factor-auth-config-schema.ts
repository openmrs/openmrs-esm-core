import { Type } from '@openmrs/esm-framework';

export const twoFactorAuthConfigSchema = {
  enabled: {
    _type: Type.Boolean,
    _default: false,
    _description: 'Whether Two Factor Authentication is enabled or not',
  },
  dashboardTitle: {
    _type: Type.Object,
    _default: {
      key: 'twoFactorAuth',
      value: 'Two-Factor Authentication',
    },
    _description: 'The title of the Two Factor Authentication page',
    key: {
      _type: Type.String,
    },
    value: {
      _type: Type.String,
    },
  },
};

export interface TwoFactorAuthConfigObject {
  enabled: boolean;
  dashboardTitle: {
    key: string;
    value: string;
  };
}
