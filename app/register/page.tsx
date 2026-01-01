"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, CheckCircle2, X, RefreshCw } from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  // OTP Modal State
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpSuccess, setOtpSuccess] = useState("");
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setMounted(true);
    const token = localStorage.getItem("token");
    if (token) router.push("/login");
  }, [router]);

  useEffect(() => {
    // Calculate password strength
    if (password.length === 0) {
      setPasswordStrength(0);
      return;
    }
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password)) strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Focus first OTP input when modal opens
  useEffect(() => {
    if (showOtpModal && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus();
    }
  }, [showOtpModal]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.DOCTOR_REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      if (data.requiresVerification) {
        // Show OTP modal
        setShowOtpModal(true);
        setResendCooldown(60); // 60 seconds cooldown
        setOtp(["", "", "", "", "", ""]);
        setOtpError("");
        setOtpSuccess(data.message || "Verification code sent to your email");
      } else {
        // Direct registration success (shouldn't happen with new flow)
        setSuccess("Account created successfully! Redirecting to login...");
        setTimeout(() => router.push("/login"), 2000);
      }
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    // Only allow numbers
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError("");

    // Auto-focus next input
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData.length === 6) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      otpInputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpCode = otp.join("");
    
    if (otpCode.length !== 6) {
      setOtpError("Please enter the complete 6-digit code.");
      return;
    }

    setVerifyingOtp(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const res = await fetch(API_ENDPOINTS.DOCTOR_VERIFY_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          otp: otpCode,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Verification failed. Please try again.");
      }

    

      setOtpSuccess("Email verified successfully! Redirecting...");
      
      setTimeout(() => {
        setShowOtpModal(false);
        router.push("/login");
      }, 1500);

    } catch (err) {
      if (err instanceof Error) {
        setOtpError(err.message);
      } else {
        setOtpError("Verification failed. Please try again.");
      }
      // Clear OTP on error
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();
    } finally {
      setVerifyingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;

    setResendingOtp(true);
    setOtpError("");
    setOtpSuccess("");

    try {
      const res = await fetch(API_ENDPOINTS.DOCTOR_RESEND_OTP, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to resend code. Please try again.");
      }

      setOtpSuccess(data.message || "New verification code sent!");
      setResendCooldown(60);
      setOtp(["", "", "", "", "", ""]);
      otpInputRefs.current[0]?.focus();

    } catch (err) {
      if (err instanceof Error) {
        setOtpError(err.message);
      } else {
        setOtpError("Failed to resend code. Please try again.");
      }
    } finally {
      setResendingOtp(false);
    }
  };

  const closeOtpModal = () => {
    setShowOtpModal(false);
    setOtp(["", "", "", "", "", ""]);
    setOtpError("");
    setOtpSuccess("");
  };

  const getStrengthColor = () => {
    if (passwordStrength <= 25) return "bg-red-500";
    if (passwordStrength <= 50) return "bg-orange-500";
    if (passwordStrength <= 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    if (passwordStrength === 0) return "";
    if (passwordStrength <= 25) return "Weak";
    if (passwordStrength <= 50) return "Fair";
    if (passwordStrength <= 75) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-10 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Left: Register Form */}
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
              Create Account
            </h2>
            <p className="text-sm text-gray-600 font-akatab flex items-center gap-2">
              <span className="inline-block w-8 h-0.5 bg-green-500 animate-expand"></span>
              Join us and start managing prescriptions
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

            {success && (
              <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg border border-green-200 animate-fade-in flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="8" cy="8" r="8" fill="#16A34A"/>
                  <path d="M5 8L7 10L11 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {success}
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
                  placeholder="Create a password"
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
              {password && (
                <div className="mt-2">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                        style={{ width: `${passwordStrength}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-600 font-medium">{getStrengthText()}</span>
                  </div>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p className={password.length >= 8 ? "text-green-600" : ""}>
                      {password.length >= 8 ? "✓" : "○"} At least 8 characters
                    </p>
                    <p className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? "text-green-600" : ""}>
                      {/[A-Z]/.test(password) && /[a-z]/.test(password) ? "✓" : "○"} Upper & lowercase letters
                    </p>
                    <p className={/[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : ""}>
                      {/[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password) ? "✓" : "○"} Number & special character
                    </p>
                  </div>
                </div>
              )}
            </label>

            <label className="block group">
              <span className="text-sm font-medium text-gray-700 font-akatab">Confirm Password</span>
              <div className="relative mt-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                </div>
                <input
                  type={showConfirmPwd ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 text-black placeholder-gray-400 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  placeholder="Confirm your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPwd((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors"
                >
                  {showConfirmPwd ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              {confirmPassword && (
                <div className="mt-2 flex items-center gap-1.5">
                  {password === confirmPassword ? (
                    <>
                      <CheckCircle2 size={14} className="text-green-500" />
                      <span className="text-xs text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="7" cy="7" r="7" fill="#EF4444"/>
                        <path d="M4.5 4.5L9.5 9.5M9.5 4.5L4.5 9.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="text-xs text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </label>

            <div className="flex items-start gap-2 pt-2">
              <input
                type="checkbox"
                id="terms"
                required
                className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500 focus:ring-2"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="#" className="text-green-700 hover:text-green-800 hover:underline transition-colors">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-green-700 hover:text-green-800 hover:underline transition-colors">
                  Privacy Policy
                </a>
              </label>
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
                  Sending verification code...
                </span>
              ) : (
                "Create Account"
              )}
            </button>

            <div className="text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-green-700 font-medium hover:text-green-800 hover:underline transition-colors"
              >
                Sign in
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
              <circle cx="30" cy="25" r="8" stroke="white" strokeWidth="3"/>
              <path d="M15 50C15 41.7157 21.7157 35 30 35C38.2843 35 45 41.7157 45 50" stroke="white" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>

          <h3 className="text-4xl font-bold font-akatab mb-4 leading-tight">
            Join Thousands of Healthcare Professionals
          </h3>
          <p className="mb-8 text-base font-akatab leading-relaxed text-green-50">
            Create your account today and experience the future of prescription
            management. Our platform is trusted by healthcare providers worldwide
            to deliver better patient care through innovative technology.
          </p>

          {/* Feature list */}
          <div className="space-y-4">
            {[
              "Free account with no credit card required",
              "Secure data encryption and HIPAA compliance",
              "24/7 customer support for all users",
              "Easy migration from existing systems"
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

          {/* Stats */}
          <div className="mt-10 pt-8 border-t border-white/20">
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">10K+</div>
                <div className="text-xs text-green-100">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">50K+</div>
                <div className="text-xs text-green-100">Prescriptions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">99.9%</div>
                <div className="text-xs text-green-100">Uptime</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
            onClick={closeOtpModal}
          ></div>
          
          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 animate-scale-in">
            {/* Close button */}
            <button
              onClick={closeOtpModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Mail size={32} className="text-green-600" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-center text-gray-800 mb-2">
              Verify Your Email
            </h3>
            <p className="text-center text-gray-600 mb-6">
              We've sent a 6-digit code to<br />
              <span className="font-medium text-gray-800">{email}</span>
            </p>

            {/* Error/Success Messages */}
            {otpError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 flex items-center gap-2 animate-shake">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="8" r="8" fill="#DC2626"/>
                  <path d="M8 4V8M8 11H8.01" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                {otpError}
              </div>
            )}

            {otpSuccess && (
              <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600 flex items-center gap-2">
                <CheckCircle2 size={16} />
                {otpSuccess}
              </div>
            )}

            {/* OTP Input */}
            <div className="flex justify-center gap-2 mb-6">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { otpInputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  onPaste={index === 0 ? handleOtpPaste : undefined}
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-200 rounded-lg focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-all"
                />
              ))}
            </div>

            {/* Verify Button */}
            <button
              onClick={handleVerifyOtp}
              disabled={verifyingOtp || otp.join("").length !== 6}
              className={`w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 ${
                verifyingOtp || otp.join("").length !== 6
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#278B51] to-[#32A05F] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              }`}
            >
              {verifyingOtp ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                  </svg>
                  Verifying...
                </span>
              ) : (
                "Verify Email"
              )}
            </button>

            {/* Resend OTP */}
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Didn't receive the code?{" "}
                {resendCooldown > 0 ? (
                  <span className="text-gray-400">
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    disabled={resendingOtp}
                    className="text-green-600 font-medium hover:text-green-700 hover:underline transition-colors inline-flex items-center gap-1"
                  >
                    {resendingOtp ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      "Resend Code"
                    )}
                  </button>
                )}
              </p>
            </div>

            {/* Change Email */}
            <div className="mt-4 text-center">
              <button
                onClick={closeOtpModal}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Use a different email
              </button>
            </div>
          </div>
        </div>
      )}

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
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}