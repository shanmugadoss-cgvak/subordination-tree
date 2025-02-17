"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import UserTree from "../../components/UserTree";
import { User } from "../../types/User";

export default function Dashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);

  // Check if user is not logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/");
    }
  }, [router]);

  // Load users data
  useEffect(() => {
    fetch("/data/users.json")
      .then(response => response.json())
      .then(data => setUsers(data));
  }, []);

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header />
      <div className="flex-grow p-6">
        <h1 className="text-2xl font-bold mb-4">Welcome to the Dashboard</h1>
        <p>This is the content area where you can add your HTML content.</p>
        <p>Feel free to customize this section as needed.</p>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">User Tree</h2>
          <UserTree users={users} parentId={null} />
        </div>
      </div>
      <Footer />
    </div>
  );
}
