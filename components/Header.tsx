"use client";

import React from "react";
import LogoutButton from "@/components/LogoutButton";

const Header: React.FC = () => {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <span className="text-xl">SUBORDINATION TREE</span>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <LogoutButton />
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;