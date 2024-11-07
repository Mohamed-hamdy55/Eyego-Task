import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  UserLayout,
  LoginPage,
  ForgetPasswordPage,
  CreateNewPasswordPage,
  RegisterPage,
  ActivationPage,
  NotFoundPage,
  HomePage,
  CreateNewTaskPage,
  UpdateTaskInfoPage
} from "./routes/User.Routes";
import ScrollToTop from "./components/ReusableComponents/ScrollToTop";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import { useSelector } from "react-redux";
import store from "./redux/store";
import { loadUser } from "./redux/actions/user";

function App() {
  const language = useSelector((state) => state.language.lang);
  
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);

  return (
    <div dir={`${language === "eng" ? "ltr" : "rtl"}`}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/activation/:activation_token" element={<ActivationPage />}></Route>
          {/* LayOut route to handle adding header and footer for all pages */}
          <Route element={<UserLayout />}>
            {/* Start the routes for pages */}
            <Route path="/*" element={<NotFoundPage />}></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="/login" element={<LoginPage />}></Route>
            <Route path="/forget-password" element={<ForgetPasswordPage />}></Route>
            <Route path="/register" element={<RegisterPage />}></Route>
            <Route path="/create-new-password/:forget_password_token" element={<CreateNewPasswordPage />}></Route>
            <Route path="/create-new-task" element={<CreateNewTaskPage />}></Route>
            <Route path="/update-task-info/:task_id" element={<UpdateTaskInfoPage />}></Route>
          </Route>
        </Routes>
      </BrowserRouter>

      <ToastContainer
        position="top-right"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default App;
