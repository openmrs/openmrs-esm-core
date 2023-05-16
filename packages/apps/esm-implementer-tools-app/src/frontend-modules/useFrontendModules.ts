import { useMemo } from "react";
import { FrontendModule } from "./frontend-modules.component";

export function useFrontendModules() {
  return useMemo<Array<FrontendModule>>(() => {
    return (window.installedModules ?? [])
      .filter((module) => Boolean(module) && Boolean(module[1]))
      .map((module) => ({
        version: module[1].version,
        name: module[0],
      }));
  }, []);
}
