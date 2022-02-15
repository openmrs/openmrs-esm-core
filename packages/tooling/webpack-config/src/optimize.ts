import * as types from "@babel/types";
import { transformSync, Node } from "@babel/core";
import { readFileSync, writeFileSync } from "fs";
import { resolve, dirname } from "path";

const exportedSetupFunctionName = "setupOpenMRS";
const assetsPropertyName = "assets";
const loaderName = "_$load";

function isUnique(current: string, index: number, arr: Array<string>) {
  return arr.indexOf(current) === index;
}

function getFiles(manifest: { chunks: Array<{ files: Array<string> }> }) {
  const files: Array<string> = [];

  manifest.chunks.forEach((chunk) => {
    files.push(...chunk.files);
  });

  return files.filter(isUnique);
}

function getChunkId(arg: Node): number {
  if (types.isNumericLiteral(arg)) {
    // e.g., t.e(307).then(...)
    return arg.value;
  } else if (types.isArrayExpression(arg)) {
    // e.g., Promise.all([t.e(983),t.e(307)]).then(...)
    const last = arg.elements[arg.elements.length - 1];

    if (types.isCallExpression(last)) {
      const lastArg = last.arguments[0];

      if (types.isNumericLiteral(lastArg)) {
        return lastArg.value;
      }
    }
  }

  return 0;
}

function extendEntryFile(
  root: string,
  chunkId: number,
  allFiles: Array<string>
) {
  const chunkName = `${chunkId}.js`;
  const filename = resolve(root, chunkName);
  const code = readFileSync(filename, "utf8");
  const result = transformSync(code, {
    ast: true,
    filename,
    sourceType: "script",
    plugins: [
      () => ({
        visitor: {
          Property(path) {
            if (path.node.key.name === exportedSetupFunctionName) {
              path.insertAfter(
                types.objectProperty(
                  types.identifier(assetsPropertyName),
                  types.arrowFunctionExpression(
                    [],
                    types.arrayExpression(
                      allFiles
                        .filter((file) => file !== chunkName)
                        .map((file) => types.stringLiteral(file))
                    )
                  )
                )
              );
            }
          },
        },
      }),
    ],
  });
  return result?.ast?.program.body ?? [];
}

export function transformFile(filename: string) {
  const root = dirname(filename);
  const manifest = require(`${filename}.buildmanifest.json`);
  const files = getFiles(manifest);
  const code = readFileSync(filename, "utf8");
  const result = transformSync(code, {
    filename,
    sourceType: "script",
    presets: ["minify"],
    plugins: [
      () => ({
        visitor: {
          Property(path) {
            if (path.node.key.name === "app") {
              const body = path.get("value.body");

              if (types.isExpression(body.node)) {
                const statements: Array<types.Statement> = [
                  types.expressionStatement(
                    types.assignmentExpression(
                      "=",
                      types.identifier(loaderName),
                      body.node
                    )
                  ),
                ];

                if (
                  types.isMemberExpression(body.node.callee) &&
                  types.isCallExpression(body.node.callee.object) &&
                  types.isMemberExpression(body.node.callee.object.callee)
                ) {
                  const arg = body.node.callee.object.arguments[0];
                  const chunkId = getChunkId(arg);

                  statements.unshift(...extendEntryFile(root, chunkId, files));
                }

                body.replaceWith(
                  types.blockStatement([
                    types.ifStatement(
                      types.unaryExpression("!", types.identifier(loaderName)),
                      types.blockStatement(statements)
                    ),
                    types.returnStatement(types.identifier(loaderName)),
                  ])
                );
              }
            }
          },
          CallExpression(path) {
            const node = path.node;

            if (
              types.isMemberExpression(node.callee) &&
              types.isIdentifier(node.callee.object, { name: "System" }) &&
              types.isIdentifier(node.callee.property, {
                name: "register",
              }) &&
              node.arguments.length === 3 &&
              types.isFunctionExpression(node.arguments[2])
            ) {
              path
                .get("arguments.2.body")
                .unshiftContainer(
                  "body",
                  types.variableDeclaration("var", [
                    types.variableDeclarator(
                      types.identifier(loaderName),
                      types.identifier("undefined")
                    ),
                  ])
                );
            }
          },
        },
      }),
    ],
  });

  return [result?.code?.split('"use strict";').join(""), code];
}

export function postProcessFile(fn: string) {
  const [result, original] = transformFile(fn);

  if (result && original) {
    writeFileSync(fn.replace(".js", ".old"), original, "utf8");
    writeFileSync(fn.replace(".js", ".js"), result, "utf8");
  }
}
