export interface MenuButtonProps {
  isActivePanel(panelName: string): boolean;
  togglePanel(panelName: string): void;
  hidePanel: (panelName: string) => () => void;
}
