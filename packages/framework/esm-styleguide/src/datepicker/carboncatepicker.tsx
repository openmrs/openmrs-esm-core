import {
  ContentSwitcher,
  DatePicker,
  DatePickerInput,
  Switch,
  TextInput,
  Layer,
} from "@carbon/react";
import React from "react";
const CarbonDatePicker = ({
  dateFormat,
  onDateChange,
  today,
  format,
  birthdate,
  placeHolder,
  birthdateMeta,
  t,
}) => {
  return (
    <div>
      <DatePicker
        dateFormat={dateFormat}
        datePickerType="single"
        onChange={onDateChange}
        maxDate={format(today)}
      >
        <DatePickerInput
          id="birthdate"
          {...birthdate}
          placeholder={placeHolder}
          labelText={t("dateOfBirthLabelText", "Date of Birth")}
          invalid={!!(birthdateMeta.touched && birthdateMeta.error)}
          invalidText={birthdateMeta.error && t(birthdateMeta.error)}
          value={format(birthdate.value)}
        />
      </DatePicker>
    </div>
  );
};
export default CarbonDatePicker;
