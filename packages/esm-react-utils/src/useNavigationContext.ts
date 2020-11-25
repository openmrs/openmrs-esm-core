import { useEffect } from "react";
import {
  NavigationContext,
  pushNavigationContext,
} from "@openmrs/esm-extensions";

export function useNavigationContext(context: NavigationContext) {
  useEffect(() => pushNavigationContext(context), []);
}
