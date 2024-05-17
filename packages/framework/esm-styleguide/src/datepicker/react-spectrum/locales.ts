import { type CalendarDate, EthiopicCalendar, toCalendar, IndianCalendar } from '@internationalized/date';

const convertToEthiopicDate = (date: CalendarDate) => {
  return toCalendar(date, new EthiopicCalendar());
};

const convertToIndianDate = (date: CalendarDate) => {
  return toCalendar(date, new IndianCalendar());
};

export const supportedLocales = {
  am: { locale: 'am-AM-u-ca-ethiopic', convert: convertToEthiopicDate },
  am_ET: { locale: 'Amharic (Ethiopia)', convert: convertToEthiopicDate },
  ti_ET: { locale: 'Tigrinya (Ethiopia)', convert: convertToEthiopicDate },
  in: { locale: 'hi-IN-u-ca-indian', convert: convertToIndianDate },
};
