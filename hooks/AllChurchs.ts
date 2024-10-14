

import { getAllDocInCollection } from "@/firebase/firebaseModel";
import { useQuery } from "@tanstack/react-query";

export const AllChurchs = () => {

  return useQuery({
    queryFn: () => getAllDocInCollection("Churchs"),
    queryKey: ["churchs"],
    refetchOnWindowFocus: false,
  });
};
