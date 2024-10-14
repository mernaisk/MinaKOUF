import { getAllDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";

export const AllEvents = () => {

  return useQuery({
    queryFn: () => getAllDocInCollection("Events"),
    queryKey: ["allEvents"],
    refetchOnWindowFocus: false,
  });
};
