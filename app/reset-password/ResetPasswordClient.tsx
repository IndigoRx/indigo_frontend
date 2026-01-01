"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

export default function ResetPasswordClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [validatingToken, setValidatingToken] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenError, setTokenError] = useState("");

  useEffect(() => {
    setMounted(true);
    validateToken();
  }, [token]);

  useEffect(() => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password) && /[^a-zA-Z0-9]/.test(password))
      strength += 25;
    setPasswordStrength(strength);
  }, [password]);

  const validateToken = async () => {
    if (!token) {
      setTokenError("Invalid reset link.");
      setValidatingToken(false);
      return;
    }

    try {
      const res = await fetch(
        `${API_ENDPOINTS.RESET_PASSWORD_VALIDATE}?token=${token}`
      );
      const data = await res.json();

      if (res.ok && data.valid) {
        setTokenValid(true);
      } else {
        setTokenError(data.message || "Reset link expired or invalid.");
      }
    } catch {
      setTokenError("Unable to validate reset link.");
    } finally {
      setValidatingToken(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.RESET_PASSWORD, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          newPassword: password,
          confirmPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Password reset failed.");
    } finally {
      setLoading(false);
    }
  };

  if (validatingToken) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Validating reset link…</p>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <XCircle className="mx-auto text-red-600 mb-4" size={48} />
          <h2 className="text-2xl font-semibold mb-2">Invalid Reset Link</h2>
          <p className="text-gray-600 mb-6">{tokenError}</p>
          <button
            onClick={() => router.push("/forgot-password")}
            className="w-full bg-green-600 text-white py-2 rounded-lg"
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-6">
      <div className="max-w-md w-full">
        {!success ? (
          <>
            <h1 className="text-3xl font-semibold mb-6">Reset Password</h1>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type={showPwd ? "text" : "password"}
                placeholder="New password"
                className="w-full border p-3 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <input
                type={showConfirmPwd ? "text" : "password"}
                placeholder="Confirm password"
                className="w-full border p-3 rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />

              <button
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded"
              >
                {loading ? "Resetting…" : "Reset Password"}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">
            <CheckCircle2 className="mx-auto text-green-600 mb-4" size={48} />
            <h2 className="text-2xl font-semibold mb-2">
              Password Reset Successful
            </h2>
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-green-600 text-white py-3 rounded mt-4"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
