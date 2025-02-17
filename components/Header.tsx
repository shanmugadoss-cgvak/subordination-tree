import React from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Remove login state
    router.push("/"); // Redirect to the login page
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1">
        <span className="text-xl">SUBORDINATION TREE</span>
        <ul className="menu menu-horizontal px-1 ml-4">
          <li>
            <button className="btn btn-link" onClick={() => navigateTo("/dashboard")}>
              Dashboard
            </button>
          </li>
          <li>
            <button className="btn btn-link" onClick={() => navigateTo("/user-tree")}>
              User Tree
            </button>
          </li>
        </ul>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <button className="btn btn-error text-white" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Header;