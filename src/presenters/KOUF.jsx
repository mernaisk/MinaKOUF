import { Link,useNavigate } from "react-router-dom"

export default function KOUF(){
    const navigate =useNavigate()
    function navigateToAllMembers(){
        navigate("/allMembers")
    }

    function navigateToTakeAttendence(){
        navigate("/TakeAttendence")
    }
    function navigateToStartKOUFMeeting(){

    }

    function navigateToDownloadReport(){

    }
    function navigateToCreateEvents(){
        
    }

    return(
        <div >
            <Link to="/Home">back</Link> <br/>
            <button onClick={navigateToAllMembers}>All Members</button><br/>
            <button onClick={navigateToTakeAttendence}>Take attendence</button>
            <button onClick={navigateToStartKOUFMeeting}>Start KOUF meeting</button>
            <button onClink={navigateToDownloadReport}>Download Report</button>
            <button onClick={navigateToCreateEvents}>Create events</button>
        </div>

    )
}
