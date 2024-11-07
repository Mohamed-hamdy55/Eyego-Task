import React, { useState } from 'react'
import { useTranslate } from "../../../customHooks/translationHandler";
import axios from "axios";
import { server } from "../../../server";
import { toast } from "react-toastify";

function ForgetPasswordForm() {
    const [email, setEmail] = useState("");
    const trans = useTranslate();
  
    const handleSubmit = async (e) => {
      e.preventDefault();
  
      axios
        .post(`${server}/user/forget-password`,{email:email})
        .then((res) => {
          toast.success(res.data.message || "Go and check your mail!");
          setEmail("");
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
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
      <button
        type="submit"
        className="group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        {trans("Submit")}
      </button>
    </div>
  </form>
  )
}

export default ForgetPasswordForm