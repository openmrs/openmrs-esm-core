import { DatePicker } from "@react-spectrum/datepicker";
import { Provider } from "@react-spectrum/provider";
import { theme } from "@react-spectrum/theme-default";
import { parseDate } from "@internationalized/date";
import CarbonDatePicker from "./carboncatepicker";
import React from "react";
import { i18n } from "i18next";

declare global {
  interface Window {
    i18next: i18n;
  }
}

export default function CustomDatePicker({
  dateFormat,
  handelChange,
  today,
  format,
  birthdate,
  placeHolder,
  birthdateMeta,
  t,
}) {
  let locale = getLocale();
  const isIsoDate = (str) => {
    var regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/g;
    if (!regex.test(str)) {
      return false;
    }
    return true;
  };

  function getLocale() {
    let language = window.i18next.language;
    language = language.replace("_", "-"); // just in case
    // hack for `ht` until https://unicode-org.atlassian.net/browse/CLDR-14956 is fixed
    if (language === "ht") {
      language = "fr-HT";
    }
    return language;
  }
  function formatDate(value): string {
    if (!value) return "";
    let dmy = new Date(value).toLocaleDateString("en-US").split("/");
    if (dmy.length == 3) {
      let year = parseInt(dmy[2], 10);
      let month = parseInt(dmy[0], 10);
      let day = parseInt(dmy[1], 10);
      let finalDate = year + "-" + formatDigit(month) + "-" + formatDigit(day);
      return finalDate;
    } else {
      return "";
    }
  }

  function formatDigit(number) {
    return parseInt(number, 10).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
  }
  function onDateChange([date]) {
    var newDate = new Date(date);
    newDate.setHours(12);
    const refinedDate =
      date instanceof Date
        ? new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        : newDate;
    return refinedDate;
  }
  return locale == "am" ? (
    <Provider locale="am-AM-u-ca-ethiopic" colorScheme="light" theme={theme}>
      <DatePicker
        value={
          formatDate(birthdate.value) != null
            ? isIsoDate(formatDate(birthdate.value))
              ? parseDate(formatDate(birthdate.value))
              : null
            : null
        }
        onChange={(e) => {
          onDateChange([e]);
        }}
      ></DatePicker>
    </Provider>
  ) : (
    <CarbonDatePicker
      dateFormat={dateFormat}
      onDateChange={handelChange}
      today={today}
      format={format}
      birthdate={birthdate}
      placeHolder={placeHolder}
      birthdateMeta={birthdateMeta}
      t={t}
    ></CarbonDatePicker>
  );
}
