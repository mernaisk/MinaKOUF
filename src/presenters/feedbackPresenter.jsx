import FeedbackView from "../views/feedbackView.jsx";
//utilites
import { observer } from "mobx-react-lite";


export default observer(function Feedback(props){
    function changeOptionACB(option){
        props.model.setOption(option)
    }

    function changeTextACB(text){
        props.model.setText(text)
    }

    function changeDateACB(){
        props.model.setDate()
    }

    function changeTypeACB(type){
        props.model.setType(type)
    }
    
    return <FeedbackView 
    youthMessage={props.youthMessage}
    setOption={changeOptionACB}
    setText={changeTextACB}
    setDate={changeDateACB}
    setType={changeTypeACB}
    />;
})
