import './App.css';
import React from 'react';
import Home from "./presenters/home.jsx";
import Youth from "./presenters/youthPresenter";
import KOUF from "./presenters/KOUF.jsx";
import AllMembers from "./presenters/allMembers.jsx";
import FeedBack from "./presenters/feedbackPresenter.jsx";
import AddMember from "./presenters/addMember.jsx";
import Suggestion from "./presenters/suggestionPresenter.jsx";
import MemberInfo from "./presenters/memberInfo.jsx";
import TakeAttendence from "./presenters/takeAttendence.jsx"
import AttendenceDetails from './presenters/attendenceSheetDetails.jsx';
import { QueryClient, QueryClientProvider } from "react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Create a query client
const queryClient = new QueryClient();

// App component
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={makeRouter()} />
    </QueryClientProvider>
  );
}

// Router configuration
function makeRouter() {
  return createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
    {
      path: "/Home",
      element: <Home />,
    },
    {
      path: "/youth",
      element: <Youth />,
    },
    {
      path: "/KOUF",
      element: <KOUF />,
    },
    {
      path: "/feedback",
      element: <FeedBack />,
    },
    {
      path: "/suggestion",
      element: <Suggestion />,
    },
    {
      path: "/memberInfo",
      element: <MemberInfo />,
    },
    {
      path: "/addMember",
      element: <AddMember />,
    },
    {
      path: "/allMembers",
      element: <AllMembers />,
    },
    {
      path: "/takeAttendence",
      element: <TakeAttendence />,
    },
    {
      path: "/attendenceSheetDetails",
      element: <AttendenceDetails/>,
    }
  ]);
}
