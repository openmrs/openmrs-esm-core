/** @module @category UI */
import { useTranslation } from "react-i18next";
/**
 * React hook that translate patient gender, when given patient gender code
 * which can be `M` Or `F`
 * @param genderCode Patient gender code can be a string with values of `M` or `F`
 * @returns Translated string, with fully specified patient gender
 */
export function useGender(genderCode: string): string {
  const { t } = useTranslation();
  if (genderCode.toUpperCase() === "M") return t("male", "Male");
  if (genderCode.toUpperCase() === "F") return t("female", "Female");
  return t("unknown", "Unknown");
}
