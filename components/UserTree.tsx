"use client";

import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faKey } from "@fortawesome/free-solid-svg-icons";
import ChangePassphraseModal from "@/components/ChangePassphraseModal";
import CreateUserModal from "@/components/CreateUserModal";
import { generatePassphrase } from "@/lib/generatePassphrase";

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
    totalCount: number;
  };
}

const UserTree: React.FC<UserTreeProps> = ({ data }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newPassphrase, setNewPassphrase] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const handlePassphraseChange = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const confirmPassphraseChange = async (userId: string, parentUserId: string): Promise<string> => {
    const newPassphrase = generatePassphrase();
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/reset-passphrase`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId, parentUserId, newPassphrase }),
      });

      const responseData = await response.json();

      if (response.ok) {
        // Handle successful passphrase reset
        console.log("Passphrase reset successfully:", responseData);
        setNewPassphrase(newPassphrase);
        return newPassphrase;
      } else {
        // Handle error
        console.error("Failed to reset passphrase:", responseData);
        alert("Failed to reset passphrase.");
        return "";
      }
    } catch (error) {
      // Handle error
      console.error("An error occurred while resetting the passphrase:", error);
      alert("An error occurred while resetting the passphrase.");
      return "";
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNewPassphrase(null);
  };

  const handleCreateUser = async (newPassphrase: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          passphrase: newPassphrase,
          isTemporary: 1,
          parentUserId: data.parentUser.userId,
        }),
      });

      if (response.ok) {
        // Handle successful user creation
        console.log("User created successfully");
      } else {
        // Handle error
        console.error("Failed to create user");
        alert("Failed to create user.");
      }
    } catch (error) {
      // Handle error
      console.error("An error occurred while creating the user:", error);
      alert("An error occurred while creating the user.");
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  const renderTree = (user: User, isRoot: boolean = false, level: number = 0) => {
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
          {level === 1 && (
            <div className="tooltip" data-tip="Change Passphrase">
              <button
                className="ml-2 text-blue-500 hover:text-blue-700"
                onClick={() => handlePassphraseChange(user)}
                title="Change Passphrase"
              >
                <FontAwesomeIcon icon={faKey} />
              </button>
            </div>
          )}
        </div>
        {user.children.length > 0 && (
          <ul className="ml-6 border-l-2 border-gray-300 pl-4">
            {user.children.map(child => renderTree(child, false, level + 1))}
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
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Users</h1>
        <div className="flex space-x-4">
          <button className="btn btn-primary btn-outline btn-sm">
            Total Users
            <div className="badge badge-secondary">{data.totalCount}</div>
          </button>
          <button className="btn btn-success btn-outline btn-sm" onClick={() => setShowCreateModal(true)}>
            Create New User
          </button>
        </div>
      </div>
      <ul className="list-none">
        {renderTree(rootUser, true, 0)}
      </ul>

      <ChangePassphraseModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onConfirm={confirmPassphraseChange}
        userId={selectedUser?.userId || null}
        parentUserId={data.parentUser.userId}
        newPassphrase={newPassphrase}
      />

      <CreateUserModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onCreate={handleCreateUser}
      />
    </>
  );
};

export default UserTree;