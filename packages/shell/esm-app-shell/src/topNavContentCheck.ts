export function initializeTopNavContentCheck(): void {
  setTimeout(() => {
    const topNavContainer = document.getElementById('omrs-top-nav-app-container');
    const contentDiv = topNavContainer ? topNavContainer.querySelector(':scope > div') : null;
    if (!contentDiv) {
      return;
    }
    const updateContentClass = () => {
      const hasContent = contentDiv.children.length > 0 || contentDiv.textContent?.trim().length > 0;
      topNavContainer!.classList.toggle('has-content', hasContent);
    };
    updateContentClass();
    const observer = new MutationObserver(updateContentClass);
    const config = { childList: true, subtree: true, characterData: true };
    observer.observe(contentDiv, config);
  }, 0);
}
