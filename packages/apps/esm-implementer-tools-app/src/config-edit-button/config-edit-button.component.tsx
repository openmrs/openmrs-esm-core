import React from 'react';
import { implementerToolsStore } from '../store';
import { useTranslation } from 'react-i18next';

interface ConfigEditButtonProps {
  configPath: string[];
}

export default function ConfigEditButton({ configPath }: ConfigEditButtonProps) {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => {
        implementerToolsStore.setState({ configPathBeingEdited: configPath });
      }}
    >
      {t('edit', 'Edit')}
    </button>
  );
}
