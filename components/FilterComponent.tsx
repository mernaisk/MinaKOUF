import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
// import { getCollection } from "@/firebase/firebaseModel"; // Assume this function fetches a collection of members

function getCollection(){
    
}
// Define types for the filters and member info
type Member = {
  Name: string;
  Email: string;
  PersonalNumber: string; // YYMMDDXXXX format
  PhoneNumber?: string;
  StreetName?: string;
  PostNumber?: string;
  City?: string;
  Service?: string[];
  Title?: string;
};

type Filter =
  | { column: "Name"; type: "alphabetical"; start: string; end: string }
  | { column: "PersonalNumber"; type: "birthday"; start: string; end: string }
  | { column: "Service"; type: "services"; servicesList: string[] };

interface Props {
  columnsToInclude: string[];  // List of columns to include in the result
  filters: Filter[];           // List of filter conditions
  onFilterComplete: (filteredData: Partial<Member>[]) => void;  // Callback to return the filtered data
}

const FilterMembers = ({ columnsToInclude, filters, onFilterComplete }: Props) => {
  const { data: members, isLoading } = useQuery({
    queryFn: () => getCollection("Members"), // Fetch the entire member collection
    queryKey: ["members"],
  });

  useEffect(() => {
    if (members && !isLoading) {
      const filteredData = filterArray(members, columnsToInclude, filters);
      onFilterComplete(filteredData);  // Call the callback with filtered data
    }
  }, [members, isLoading, columnsToInclude, filters]);

  const filterArray = (data: Member[], columns: string[], filters: Filter[]): Partial<Member>[] => {
    let filteredData = data.filter((row) => {
      return filters.every((filter) => {
        const columnData = row[filter.column as keyof Member];

        switch (filter.type) {
          case "alphabetical":
            if (filter.start && filter.end && typeof columnData === "string") {
              const start = filter.start.toLowerCase();
              const end = filter.end.toLowerCase();
              const value = columnData.toLowerCase();
              return value >= start && value <= end;
            }
            return true;

          case "birthday":
            if (filter.start && filter.end && typeof columnData === "string") {
              const birthdate = columnData.slice(0, 6); // Extract YYMMDD from PersonalNumber
              return birthdate >= filter.start && birthdate <= filter.end;
            }
            return true;

          case "services":
            if (filter.servicesList && Array.isArray(columnData)) {
              return filter.servicesList.every((service) =>
                columnData.includes(service)
              );
            }
            return true;

          default:
            return true;
        }
      });
    });

    // Create an array with only the desired columns
    return filteredData.map((row) => {
      const result: Partial<Member> = {};
      columns.forEach((column) => {
        if (column in row) {
          result[column as keyof Member] = row[column as keyof Member];
        }
      });
      return result;
    });
  };

  return null;  // This component does not render anything
};

export default FilterMembers;
