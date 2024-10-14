

import { getAllDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";

export const AllMembers = () => {

  return useQuery({
    queryFn: () => getAllDocInCollection("Members"),
    queryKey: ["allMembers"],
    refetchOnWindowFocus: false,
  });
};
