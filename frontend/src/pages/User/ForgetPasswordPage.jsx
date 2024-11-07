import React, { useEffect } from "react";
import ForgetPasswordForm from "../../components/User/ForgetPassword/ForgetPasswordForm";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


function ForgetPasswordPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  });

  return (
    <section className="p-5">
      <div className="flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10">
          <ForgetPasswordForm />
        </div>
      </div>
    </section>
  );
}

export default ForgetPasswordPage;
