import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

interface User {
  userId: string;
  parentId: string | null;
  children: User[];
  directChildrenCount: number;
  createdAt: string;
}

interface UserTreeProps {
  data: {
    parentUser: User;
    children: User[];
  };
}

const UserTree: React.FC<UserTreeProps> = ({ data }) => {
  const renderTree = (user: User, isRoot: boolean = false) => {
    const formattedDate = new Date(user.createdAt).toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "UTC",
    }) + " UTC";

    return (
      <li key={user.userId} className="ml-4 mt-2">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <span className="text-lg">
            <span className="font-semibold">{isRoot && "ME "}</span> {formattedDate} ({user.directChildrenCount})
          </span>
        </div>
        {user.children.length > 0 && (
          <ul className="ml-6 border-l-2 border-gray-300 pl-4">
            {user.children.map((child) => renderTree(child))}
          </ul>
        )}
      </li>
    );
  };

  const rootUser = {
    ...data.parentUser,
    children: data.children,
  };

  return (
    <ul className="list-none">
      {renderTree(rootUser, true)}
    </ul>
  );
};

export default UserTree;