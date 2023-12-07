import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from "../protectedRoute";
import Layout from "../Layout";
import Home from "@pages/Home/index";
import Profile from "@pages/profile/Profile";
import ProfileEdit from "@pages/profile/ProfileEdit";
import Search from "@pages/search";
import MomentEdit from "@pages/moment/momentEdit";
import MomentDetail from "@pages/moment/momentDetail";
import NotificationPage from "@pages/notification";
import Signup from "@pages/user/Signup";
import Login from "@pages/user/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      { path: "/profile/edit", element: <ProfileEdit /> },
      {
        path: "/search",
        element: <Search />,
      },
      { path: "/search/:id", element: <Search /> },
      { path: "/moment/edit/:id", element: <MomentEdit /> },
      { path: "/moment/:id", element: <MomentDetail /> },
      { path: "/notification", element: <NotificationPage /> },
    ],
  },
  { path: "/sign-up", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);
