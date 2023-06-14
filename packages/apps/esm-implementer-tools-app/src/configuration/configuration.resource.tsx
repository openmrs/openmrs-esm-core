import { Config, openmrsFetch, showNotification } from "@openmrs/esm-framework";

export async function saveConfig(config: Config) {
  return openmrsFetch(`/frontend/config.json`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
    body: config,
  });
}
