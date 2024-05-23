

function KOUFView(props){




    function handleYouthClickACB(){
        window.location=window.location.hash="#/youth";
        return
    }

    function handleKOUFClickACB(){
        window.location=window.location.hash="#/allMembers";
        return
    }

 

    return(
        <div className="button-home">
                <button onClick={handleKOUFClickACB} id="KOUF" >allMmebers</button>
        </div>

    )
}



export default KOUFView;