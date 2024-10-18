import App from "/src/App.jsx";
import Home from "/src/pages/Home.jsx";
import Signin from "/src/pages/Signin.jsx";
import Signup from "/src/pages/Signup.jsx";
import SingleEventPage from "/src/pages/SingleEventPage.jsx";
import CreateEventPage from "/src/pages/CreateEventPage.jsx";
import AllEventsPage from "/src/pages/AllEventsPage.jsx";
import CrazyNotFoundPage from "/src/pages/CrazyNotFoundPage";
import BookingPage from "/src/pages/BookingPage.jsx"; // Add this line

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement:<CrazyNotFoundPage />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/login",
        element: <Signin />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/event/:id",
        element: <SingleEventPage />,
      },
      {
        path: "/addEvent",
        element: <CreateEventPage />,
      },
      {
        path: "/allEvent",
        element: <AllEventsPage />,
      },
      {
        path: "/booking/:id", 
        element: <BookingPage />,
      },
    ],
  },
];

export default routes;