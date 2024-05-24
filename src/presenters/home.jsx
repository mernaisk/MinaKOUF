import { Link } from "react-router-dom";


export default function Home(){ 

    return(
        <div className="button-home">
                <Link to="/Youth" id="youth" >Youth</Link> <br/>
                <Link to="/KOUF"  id="KOUF" >KOUF</Link>
        </div>

    )
}
