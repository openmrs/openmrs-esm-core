/**
 *
 * @param handler
 * @returns
 */
export function showModal(handler: (container: HTMLElement) => void) {
  const m = document.createElement("div");
  document.body.append(m);

  m.className = "omrs-modal";
  m.onclick = (e) => {
    if (e.target === m) {
      e.preventDefault();
      m.remove();
    }
  };

  setTimeout(() => {
    handler(m);
  }, 0);
  return () => {
    m.remove();
  };
}
