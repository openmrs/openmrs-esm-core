import { navigateToUrl } from "single-spa";

export default function HomeRedirect() {
  navigateToUrl(window.getOpenmrsSpaBase() + "home");
  return null;
}
