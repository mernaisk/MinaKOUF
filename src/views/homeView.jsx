

function HomeView(props){




    function handleYouthClickACB(){
        window.location=window.location.hash="#/youth";
        return
    }

    function handleKOUFClickACB(){
        window.location=window.location.hash="#/KOUF";
        return
    }

 

    return(
        <div className="button-home">
                <button id="youth" onClick={handleYouthClickACB}>Youth</button> <br/>
                <button onClick={handleKOUFClickACB} id="KOUF" >KOUF</button>
        </div>

    )
}



export default HomeView;