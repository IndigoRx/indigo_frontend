"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, CheckCircle2 } from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) router.push("/dashboard");
  }, [router]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.LOGIN, {
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

      // Store token, user id, and username in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id.toString());
      localStorage.setItem("username", data.user.username);
      
      // Redirect to dashboard
      router.push("/dashboard");
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
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-white relative z-10">
        <div className={`max-w-md w-full transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* Logo with animation */}
          <div className="flex items-center gap-3 mb-8 animate-fade-in">
            <div className="relative">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="40" height="40" rx="8" fill="#429C36"/>
                <path d="M12 20L18 26L28 14" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
            </div>
            <h1 className="text-2xl font-bold text-[#429C36]">IndigoRx</h1>
          </div>

          <div className="mb-8 animate-fade-in-delay-1">
            <h2 className="text-4xl font-semibold text-black mb-2 font-akatab">
              Welcome Back
            </h2>
            <p className="text-sm text-gray-600 font-akatab flex items-center gap-2">
              <span className="inline-block w-8 h-0.5 bg-green-500 animate-expand"></span>
              Sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in-delay-2">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-200 animate-shake flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="8" fill="#DC2626"/>
                  <path d="M8 4V8M8 11H8.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {error}
              </div>
            )}

            <label className="block group">
              <span className="text-sm font-medium text-gray-700 font-akatab">Email</span>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 text-black placeholder-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </label>

            <label className="block group">
              <span className="text-sm font-medium text-gray-700 font-akatab">Password</span>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 text-black placeholder-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                >
                  {showPwd ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </label>

            <div className="flex items-center justify-end">
              <a href="#" className="text-sm text-green-700 hover:text-green-800 hover:underline transition-colors">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full mt-2 bg-gradient-to-r from-[#278B51] to-[#32A05F] text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                loading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </span>
              ) : (
                "Sign in"
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-green-700 font-medium hover:text-green-800 hover:underline transition-colors"
              >
                Sign up
              </a>
            </div>
          </form>

          {/* Trust indicators */}
          <div className="mt-8 pt-6 border-t border-gray-100 animate-fade-in-delay-3">
            <div className="flex items-center justify-center gap-6 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 1L10.5 6L16 6.75L12 10.5L13 16L8 13.25L3 16L4 10.5L0 6.75L5.5 6L8 1Z" fill="#429C36"/>
                </svg>
                <span>Secure</span>
              </div>
              <div className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="7" stroke="#429C36" strokeWidth="2" fill="none"/>
                  <path d="M5 8L7 10L11 6" stroke="#429C36" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>Encrypted</span>
              </div>
              <div className="flex items-center gap-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="4" width="12" height="10" rx="1" stroke="#429C36" strokeWidth="2" fill="none"/>
                  <path d="M5 4V3C5 1.89543 5.89543 1 7 1H9C10.1046 1 11 1.89543 11 3V4" stroke="#429C36" strokeWidth="2"/>
                </svg>
                <span>Private</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Green Info Panel */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center bg-gradient-to-br from-[#278B51] via-[#1f7a44] to-[#094918] p-12 text-white relative overflow-hidden">
        {/* Decorative SVG elements */}
        <div className="absolute top-10 right-10 opacity-10">
          <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="80" stroke="white" strokeWidth="2"/>
            <circle cx="100" cy="100" r="60" stroke="white" strokeWidth="2"/>
            <circle cx="100" cy="100" r="40" stroke="white" strokeWidth="2"/>
          </svg>
        </div>

        <div className="absolute bottom-10 left-10 opacity-10">
          <svg width="150" height="150" viewBox="0 0 150 150" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M75 15L90 60L135 75L90 90L75 135L60 90L15 75L60 60L75 15Z" fill="white"/>
          </svg>
        </div>

        <div className="max-w-lg text-left relative z-10 animate-fade-in-delay-2">
          <div className="mb-6">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4">
              <rect width="60" height="60" rx="12" fill="white" fillOpacity="0.1"/>
              <path d="M30 15V30M30 30V45M30 30H45M30 30H15" stroke="white" strokeWidth="3" strokeLinecap="round"/>
              <circle cx="30" cy="30" r="5" fill="white"/>
            </svg>
          </div>

          <h3 className="text-4xl font-bold font-akatab mb-4 leading-tight">
            Revolutionize Prescription with Smarter Automations
          </h3>
          <p className="mb-8 text-base font-akatab leading-relaxed text-green-50">
            Manage your patients with ease and keep all their records in one
            place. Create and track prescriptions digitally to reduce errors and
            save time. Gain insights with analytics to make smarter, faster
            healthcare decisions.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              "Patient Management System",
              "Digital Prescription Tracking",
              "Advanced Analytics Dashboard"
            ].map((feature, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 animate-slide-in-right"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CheckCircle2 size={20} className="text-green-300 flex-shrink-0" />
                <span className="text-sm text-green-50">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        .animate-fade-in-delay-1 {
          animation: fade-in 0.6s ease-out 0.2s both;
        }
        .animate-fade-in-delay-2 {
          animation: fade-in 0.6s ease-out 0.4s both;
        }
        .animate-fade-in-delay-3 {
          animation: fade-in 0.6s ease-out 0.6s both;
        }
        @keyframes expand {
          from { width: 0; }
          to { width: 2rem; }
        }
        .animate-expand {
          animation: expand 0.8s ease-out 0.4s both;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out both;
        }
      `}</style>
    </div>
  );
}