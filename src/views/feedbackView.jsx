import {sendMessage} from "../utilities"

function FeedbackView(props){

    let isSelected=false;
    let isInputfilled = false;
    function handleSelectChangeACB(event){
        props.setOption(event.target.value);
        isSelected = true
    }

    function handleTextInputACB(event){
        if(event.target.value == ""){
            isInputfilled = false
        }
        else{
            props.setText(event.target.value)
            isInputfilled = true
        }
        

    }

    function handleSubmitButtonACB(){
        if (!isSelected){
            alert("No selected option")
        }
        else if(!isInputfilled){
            alert("no input")
        }
        else{
            props.setDate()
            props.setType("feedback")
            sendMessage(props.youthMessage)
            window.location=window.location.hash="#/youth"
        }
    }

    function handleBackButtonACB(){
        window.location=window.location.hash="#/youth"
    }

    function handleHomeButtonACB(){
        window.location=window.location.hash="#/home"
    }





    return(
        <div>

            <button onClick={handleBackButtonACB}>Back</button>
            <button onClick={handleHomeButtonACB}>Home</button>
            <select onChange={handleSelectChangeACB}>
                <option value="">Select an option</option>
                <option value="youth_meeting">Youth meeting</option>
                <option value="KOUF_meeting">KOUF meeting</option>
                <option value="activity">Activity</option>
                <option value="conference">Conference</option>
            </select>

            <textarea id="feedback" rows="4" cols="50" onChange={handleTextInputACB}></textarea>

            <button onClick={handleSubmitButtonACB}>Submit</button>


        </div>

    )
}



export default FeedbackView;