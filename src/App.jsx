import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Signup from "./pages/user/Signup";
import Loading from "@shared/Loading";
import { useEffect, useState } from "react";
import { auth } from "./utils/firebase";

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
import Login from "./pages/user/Login";
import { router } from "./components/router";

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
