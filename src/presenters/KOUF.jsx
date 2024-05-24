import { Link,useNavigate } from "react-router-dom"

export default function KOUF(){
    const navigate =useNavigate()
    function navigateToAllMembers(){
        navigate("/allMembers")
    }

    function navigateToTakeAttendence(){
        navigate("/TakeAttendence")
    }
    return(
        <div >
            <Link to="/Home">back</Link> <br/>
            <button onClick={navigateToAllMembers}>All Members</button><br/>
            <button onClick={navigateToTakeAttendence}>Take attendence</button>
        </div>

    )
}
