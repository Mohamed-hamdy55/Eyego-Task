import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useSelector } from "react-redux";
import { useTranslate } from "../../../customHooks/translationHandler";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function CreateNewPasswordForm({ forget_password_token }) {
  const [visible, setVisible] = useState(false);
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [error, setError] = useState(false);
  const lang = useSelector((state) => state.language.lang);
  const trans = useTranslate();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(password !== repeatedPassword){
      toast.error("Two passwords must be the same");
      return;
    }
    if (!error) {
      axios
        .post(`${server}/user/create-new-password`, {
          password,
          forget_password_token,
        })
        .then((res) => {
          toast.success(res.data.message || "Password changed successfully!");
          setPassword("");
          setRepeatedPassword("");
          navigate("/login");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          setError(true);
        });
    } else {
      toast.error("Your link is expired");
      navigate("/login");
    }
  };

  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
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
        <label
          htmlFor="repeated-password"
          className="black text-sm font-medium text-gray-700"
        >
          {trans("Repeated Password")}
        </label>
        <div className="mt-1 relative">
          <input
            type="password"
            name="repeated-password"
            id="repeated-password"
            required
            value={repeatedPassword}
            onChange={(e) => {
              setRepeatedPassword(e.target.value);
            }}
            className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm "
          />
        </div>
      </div>
      <div>
        <button
          type="submit"
          className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          {trans("Submit")}
        </button>
      </div>
    </form>
  );
}

export default CreateNewPasswordForm;
