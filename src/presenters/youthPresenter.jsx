


export default function Youth(){

    function handleFeedbackClickACB(){
        window.location=window.location.hash="#";
        return
    }

    function handleSuggestionsClickACB(){
        window.location=window.location.hash="#/suggestion";
        return
    }

    function handleTaranimClickACB(){
        window.location=window.location.hash="#";
        return
    }

    function handleKOUFMemClickACB(){
        window.location=window.location.hash="#";
        return
    }

    return(
        <div className="button-home">
                <button id="feedback" onClick={handleFeedbackClickACB}>Give feedback</button> <br/>
                <button  id="suggestions" onClick={handleSuggestionsClickACB}>Give topic/activities suggestions</button>
                <button id="taranim" onClick={handleTaranimClickACB}>Taranim</button> <br/>
                <button  id="KOUFMem" onClick={handleKOUFMemClickACB}>KOUF members</button>
        </div>
    )
}
