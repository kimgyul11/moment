import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";

import Loading from "./pages/Loading";
import { useContext, useEffect, useState } from "react";
import { auth } from "./utils/firebase";
import { ModalContextProvider } from "./context/ModalContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Search from "./pages/search";
import MomentDetail from "./pages/moment/momentDetail";
import MomentEdit from "./pages/moment/momentEdit";
import Profile from "./pages/profile/Profile";
import NotificationPage from "./pages/notification";
import ProfileEdit from "./pages/profile/ProfileEdit";
import ProtectedRoute from "./components/protectedRoute";
import { AuthContextProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { ReactQueryDevtools } from "react-query/devtools";

const GlobalStyles = createGlobalStyle`
  ${reset};
  *{
    box-sizing: border-box;
  }
  body{
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  a{
    text-decoration: none;
    color: #000;
  }
`;

const router = createBrowserRouter([
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

function App() {
  const queryClient = new QueryClient();
  const [isLoading, setIsLoading] = useState(true);

  //유저정보 초기화 함수
  const init = async () => {
    await auth.authStateReady();
    setIsLoading(false);
  };
  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <GlobalStyles />
      <ToastContainer autoClose={1000} newestOnTop hideProgressBar />
      {isLoading ? (
        <Loading />
      ) : (
        <QueryClientProvider client={queryClient}>
          <AuthContextProvider>
            <RouterProvider router={router} />
            <ReactQueryDevtools />
          </AuthContextProvider>
        </QueryClientProvider>
      )}
    </>
  );
}

export default App;
