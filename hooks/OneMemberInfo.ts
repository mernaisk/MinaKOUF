import { getOneDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";

export const OneMemberInfo = (memberId:string) => {
  return useQuery({
    queryFn: () => getOneDocInCollection("Members", memberId),
    queryKey: ["memberInfo", memberId],
    refetchOnWindowFocus: false,
  });
};
