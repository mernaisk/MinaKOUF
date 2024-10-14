import { useUser } from "@/context/userContext";
import { getChallengeInOneChurch } from "@/firebase/firebaseModelChallenge";
import { useQuery } from "@tanstack/react-query";

export const Challenge = () => {
  const { userInfo } = useUser();

  return useQuery({
    queryFn: async () => {
      const result = await getChallengeInOneChurch(userInfo.OrginizationIdKOUF);
      return result ?? null; // Return `null` if `result` is `undefined`
    },    queryKey: ["Question",userInfo.OrginizationIdKOUF],
    throwOnError: true, 
    refetchOnWindowFocus: false,
  });
};
