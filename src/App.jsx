import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { createGlobalStyle } from "styled-components";
import reset from "styled-reset";
import Profile from "./pages/Profile";
import Loading from "./pages/Loading";
import { useEffect, useState } from "react";
import { auth } from "./utils/firebase";
import { ModalContextProvider } from "./context/ModalContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    element: <Layout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
    ],
  },
  { path: "/sign-up", element: <Signup /> },
  { path: "/login", element: <Login /> },
]);

function App() {
  const [isLoading, setIsLoading] = useState(true);

  //유저정보 초기화
  const init = async () => {
    await auth.authStateReady();
    //파이어베이스에서 계정정보를 받아올때까지 기다린다.
    setIsLoading(false);
  };

  //처음 마운트될때 실행
  useEffect(() => {
    init();
  }, []);

  return (
    <ModalContextProvider>
      <GlobalStyles />
      <ToastContainer />
      {isLoading ? <Loading /> : <RouterProvider router={router} />}
    </ModalContextProvider>
  );
}

export default App;
