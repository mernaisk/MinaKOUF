import { useQuery } from "react-query";
import { getAllDocInCollection, getOneDocInCollection} from "../firebaseModel.js";
import { filterMembers } from "../utilities.js";
import { useState } from "react";

export default function AllMembers(props) {
    const [nameToSearch,setNameToSearch] = useState("");

    const { data: allMembers, isLoading } = useQuery({
      queryFn: () => getAllDocInCollection("STMinaKOUFData"),
      queryKey: "allMembers",
    });

    if (isLoading) {
        return <div>loading...</div>;
    }
    // getOneDocInCollection("STMinaKOUFData", "y1H0yGTn5CYnwnFar8mv");

    const filteredMembers = filterMembers(allMembers, nameToSearch);

    function renderMembers(member) {
      function youthInfoACB(){
        console.log(member)
        props.model.setMemberToEditID(member.Id)
        window.location=window.location.hash="#/memberInfo"
      }
        return (
            <div key={member.Id} onClick={youthInfoACB}>
                <button> {member.FirstName} {member.LastName}</button>
            </div>
        );
    }

    function backClickACB() {
      window.location=window.location.hash="#/KOUF"
    }

    function search(event){
      setNameToSearch(event.target.value)  
    }
    function addMember(){
      window.location=window.location.hash="#/addMember"

    }


    return (
      
    <div>
      <button onClick={addMember}>Add member</button>
      <button onClick={backClickACB}>Back</button>
      <input onChange={search} />
      {filteredMembers?.map(renderMembers)} 
    </div>
    );



}
