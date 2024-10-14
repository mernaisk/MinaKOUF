import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";

export const OneEventInfo = (eventId:string) => {
  return useQuery({
    queryFn: () => getOneDocInCollection("Events", eventId),
    queryKey: ["EventInfo", eventId],
    refetchOnWindowFocus: false,
  });
};
