import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";

export const getDurationDate = (isoString: string) => {
  const date = new Date(isoString);
  const convertedString = getDateLocalString(date).replaceAll(".", " ");
  return formatRegularDate(convertedString);
};
