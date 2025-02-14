"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ChangePassphrase() {
  const [newPassphrase, setNewPassphrase] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const validatePassphrase = (pass: string): string => {
    if (pass.length < 20) return "Passphrase must be at least 20 characters!";
    if (!/[A-Z]/.test(pass)) return "Passphrase must contain at least one uppercase letter!";
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Passphrase must contain at least one special character!";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validationError = validatePassphrase(newPassphrase);
    if (validationError) {
      setError(validationError);
      setLoading(false);
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
        setLoading(false);
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-white shadow-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">Change My Passphrase</h2>
        <form onSubmit={handleSubmit}>
          <label className="input input-bordered flex items-center gap-2 mb-2 mt-2">
            <input
              type="text"
              placeholder="Enter New Passphrase"
              className="grow"
              value={newPassphrase}
              onChange={(e) => setNewPassphrase(e.target.value)}
              disabled={loading}
            />
          </label>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <button 
            type="submit" 
            className="btn btn-primary w-full mt-6 flex justify-center items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner"></span>
                <span className="ml-2">Updating...</span>
              </>
            ) : (
              "Update Passphrase"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
