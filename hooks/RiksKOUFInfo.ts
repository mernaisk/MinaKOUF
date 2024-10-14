

import { getAllDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";

export const RiksKOUFInfo = () => {

  return useQuery({
    queryFn: () => getAllDocInCollection("RiksKOUFInfo"),
    queryKey: ["RiksKOUFInfo"],
    refetchOnWindowFocus: false,
  });
};
