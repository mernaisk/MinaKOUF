import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";

export const OneSheetInfo = (sheetId:string) => {
  return useQuery({
    queryFn: () => getOneDocInCollection("Attendence", sheetId),
    queryKey: ["sheetDetails", sheetId],
    enabled: !!sheetId,
    refetchOnWindowFocus: false,
  });
};
