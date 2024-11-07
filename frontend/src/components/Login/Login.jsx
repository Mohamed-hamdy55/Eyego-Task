// import Bowser from "bowser"; Detect the type of browser if needed
import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useTranslate } from "../../customHooks/translationHandler";
import { useSelector, useDispatch } from "react-redux";
import { loadUser } from "../../redux/actions/user";

/**
 * Login Functional Component that contains a form with email, password:
 *  - user enter his email and password then login, user has an option to check "Rmember me"
 *  - if user cardentials is correct the request done successfully and navigate to home page
 *  - if user forgot his password, he will press Forget Password
 *  - if the user has no account, he will press signUp
 * @returns HTML component
 */
function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.language.lang);
  const trans = useTranslate();

  // Detect the type of browser if needed
  //  const browser = Bowser.getParser(window.navigator.userAgent);
  //  const isEdge = browser.getBrowserName() === 'Microsoft Edge';

  const handleSubmit = async (e) => {
    e.preventDefault();

    // use with cardentials to allow cookies
    axios
      .post(
        `${server}/user/login`,
        { email, password },
        { withCredentials: true }
      )
      .then((res) => {
        toast.success(res.data.message||"Login Success!");
        dispatch(loadUser());
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };
  return (
    <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {trans("Login 😃")}
        </h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div>
            <label
              htmlFor="email"
              className="black text-sm font-medium text-gray-700"
            >
              {trans("Email")}
            </label>
            <div className="mt-1">
              <input
                type="email"
                name="email"
                id="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="password"
              className="black text-sm font-medium text-gray-700"
            >
              {trans("Password")}
            </label>
            <div className="mt-1 relative">
              <input
                type={visible ? "text" : "password"}
                name="password"
                id="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
              />
              {visible ? (
                <AiOutlineEye
                  className={`absolute ${
                    lang === "ar" ? "left-2" : "right-2"
                  } top-2 cursor-pointer `}
                  size={25}
                  onClick={() => setVisible(false)}
                />
              ) : (
                <AiOutlineEyeInvisible
                  className={`absolute ${
                    lang === "ar" ? "left-2" : "right-2"
                  } top-2 cursor-pointer `}
                  size={25}
                  onClick={() => setVisible(true)}
                />
              )}
            </div>
          </div>
          <div>
            <Link
              to="/forget-password"
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {trans("Forget Password?")}
            </Link>
          </div>
          <div>
            <button
              type="submit"
              className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              {trans("Submit")}
            </button>
          </div>
          <div className=" flex items-center w-full">
            <h4>{trans("Not have any accout")}&nbsp;</h4>
            <Link to="/register" className="text-blue-600 pl-2 hover:underline">
              {trans("Register")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
