import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import changeLanguage from "../../../redux/actions/language";
import { useTranslate } from "../../../customHooks/translationHandler";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";

function Header() {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const language = useSelector((state) => state.language.lang);

  const trans = useTranslate();
  const dispatchFunc = useDispatch();

  const handleChnageLanguage = () => {
    dispatchFunc(changeLanguage(language === "eng" ? "ar" : "eng"));
  };

  const handleLogOut = async ()=>{
      await axios.get(`${server}/user/logout`,{ withCredentials: true })
      .then((res)=>{
        window.location.reload(true);
      })
      .catch((error)=>{
        toast.success(error.response.data.message || "Error in logout")
      }); 
  };

  return (
    <header className="shadow-sm fixed top-0 left-0 z-10 transition  flex items-center  justify-evenly  w-full h-[70px] bg-white text-black ">
        {/* Navitems : active will change latter*/}
        <Link to="/">
          <button className="text-sm font-[500]  hover:opacity-75">
            {trans("Home")}
          </button>
        </Link>

        <div className="flex">
          {/* profile*/}
          <div
            className="flex items-center relative cursor-pointer"
            title={`${isAuthenticated && user ? "user profile" : "Login"}`}
          >
            {isAuthenticated && user ? (
              <img
                src={user.avatar}
                className="w-[35px] h-[35px] rounded-full"
                alt="profile-image"
              />
            ) : (
              <div className="text-sm flex gap-3">
                <Link to="/login">
                  <button className="text-sm font-[500]  hover:opacity-75">
                    {trans("Login")}
                  </button>
                </Link>
                <Link to="/register">
                  <button className="text-sm font-[500] hover:opacity-75">
                    {trans("Register")}
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>

        {isAuthenticated && (
        <div>
          <button className="text-sm font-[500] hover:opacity-75" onClick={()=>{handleLogOut()}}>
            {trans("Logout")}
          </button>
        </div>)
        }

        <div className=" flex items-center">
          {/* Chanage language button */}
          <button
            className="text-white  p-2 border rounded-md bg-blue-600 hover:bg-blue-700 font-[500]"
            type="button"
            onClick={() => {
              handleChnageLanguage();
            }}
          >
            {language === "eng" ? "عربى" : "English"}
          </button>
        </div>
    </header>
  );
}

export default Header;
