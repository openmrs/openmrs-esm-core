import { useEffect, useState } from "react";
import { FrontendModule } from "../backend-dependencies/openmrs-backend-dependencies";

let cachedFrontendModules: Array<FrontendModule>;

export function getModules(): Array<FrontendModule> {
  if (!cachedFrontendModules) {
    cachedFrontendModules = (window.installedModules ?? [])
      .filter((module) => Boolean(module) && Boolean(module[1]))
      .map((module) => ({
        dependencies: [],
        version: module[1].version,
        name: module[0],
      }));
  }

  return cachedFrontendModules;
}

export function useFrontendModules() {
  return getModules();
}
