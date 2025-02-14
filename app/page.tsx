"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

export default function Home() {
  const [passphrase, setPassphrase] = useState<string>("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const router = useRouter();

  const validatePassphrase = (pass: string): string => {
    if (!pass) return "Passphrase is required!";
    // if (pass.length < 20) return "Passphrase must be at least 20 characters!";
    // if (!/[A-Z]/.test(pass)) return "Passphrase must contain at least one uppercase letter!";
    // if (!/[!@#$%^&*(),.?":{}|<>]/.test(pass)) return "Passphrase must contain at least one special character!";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const validationError = validatePassphrase(passphrase);
    if (validationError) {
      setError(validationError);
      return;
    }
  
    if (!captchaValue) {
      setError("Please complete the CAPTCHA!");
      return;
    }
  
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        router.push(result.redirect); // Redirect to change passphrase or dashboard
      } else {
        setError(result.error); // Show error message
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-200">
      <div className="card w-96 bg-white shadow-xl p-6">
        <h2 className="text-xl font-bold text-center mb-4">Login with Passphrase</h2>
        <form onSubmit={handleSubmit}>
          <label className="input input-bordered flex items-center gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter Passphrase"
              className="grow"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
            />
          </label>
          {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

          <div className="mb-4 flex justify-center">
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
              onChange={(value) => setCaptchaValue(value)}
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
