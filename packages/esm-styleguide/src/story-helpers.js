import copyCodeBlock from "@pickra/copy-code-block";
import "./story-helpers.css";

const colors = {
  background: "#f7f7f7",
  textColor: "#222",
  border: "1px solid #222",
};

export function htmlStory(html) {
  if (typeof html !== "string") {
    throw Error("htmlStory must be called with an html string");
  }
  const parser = new DOMParser();
  let dom;
  try {
    dom = parser.parseFromString(html, "text/html");
  } catch (err) {
    console.error(err);
    throw Error("htmlStory was called with invalid HTML");
  }
  dom.querySelectorAll(".stories-example").forEach((exampleDiv) => {
    const numLeadingSpaces =
      exampleDiv.innerHTML.replace(/^\n/, "").search(/\S/) || 0;
    const innerHTML = exampleDiv.innerHTML
      .trim()
      .replace(
        new RegExp("\n" + new Array(numLeadingSpaces + 1).join(" "), "g"),
        "\n"
      );
    if (exampleDiv.classList.contains("lang-html")) {
      exampleDiv.innerHTML = copyCodeBlock(innerHTML, { lang: "xml", colors });
    } else if (exampleDiv.classList.contains("lang-css")) {
      exampleDiv.innerHTML = copyCodeBlock(innerHTML, { lang: "css", colors });
    } else if (exampleDiv.classList.contains("lang-js")) {
      exampleDiv.innerHTML = copyCodeBlock(innerHTML, { lang: "js", colors });
    } else if (exampleDiv.classList.contains("lang-bash")) {
      exampleDiv.innerHTML = copyCodeBlock(innerHTML, { lang: "bash", colors });
    } else {
      throw Error(
        "stories-example divs must have either lang-html, lang-css, lang-js, or lang-bash on them"
      );
    }
  });

  return dom.body.innerHTML;
}
