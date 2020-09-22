import { addDecorator, configure, addParameters } from "@storybook/html";
import { withA11y } from "@storybook/addon-a11y";
import { withTabs } from "./custom-decorators/tabs.decorator";
import { withToast } from "./custom-decorators/toast.decorator";
import hljs from "highlight.js/lib/highlight";
import xmlLanguage from "highlight.js/lib/languages/xml";
import cssLanguage from "highlight.js/lib/languages/css";
import jsLanguage from "highlight.js/lib/languages/javascript";
import bashLanguage from "highlight.js/lib/languages/bash";
import "highlight.js/styles/a11y-dark.css";
import "highlight.js/styles/tomorrow-night.css";
import { withKnobs } from "@storybook/addon-knobs";
import omrsTheme from "./theme";

hljs.registerLanguage("xml", xmlLanguage);
hljs.registerLanguage("css", cssLanguage);
hljs.registerLanguage("js", jsLanguage);
hljs.registerLanguage("bash", bashLanguage);

addDecorator(withA11y);
addDecorator(withKnobs);
addDecorator(withTabs);
addDecorator(withToast);

addParameters({
  options: {
    theme: omrsTheme,
  },
});

// automatically import all files ending in *.stories.js
require("../src/intro.stories");
const req = require.context("../src", true, /\.stories\.js$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
