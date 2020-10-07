import { resolve } from "path";
import { existsSync, readFileSync } from "fs";

export interface ImportmapDeclaration {
  type: "inline" | "url";
  value: string;
}

export function checkImportmapJson(value: string) {
  try {
    const content = JSON.parse(value);
    return typeof content === "object" && typeof content.imports === "object";
  } catch {
    return false;
  }
}

export function getImportmap(value: string): ImportmapDeclaration {
  if (!/https?:\/\//.test(value)) {
    const path = resolve(process.cwd(), value);

    if (existsSync(path)) {
      const content = readFileSync(path, "utf8");
      const valid = checkImportmapJson(content);

      if (!valid) {
        console.warn(
          `The importmap provided in "${value}" does not seem right. Skipping.`
        );
      }

      return {
        type: "inline",
        value: valid ? content : "",
      };
    } else if (checkImportmapJson(value)) {
      return {
        type: "inline",
        value,
      };
    }
  }

  return {
    type: "url",
    value,
  };
}
