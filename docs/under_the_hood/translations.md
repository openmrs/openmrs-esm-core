# How Translation Works

There are three places in frontend code that relate to translation/i18n. They are:

- The app shell, in [locale.ts](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/shell/esm-app-shell/src/locale.ts).
  This sets up i18next and react-i18next.
- The [OpenMRS Component Decorator](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#openmrscomponentdecorator).
  This decorator is generally wrapped around root components by
  [getLifecycle](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#getasynclifecycle)/[getAsyncLifecycle](https://github.com/openmrs/openmrs-esm-core/blob/main/packages/framework/esm-framework/docs/API.md#getasynclifecycle)—
  it is generally not used directly by frontend modules.
  This component provides the connection between the i18next "backend"
  (still on the client side, despite the name) and the frontend module it wraps.
- The frontend module, which uses the `t` function or `<Trans>` component from react-i18next
  to produce rendered content. Upon each commit, [i18next-parser](https://github.com/i18next/i18next-parser) parses the frontend module code and automatically extracts translation keys and strings into locale-specific translation files found in the `translations` directory of a frontend module.

## Language Detection

The identify the currently used language the following steps are performed:

1. Looking at the site's current query string (`lang`)
2. Looking at the user's language preference placed on the `html` tag, which is synced with the backend
3. Looking at the site's language preference stored in `localStorage` (key `i18nextLng`)
4. Looking at the browser's language preference via `navigator` (trying properties such as `languages`, `userLanguage`, `language`)
5. Falling back to English ("en")

In any case changing the language on the fly is as simple as changing the `lang` attribute on the site's `documentElement`.
