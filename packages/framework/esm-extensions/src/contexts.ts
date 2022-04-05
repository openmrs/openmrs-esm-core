import { navigate } from "@openmrs/esm-config";

export type NavigationContextType = "workspace" | "dialog" | "link";

export interface NavigationContext {
  type: NavigationContextType;
  handler<T = any>(link: string, state: T): boolean;
}

/**
 * @deprecated use `navigate` directly
 */
export function switchTo<T>(
  _type: NavigationContextType,
  link: string,
  _state?: T
) {
  navigate({ to: link });
}

/**
 * @deprecated don't use
 */
export function pushNavigationContext(_context: NavigationContext) {
  return () => {
    //STUB - remove soon
  };
}
