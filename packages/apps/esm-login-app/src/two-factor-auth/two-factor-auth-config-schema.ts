import { Type } from '@openmrs/esm-framework';

export const twoFactorAuthConfigSchema = {
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
  dashboardTitle: {
    key: string;
    value: string;
  };
}
