import { useUser } from "@/context/userContext";
import { getAllSheetsForOneChurch } from "@/firebase/firebaseModelAttendence";
import { useQuery } from "@tanstack/react-query";

export const AllAttendenceSheets = () => {
  const {userInfo} = useUser();
  return useQuery({
    queryFn: () => getAllSheetsForOneChurch(userInfo.OrginizationIdKOUF),
    queryKey: ["allAttendenceSheets",userInfo.OrginizationIdKOUF],
    refetchOnWindowFocus: false,
  });
};
