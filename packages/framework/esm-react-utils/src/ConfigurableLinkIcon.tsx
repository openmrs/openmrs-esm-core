import React from 'react';
import { ConfigurableLink } from '@openmrs/esm-react-utils/src/ConfigurableLink';
import { Button } from '@carbon/react';

export interface ConfigurableIconProps {
  renderIcon: React.ComponentType<any>;
  path: string;
  name: string;
}
const ConfigurableLinkIcon: React.FC<ConfigurableIconProps> = ({ renderIcon, path, name }) => {
  return (
    <ConfigurableLink to={path}>
      <Button
        styles={{ marginTop: '0.75rem' }}
        hasIconOnly
        aria-label="Configurable link icon"
        size="sm"
        kind="ghost"
        renderIcon={renderIcon}
        iconDescription="Link"
      /> {name}
    </ConfigurableLink>
  );
};

export default ConfigurableLinkIcon;
