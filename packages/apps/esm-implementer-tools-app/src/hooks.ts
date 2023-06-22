import { useMemo } from "react";
import type { FrontendModule } from "./types";

export function useFrontendModules(): Array<FrontendModule> {
  return useMemo(() => {
    return (window.installedModules ?? [])
      .filter((module) => Boolean(module) && Boolean(module[1]))
      .map((module) => ({
        ...module[1],
        name: module[0],
      }));
  }, []);
}
