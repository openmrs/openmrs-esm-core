export interface MenuButtonProps {
  isActivePanel(panelName: string): boolean;
  togglePanel(panelName: string);
  hidePanel: (panelName: string) => () => void;
}
