/** @module @category Workspace */
import React from 'react';
import classNames from 'classnames';
import { Button, IconButton } from '@carbon/react';
import { useLayoutType } from '@openmrs/esm-react-utils';
import styles from './action-menu-button.module.scss';

interface TagsProps {
  getIcon: (props: object) => JSX.Element;
  formOpenInTheBackground: boolean;
  tagContent?: string | React.ReactNode;
}

function Tags({ getIcon, formOpenInTheBackground, tagContent }: TagsProps) {
  return (
    <>
      {getIcon({ size: 16 })}

      {formOpenInTheBackground ? (
        <span className={styles.interruptedTag}>!</span>
      ) : (
        <span className={styles.countTag}>{tagContent}</span>
      )}
    </>
  );
}

export interface ActionMenuButtonProps {
  getIcon: (props: object) => JSX.Element;
  label: string;
  tagContent?: string | React.ReactNode;
  workspaceName: string;
  launchWorkspaceProps: {};
}

export const ActionMenuButton2: React.FC<ActionMenuButtonProps> = ({
  getIcon,
  label,
  tagContent,
  workspaceName,
  launchWorkspaceProps
}) => {
  const layout = useLayoutType();
  // const { workspaces, workspaceWindowState } = useWorkspaces();
  // const workspaceIndex = workspaces?.findIndex(({ type: workspaceType }) => workspaceType === type) ?? -1;
  // const isWorkspaceActive = workspaceWindowState !== 'hidden' && workspaceIndex === 0;
  const isWorkspaceActive = false;
  const formOpenInTheBackground = false;

  const onClick = () => {
    // TODO: if opened and hidden, restore it
    // launchWorkspace(workspaceName, launchWorkspaceProps);
  }

  if (layout === 'tablet' || layout === 'phone') {
    return (
      <Button
        className={classNames(styles.container, { [styles.active]: isWorkspaceActive })}
        iconDescription={label}
        kind="ghost"
        onClick={onClick}
        role="button"
        tabIndex={0}
        size="md"
      >
        <span className={styles.elementContainer}>
          <Tags formOpenInTheBackground={formOpenInTheBackground} getIcon={getIcon} tagContent={tagContent} />
        </span>
        <span>{label}</span>
      </Button>
    );
  }

  return (
    <IconButton
      align="left"
      aria-label={label}
      className={classNames(styles.container, {
        [styles.active]: isWorkspaceActive,
      })}
      enterDelayMs={300}
      kind="ghost"
      label={label}
      onClick={onClick}
      size="md"
    >
      <div className={styles.elementContainer}>
        <Tags formOpenInTheBackground={formOpenInTheBackground} getIcon={getIcon} tagContent={tagContent} />
      </div>
    </IconButton>
  );
};
