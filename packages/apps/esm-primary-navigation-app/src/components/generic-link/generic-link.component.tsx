import React from 'react';
import { ConfigurableLink, Type, useConfig, validators } from '@openmrs/esm-framework';

export const genericLinkConfigSchema = {
  title: {
    _default: 'New Link',
    _type: Type.String,
  },
  target: {
    _default: '#',
    _type: Type.String,
    _description: 'The URL to link to.',
    _validators: [validators.isUrl],
  },
};

export interface GenericLinkConfig {
  title: string;
  target: string;
}

export default function GenericLink() {
  const config = useConfig<GenericLinkConfig>();
  return <ConfigurableLink to={config.target}>{config.title}</ConfigurableLink>;
}
