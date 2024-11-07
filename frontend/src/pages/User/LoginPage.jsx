import React, { useEffect } from "react";
import Login from "../../components/Login/Login";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    if (isAuthenticated === true) {
      navigate("/");
    }
  });

  return (
    <section className="p-5">
      <Login />
    </section>
  );
}

export default LoginPage;
