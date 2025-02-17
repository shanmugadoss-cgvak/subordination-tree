"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NewPassphrase() {
  const router = useRouter();
  const [passphrase, setPassphrase] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!passphrase) {
      setError("Passphrase is required!");
      return;
    }

    // Handle passphrase creation logic here

    router.push("/user-tree");
  };

  const handleBack = () => {
    router.push("/user-tree");
  };

  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      <Header />
      <main className="flex-grow p-6">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-4">Enter New Passphrase</h1>
          <form onSubmit={handleSubmit}>
            <label className="input input-bordered flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Enter New Passphrase"
                className="grow"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
              />
            </label>
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
            <button type="submit" className="btn btn-primary w-full mb-2">
              Submit
            </button>
          </form>
          <button className="btn btn-secondary w-full" onClick={handleBack}>
            Back
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
}