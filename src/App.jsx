import './App.css';
import React from 'react';
import Home from "./presenters/homePresenter";
import Youth from "./presenters/youthPresenter";
import KOUF from "./presenters/KOUFPresenter";
import AllMembers from "./presenters/allMembers.jsx"
// import Attendence from "./attendencePresenter.jsx";
// import PersonInfo from "./personInfoPresenter.jsx";
import FeedBack from "./presenters/feedbackPresenter.jsx";
import AddMember from "./presenters/addMember.jsx";
import Suggestion from "./presenters/suggestionPresenter.jsx";
import MemberInfo from "./presenters/memberInfo.jsx"
import KOUFMembers from "./presenters/KOUFMembersPresenter.jsx";
import {QueryClient, QueryClientProvider} from "react-query"
import { createHashRouter , RouterProvider} from "react-router-dom";

//create q query client
const queryClient = new QueryClient();
//i need to wrap my whole application with a query client provider to have acsses to all the hooks that react query provide us
export default function App(props) {
  // console.log(props.model.membersConst[0].Street_name);
  return (
    <QueryClientProvider client = {queryClient}>
        <RouterProvider router={makeRouter(props.model)}/>
    </QueryClientProvider>
  );
};

function makeRouter(m){
  return createHashRouter([
    {
      path: "/",
      element: <Home model={m} />,
    },
    {
      path: "/Home",
      element: <Home model={m} />,
    },
    {
      path: "/youth",
      element: <Youth model={m} />,
    },
    {
      path: "/KOUF",
      element: <KOUF model={m} />,
    },
    {
      path: "/feedback",
      element: <FeedBack model={m}/>
    },
    {
      path: "/suggestion",
      element: <Suggestion model={m}/>
    },
    {
      path: "/memberInfo",
      element: <MemberInfo model={m}/>
    },
    {
      path: "/addMember",
      element: <AddMember model={m}/>
    },
    {
      path: "/allMembers",
      element: <AllMembers model={m}/>
    }

  ])
}

