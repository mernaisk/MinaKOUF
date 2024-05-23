import SuggestionsView from "../views/suggestionsView.jsx";
import _default from "../data.js";
import { observer } from "mobx-react-lite";


export default observer(function Suggestion(props){
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


    return <SuggestionsView 
    youthMessage={props.youthMessage}
    setOption={changeOptionACB}
    setText={changeTextACB}
    setDate={changeDateACB}
    setType={changeTypeACB}
    
    />;
})
