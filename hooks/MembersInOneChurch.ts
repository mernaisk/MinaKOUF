import { useUser } from "@/context/userContext";
import { getMembersInOneChurch } from "@/firebase/firebaseModelMembers";
import { useQuery } from "@tanstack/react-query";

export const MembersInOneChurch = () => {
  const { userInfo } = useUser();

  return useQuery({
    queryKey: ["MembersInOneChurch",userInfo.OrginizationIdKOUF],
    queryFn: () => getMembersInOneChurch(userInfo.OrginizationIdKOUF),
    refetchOnWindowFocus: false,
  });
};
