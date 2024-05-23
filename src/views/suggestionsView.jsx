import {sendMessage} from "../utilities"

function SuggestionsView(props){

    var isSelected=false;
    var isInputfilled = false;
    function handleSelectChangeACB(event){
        props.setOption(event.target.value);
        isSelected = true
    }

    function handleSuggestionTextACB(event){
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
            props.setType("suggestion")
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


    function addAttendence(){
        props.addAttendence()
    }


    return(
        <div>
            <button onClick={handleBackButtonACB}>Back</button>
            <button onClick={handleHomeButtonACB}>Home</button>
            <select onChange={handleSelectChangeACB}>
                <option value="">Select an option</option>
                <option value="topic">Topic</option>
                <option value="activity">Activity</option>
                <option value="other">other</option>
            </select>
            <textarea id="feedback" rows="4" cols="50" onChange={handleSuggestionTextACB}></textarea>
            <button onClick={handleSubmitButtonACB}>Submit</button>
            <button onClick={addAttendence}>click</button>

        </div>

    )
}



export default SuggestionsView;