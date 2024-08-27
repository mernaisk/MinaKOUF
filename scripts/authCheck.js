// import {useUser} from "../context/userContext"
// const {userInfo} = useUser()
function checkAuthForEditingMember(){
    // if (userInfo?.Title?.Category == "ungdom"){
    //     return false
    // }
    return true
}

export {
    checkAuthForEditingMember
}