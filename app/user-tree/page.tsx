"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserTree from "@/components/UserTree";

interface User {
  id: number;
  name: string;
  parentId: number | null;
}

const sampleUsers: User[] = [
  { id: 1, name: "Root User", parentId: null },
  { id: 2, name: "Child User 1", parentId: 1 },
  { id: 3, name: "Child User 2", parentId: 1 },
  { id: 4, name: "Sub Child User 1", parentId: 2 },
  { id: 5, name: "Sub Child User 2", parentId: 2 },
  { id: 6, name: "Sub Child User 3", parentId: 3 },
];

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  // Check if user is not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
    } else {
      setUsers(sampleUsers);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn"); // Remove login state
    router.push("/");
  };

  const handleCreate = () => {
    if (confirm("Are you sure you want to create a new passphrase for the new user?")) {
      router.push("/new-passphrase");
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header onLogout={handleLogout} />
      <main className="flex-grow p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">User Tree</h1>
            <button className="btn btn-primary" onClick={handleCreate}>
              Create
            </button>
          </div>
          <UserTree users={users} parentId={null} />
        </div>
      </main>
      <Footer />
    </div>
  );
}