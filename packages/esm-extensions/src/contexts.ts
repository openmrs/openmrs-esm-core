import { navigate } from "@openmrs/esm-config";

const fallbackType: NavigationContextType = "link";
const navigationContexts: Array<NavigationContext> = [
  {
    type: fallbackType,
    handler(link) {
      navigate({ to: link });
      return true;
    },
  },
];

export type NavigationContextType = "workspace" | "dialog" | "link";

export interface NavigationContext {
  type: NavigationContextType;
  handler<T = any>(link: string, state: T): boolean;
}

export function switchTo<T>(
  type: NavigationContextType,
  link: string,
  state?: T
) {
  for (let i = navigationContexts.length; i--; ) {
    const context = navigationContexts[i];

    if (context.type === type && context.handler(link, state)) {
      return;
    }
  }

  switchTo(fallbackType, link, state);
}

export function pushNavigationContext(context: NavigationContext) {
  navigationContexts.push(context);
  return () => {
    const index = navigationContexts.indexOf(context);
    navigationContexts.splice(index, 1);
  };
}
