"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

 
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) router.push("/components/Login");
  }, [router]);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("http://147.93.114.66:9090/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email, 
          password: password,
        }),
      });

      if (!res.ok) {
        throw new Error("Invalid email or password.");
      }

      const data = await res.json();

      // // ✅ Check validation
      // if (data.user.isValidated !== 1) {
      //   setError("Your account is not validated yet. Please contact admin.");
      //   setLoading(false);
      //   return;
      // }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      router.push("/components/Login");
    } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Login failed. Please try again.");
  }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <h1 className="text-2xl font-bold text-[#429C36]">IndigoRx</h1>
          </div>

          <h2 className="text-4xl font-semibold  text-black mb-2 font-akatab ">Welcome Back</h2>
          <p className="text-sm text-gray-600 mb-6 font-akatab ">Sign in to your account</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-600">{error}</div>}

            <label className="block">
              <span className="text-sm font-medium text-[#9F9F9F] font-akatab ">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-3  text-black placeholder-gray-500 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-no-repeat bg-size-[20px_20px] bg-position-[left_8px_center] pl-10"
                placeholder="Enter your Email"
                style={{ backgroundImage: "url('/images/logo/login.png')" }}
                required
              />
            </label>

            <label className="block relative">
              <span className="text-sm font-medium text-gray-700 font-akatab ">Password</span>
              <input
                type={showPwd ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-4 py-3 text-black placeholder-gray-500 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 bg-no-repeat bg-size-[20px_20px] bg-position-[left_8px_center] pl-10"
                placeholder="Enter your password"
                style={{ backgroundImage: "url('/images/logo/password.png')" }}
                required
              />
              <button
              type="button"
              onClick={() => setShowPwd((s) => !s)}
              className="absolute pt-7 right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-[#429C36] "
               >
              {showPwd ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
            </label>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-green-700 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 bg-[#278B51] text-white py-3 rounded-lg font-semibold hover:bg-green-800 transition ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <div className="text-center text-sm text-gray-600">
              Don’t have an account?{" "}
              <a
                href="/register"
                className="text-green-700 font-medium hover:underline"
              >
                Sign up
              </a>
            </div>
          </form>

        
        </div>
      </div>

      {/* Right: Green Info Panel */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-linear-to-r from-[#278B51] to-[#094918] p-12 text-white">
        <div className="max-w-lg text-left">
          <h3 className="text-3xl font-bold font-akatab  mb-4">
            Revolutionize Prescription with Smarter Automations
          </h3>
          <p className="mb-6 text-s font-akatab ">
            Manage your patients with ease and keep all their records in one
            place. Create and track prescriptions digitally to reduce errors and
            save time. Gain insights with analytics to make smarter, faster
            healthcare decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
