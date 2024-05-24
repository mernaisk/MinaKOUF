import { useQuery } from "react-query";
import { getAllDocInCollection, getOneDocInCollection} from "../firebaseModel.js";
import { filterMembers } from "../utilities.js";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';


export default function AllMembers() {
  const navigate = useNavigate();

    const [nameToSearch,setNameToSearch] = useState("");

    const { data: allMembers, isLoading} = useQuery({
      queryFn: () => getAllDocInCollection("STMinaKOUFData"),
      queryKey: "allMembers",
      gcTime: 0,
    });

    if (isLoading) {
        return <div>loading...</div>;
    }
    // getOneDocInCollection("STMinaKOUFData", "y1H0yGTn5CYnwnFar8mv");

    const filteredMembers = filterMembers(allMembers, nameToSearch);

    function renderMembers(member) {
      function youthInfoACB(){
        console.log(member)
        navigate('/memberInfo', { state: member.Id });
        // props.model.setMemberToEditID(member.Id)
        // window.location=window.location.hash="#/memberInfo"
      }
        return (
            <div key={member.Id} onClick={youthInfoACB}>
                <button> {member.FirstName} {member.LastName}</button>
            </div>
        );
    }

    function backClickACB() {
      navigate('/KOUF');
    }

    function search(event){
      setNameToSearch(event.target.value)  
    }
    function addMember(){
      navigate('/addMember');

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
