import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";
import Popup from "reactjs-popup";
import { useMutation, useQuery,useQueryClient} from "react-query";
import { addDocoment, getAllDocInCollection } from "../firebaseModel";
import { useNavigate  } from "react-router-dom";


export default function TakeAttendence(){
    const [startDate, setStartDate] = useState(new Date());
    const [isCreateDisabled, setIsCreateDisabled] = useState(true);
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const mutationAdd = useMutation (
        data => addDocoment("STMinaKOUFAttendence", data),{
            onSuccess:() => {
                queryClient.invalidateQueries("allAttendenceReports");
                //navigate
            }
        }
    )
    const { data: allAttendenceReports, isLoading} = useQuery({
        queryFn: () => getAllDocInCollection("STMinaKOUFAttendence"),
        queryKey: "allAttendenceReports",
        gcTime: 0,
      });
    if (isLoading) {
        return <div>loading...</div>;
    }

    function renderSubmitted(report){
        function handleButtonPressed(){
            console.log(report)
            navigate("/attendenceSheetDetails", {state: report.Id})
        }

        if(report.isSubmitted){
            return(
                <div><button onClick={handleButtonPressed}>{report.date}</button></div>
            )
        }
        return 
    }

    function renderUnsubmitted(report){
        if(!report.isSubmitted){
            return(
                <div><button>{report.date}</button></div>
                
                
            )
        }
        return

    }
    
    function changingDate(event){
        setStartDate(event.target.value);
        console.log(event.target.value)
        if(event.target.value == ""){
            setIsCreateDisabled(true)
        }
        else{
            setIsCreateDisabled(false)
        }
    }
    function StartAttendenceReport(){
        let myObj = {
            isSubmitted: false,
            date: startDate,
            IDS: []
        }
        mutationAdd.mutate(myObj)
    }
    function print(){
        console.log(allAttendenceReports)
    }


    return(<div>

        {/* <Popup trigger={<button> start a new attendence sheet</button>} position="right center">
    <div><DatePicker selected={startDate} onChange={() => changingDate(startDate)} /></div><br/>
    <button disabled={isCreateDisabled} onClick={StartAttendenceReport}>create</button>
  </Popup> */}
    <input onChange={changingDate}/>
    <button disabled={isCreateDisabled} onClick={StartAttendenceReport}>create</button>
    <div>ongoing attendence sheets:</div>
        {allAttendenceReports?.map(renderUnsubmitted)}

        <div>Previous attendence sheets:</div>
        {allAttendenceReports?.map(renderSubmitted)}

    </div>)
}