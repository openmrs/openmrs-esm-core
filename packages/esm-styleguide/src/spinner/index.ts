export function renderLoadingSpinner(target: HTMLElement) {
  const template = document.querySelector<HTMLTemplateElement>(
    "template#loading-spinner"
  );

  if (template) {
    const frag = template.content.cloneNode(true);
    const refs = Array.prototype.map.call(
      frag.childNodes,
      (m: HTMLElement) => m
    );
    target.appendChild(frag);
    return () => refs.forEach((child) => child.remove());
  }

  return () => {};
}
