import { useQuery } from "react-query"
import { getOneDocInCollection } from "../firebaseModel"
import { useLocation } from "react-router-dom"


export default function AttendenceDetails(){
    const location = useLocation()
    const sheetID = location.state;

    const {data: allAttendedMembers, isLoading} = useQuery({
        queryFn: () => getOneDocInCollection("STMinaKOUFAttendence", sheetID),
        queryKey:"allAttendedMembers",
    })
    if(isLoading){
        return (<div>Loading.....</div>)
    }
    console.log(allAttendedMembers)
    return (
        <div></div>
    )
}