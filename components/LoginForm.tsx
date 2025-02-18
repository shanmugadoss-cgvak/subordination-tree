"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const ReCAPTCHA = dynamic(() => import("react-google-recaptcha"), { ssr: false });

export default function LoginForm() {
  const [passphrase, setPassphrase] = useState<string>("");
  const [captchaValue, setCaptchaValue] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const userInfo = Cookies.get("userInfo");
    if (userInfo) {
      router.push("/dashboard");
      return;
    }
  }, [router]);

  const validatePassphrase = (pass: string): string => {
    if (!pass) return "Passphrase is required!";
    return "";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const validationError = validatePassphrase(passphrase);
    if (validationError) {
      setError(validationError);
      setLoading(false);
      return;
    }

    if (!captchaValue) {
      setError("Please complete the CAPTCHA!");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passphrase }),
      });

      const result = await response.json();
      if (response.ok) {
        Cookies.set("userInfo", JSON.stringify({
          userId: result.data.userId,
          parentUserId: result.data.parentUserId,
          isTemporary: result.data.isTemporary,
        }), { expires: 7 }); // Store user info in cookies for 7 days

        if (result.data.isTemporary === 1) {
          router.push("/change-passphrase");
          return;
        }
        router.push("/dashboard");
        return;
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
            disabled={loading}
          />
        </label>
        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <div className="mb-4 flex justify-center">
          <ReCAPTCHA
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
            onChange={(value) => setCaptchaValue(value)}
          />
        </div>

        <button type="submit" className="btn btn-primary w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}