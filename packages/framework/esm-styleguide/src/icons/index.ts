/// <reference path="../declarations.d.ts" />

import visibility from "./svgs/visibility_24px_rounded.svg";
import menu from "./svgs/menu_24px_rounded.svg";
import search from "./svgs/search_24px_rounded.svg";
import arrow_back from "./svgs/arrow_back_24px_rounded.svg";
import arrow_forward from "./svgs/arrow_forward_24px.svg";
import arrow_downward from "./svgs/arrow_downward_24px_rounded.svg";
import arrow_upward from "./svgs/arrow_upward_24px_rounded.svg";
import chevron_left from "./svgs/chevron_left_24px_rounded.svg";
import chevron_right from "./svgs/chevron_right_24px_rounded.svg";
import chevron_up from "./svgs/chevron_up_24px_rounded.svg";
import chevron_down from "./svgs/chevron_down-24px_rounded.svg";
import user from "./svgs/supervised_user_circle_24px_rounded.svg";
import home from "./svgs/home_24px_rounded.svg";
import close from "./svgs/close-24px.svg";
import notification from "./svgs/important_notification_24px_rounded.svg";
import calendar from "./svgs/calendar_24px_rounded.svg";
import time from "./svgs/access_time-24px_rounded.svg";
import add from "./svgs/add_24px_rounded.svg";
import remove from "./svgs/remove-24px_rounded.svg";
import check from "./svgs/check_circle-24px.svg";
import zoom from "./svgs/zoom_out_map_24px_rounded.svg";
import location from "./svgs/location-24px.svg";
import download from "./svgs/download_24px_rounded.svg";
import { addSvg } from "../svg-utils";

export function setupIcons() {
  addSvg("omrs-icon-visibility", visibility);
  addSvg("omrs-icon-menu", menu);
  addSvg("omrs-icon-search", search);
  addSvg("omrs-icon-arrow-back", arrow_back);
  addSvg("omrs-icon-arrow-forward", arrow_forward);
  addSvg("omrs-icon-arrow-downward", arrow_downward);
  addSvg("omrs-icon-arrow-upward", arrow_upward);
  addSvg("omrs-icon-chevron-left", chevron_left);
  addSvg("omrs-icon-chevron-right", chevron_right);
  addSvg("omrs-icon-chevron-up", chevron_up);
  addSvg("omrs-icon-chevron-down", chevron_down);
  addSvg("omrs-icon-supervised-user-circle", user);
  addSvg("omrs-icon-home", home);
  addSvg("omrs-icon-close", close);
  addSvg("omrs-icon-important-notification", notification);
  addSvg("omrs-icon-calendar", calendar);
  addSvg("omrs-icon-access-time", time);
  addSvg("omrs-icon-add", add);
  addSvg("omrs-icon-remove", remove);
  addSvg("omrs-icon-check-circle", check);
  addSvg("omrs-icon-zoomoutmap", zoom);
  addSvg("omrs-icon-location", location);
  addSvg("omrs-icon-download", download);
}
