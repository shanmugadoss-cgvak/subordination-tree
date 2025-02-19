"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const LogoutButton: React.FC = () => {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("userInfo"); // Remove user info from cookies
    router.push("/"); // Redirect to the login page
  };

  return (
    <button className="btn btn-error btn-outline btn-sm tooltip tooltip-left" data-tip="Logout" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default LogoutButton;