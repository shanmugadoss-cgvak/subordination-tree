"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePassphrase() {
  const [newPassphrase, setNewPassphrase] = useState<string>("");
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (newPassphrase.length < 20) {
      setError("Passphrase must be at least 20 characters!");
      return;
    }

    try {
      const response = await fetch("/api/change-passphrase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassphrase }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/dashboard");
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-white shadow-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">Change Passphrase</h2>
        <form onSubmit={handleSubmit}>
          <label className="input input-bordered flex items-center gap-2 mb-2">
            <input
              type="password"
              placeholder="New Passphrase"
              className="grow"
              value={newPassphrase}
              onChange={(e) => setNewPassphrase(e.target.value)}
            />
          </label>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button type="submit" className="btn btn-primary w-full">
            Update Passphrase
          </button>
        </form>
      </div>
    </div>
  );
}
