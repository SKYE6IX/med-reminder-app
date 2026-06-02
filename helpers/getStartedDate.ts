import { formatRegularDate, getDateLocalString } from "@/utils/luxonUtil";

export const getStartedDate = (isoString: string) => {
  console.log(isoString);
  const date = new Date(isoString);
  const convertedString = getDateLocalString(date).replaceAll(".", " ");
  return formatRegularDate(convertedString);
};
