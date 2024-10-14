import { useUser } from "@/context/userContext";
import { getLeadersInOneChurch } from "@/firebase/firebaseModelMembers";
import { useQuery } from "@tanstack/react-query";

export const LeadersInOneChurch = () => {
  const { userInfo } = useUser();

  return useQuery({
    queryKey: ["LeadersInOneChurch",userInfo.OrginizationIdKOUF],
    queryFn: () => getLeadersInOneChurch(userInfo.OrginizationIdKOUF),
    refetchOnWindowFocus: false,
  });
};
