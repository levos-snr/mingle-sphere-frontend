import App from "/src/App.jsx";
import Home from "/src/pages/Home.jsx";
import Signin from "/src/pages/Signin.jsx";
import Signup from "/src/pages/Signup.jsx";
import SingleEventPage from "/src/pages/SingleEventPage.jsx";
import CreateEditEventPage from "/src/pages/CreateEditEventPage.jsx"; // Update this import
import AllEventsPage from "/src/pages/AllEventsPage.jsx";
import CrazyNotFoundPage from "/src/pages/CrazyNotFoundPage";
import BookingPage from "/src/pages/BookingPage.jsx";
import PreferencePage from "/src/pages/PreferencePage.jsx"; 
import SettingsDashboard from "/src/pages/SettingsDashboard.jsx"; 
import Community from "/src/pages/Community.jsx";
import Map from "/src/pages/Map.jsx";
import { Navigate } from "react-router-dom";

// Check if the user is an admin
const RequireAdmin = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.role === 'admin' ? children : <Navigate to="/" />;
};

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <CrazyNotFoundPage />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/login", element: <Signin /> },
      { path: "/signup", element: <Signup /> },
      { path: "/event/:id", element: <SingleEventPage /> },
      {
        path: "/addEvent",
        element: (
          <RequireAdmin>
            <CreateEditEventPage />
          </RequireAdmin>
        ),
      },
      {
        path: "/edit-event/:id",
        element: (
          <RequireAdmin>
            <CreateEditEventPage />
          </RequireAdmin>
        ),
      },
      { path: "/allEvent", element: <AllEventsPage /> },
      { path: "/booking/:id", element: <BookingPage /> },
      { path: "/preferences", element: <PreferencePage /> },
      { path: "/settings", element: <SettingsDashboard /> },
      { path: "/community", element: <Community /> },
      { path: "/map", element: <Map /> },
    ],
  },
];

export default routes;