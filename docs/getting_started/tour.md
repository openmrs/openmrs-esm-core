# Tour of a Frontend Module

Let's explore the contents of
[openmrs-esm-template-app](https://github.com/openmrs/openmrs-esm-template-app).

## Tooling 🧰

OpenMRS uses [SWC](https://swc.rs/) as it's transpiler. This means that it is responsible for translating the code we write into Javascript the browser understands. E.g., we can use TypeScript, JSC, and ES2020, even though most browsers don't support those features.

There are a number of configuration files at the project level. These
can generally be treated as boilerplate. The important ones are

- `.github/workflows`: Configures [GitHub Actions](https://docs.github.com/en/actions).
  See the [Actions panel](https://github.com/openmrs/openmrs-esm-template-app/actions).
- `.husky`: Husky runs validations when committing.
- `.eslintrc`: ESLint is a linter for ECMAScript, a.k.a. JavaScript
- `jest.config.js`: Jest is the test runner. In this file you'll see:
  - Jest is configured to use SWC (via @swc/jest) to transform code so that Jest, like the
    browser, can understand it. The contents of `node_modules` are not transformed,
    except the `@openmrs` packages, so that tests can make use of the generic mock
    for `@openmrs/esm-framework`.
  - The `moduleNameMapper` entry transforms `import`
    statements in the code, whether to mock them or make them understandable to Jest.
    Default mocks are provided for everything in `@openmrs/esm-framework`. Note that many
    of these mocked functions have no implementation or return `undefined`, which may
    not work for your tests—you may have to override their implementations.
- `prettier.config.js`: Prettier is an auto-formatter. This ensures that you never have
  to worry about correct indentation, optional punctuation, or line breaks. Configuration
  is optional.
- `tsconfig.json`: This is the TypeScript configuration. In general, it should not
  vary much between projects.
- `webpack.config.js`: Webpack is what builds all the code (using SWC) into
  a "bundle" in the `dist/` directory which can be read by the browser. This single
  line is usually all you'll need in the config file. If you need to add something,
  you can simply override the properties of that default object.

## The package 📂

`package.json`, as you should be [aware](./prerequisites.md), defines dependencies and
metadata for the frontend module (which is a
[package](https://docs.npmjs.com/about-packages-and-modules)).

Looking inside, we find a bunch of metadata. Most of it can be understood with reference
to the [`package.json` docs](https://docs.npmjs.com/cli/v7/configuring-npm/package-json).
- The `name` of our frontend module ends in `-app` so that it will be recognized as a frontend module
  by the app shell and the build tooling.
- The `browser` entry is the entrypoint of the bundle.
- The `main` entry is the entrypoint of the source code.
- We use `dependencies`, `peerDependencies`, and `devDependencies`. For information
  about how we use them please see [Build-time and runtime dependencies](../main/deps.md).

## The application 💻

Now open
[`src/index.ts`](https://github.com/openmrs/openmrs-esm-template-app/blob/main/src/index.ts).
The rest of the tour is in the comments in that file and the components
it uses.
