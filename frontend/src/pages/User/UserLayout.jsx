// src/components/UserLayout.js
import React from "react";
import Footer from "../../components/User/Layout/Footer";
import Header from "../../components/User/Layout/Header";
import { Outlet } from "react-router-dom";

function UserLayout() {
  
  return (
    <>
      <Header />
      <main className="1300px:max-w-[75%] 1300px:mx-auto min-h-screen">
      <Outlet /> {/* This is where nested routes will be rendered */}
      </main>
      <Footer />
    </>
  );
}

export default UserLayout;