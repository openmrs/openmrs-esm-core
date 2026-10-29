import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { Accordion, AccordionItem } from '@carbon/react';
import { ConfigTreeForModule } from './config-tree-for-module.component';
import { implementerToolsStore } from '../../store';
import { useStore } from 'zustand';
import styles from './config-tree.styles.scss';

export interface ConfigTreeProps {
  config: Record<string, any>;
}

export function ConfigTree({ config }: ConfigTreeProps) {
  const { uiSelectedPath } = useStore(implementerToolsStore);
  const focusedModule = uiSelectedPath?.[0];
  // Controlled, so that a module the user collapsed opens again each time a new path points into it.
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(() =>
    focusedModule ? { [focusedModule]: true } : {},
  );
  const [revealedPath, setRevealedPath] = useState(uiSelectedPath);
  if (uiSelectedPath !== revealedPath) {
    setRevealedPath(uiSelectedPath);
    if (focusedModule) {
      setOpenModules((current) => ({ ...current, [focusedModule]: true }));
    }
  }

  const setModuleOpen = (moduleName: string, isOpen: boolean) =>
    setOpenModules((current) => ({ ...current, [moduleName]: isOpen }));

  return (
    <Accordion align="start">
      {config &&
        Object.keys(config)
          .sort()
          .map((moduleName) => {
            const moduleConfig = config[moduleName];
            return Object.keys(moduleConfig).length ? (
              <CloseModuleContext.Provider
                key={`accordion-${moduleName}`}
                value={() => setModuleOpen(moduleName, false)}
              >
                <AccordionItem
                  title={
                    <ModuleHeading
                      moduleName={moduleName}
                      isSelected={uiSelectedPath?.length === 1 && focusedModule === moduleName}
                      uiSelectedPath={uiSelectedPath}
                    />
                  }
                  className={styles.fullWidthAccordion}
                  open={openModules[moduleName] ?? false}
                  onHeadingClick={({ isOpen }) => setModuleOpen(moduleName, isOpen)}
                  renderToggle={ModuleToggle}
                >
                  <ConfigTreeForModule config={moduleConfig} moduleName={moduleName} key={`${moduleName}-config`} />
                </AccordionItem>
              </CloseModuleContext.Provider>
            ) : null;
          })}
    </Accordion>
  );
}

const CloseModuleContext = createContext<() => void>(() => {});

/** Carbon's accordion toggle, but reporting the Escape key, which closes an item without `onHeadingClick`. */
function ModuleToggle({ onKeyDown, ...props }: React.ComponentProps<'button'>) {
  const closeModule = useContext(CloseModuleContext);

  return (
    <button
      {...props}
      type="button"
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          closeModule();
        }
        onKeyDown?.(event);
      }}
    />
  );
}

interface ModuleHeadingProps {
  moduleName: string;
  /** Whether the selected path is this module (or extension schema) as a whole. */
  isSelected: boolean;
  uiSelectedPath: Array<string> | null;
}

function ModuleHeading({ moduleName, isSelected, uiSelectedPath }: ModuleHeadingProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (isSelected) {
      headingRef.current?.scrollIntoView();
    }
  }, [isSelected, uiSelectedPath]);

  return <h6 ref={headingRef}>{moduleName}</h6>;
}
