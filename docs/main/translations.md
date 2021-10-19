# Using the Translation System

We use i18next and react-i18next to internationalize frontend module content.

Watch a quick tutorial video:

[![https://www.youtube.com/watch?v=1pLUi47BIBo](https://img.youtube.com/vi/1pLUi47BIBo/0.jpg)](https://www.youtube.com/watch?v=1pLUi47BIBo).

In order to internationalize your frontend module, it needs to have a line in
its `index.ts` file which tells the app shell where to find translations.
This will generally be exactly:

```javascript
const importTranslation = require.context("../translations", false, /.json$/, "lazy");
```

The `translations` directory should exist at that path relative to the `index.ts` file
(generally, at the top level of the package). It should contain a file `en.json`, which
is the translation *source file*, and may contain other JSON files corresponding
to languages into which the frontend module is translated.

You should then be able to use [react-i18next](https://react.i18next.com/) in your
React components.

> **Practice**: Try changing the language to Spanish (`es`), French (`fr`), or a language
  of your choice. Check to see if any English text is still visible. If it is, follow
  the example steps in the tutorial video to correct this.