import { useEffect } from "react";
import {
  NavigationContext,
  pushNavigationContext,
} from "@openmrs/esm-extensions";

/**
 * @deprecated Don't use this anymore.
 */
export function useNavigationContext(context: NavigationContext) {
  useEffect(() => pushNavigationContext(context), []);
}
