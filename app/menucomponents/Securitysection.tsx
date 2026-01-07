"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, Check, X, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { API_ENDPOINTS } from "@/app/api/config";

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[!@#$%^&*(),.?":{}|<>]/.test(p) },
];

export default function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showRequirements, setShowRequirements] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Client-side validation
    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }

    if (!newPassword) {
      toast.error("Please enter a new password");
      return;
    }

    if (!confirmPassword) {
      toast.error("Please confirm your new password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    // Check all password requirements
    const failedRequirements = passwordRequirements.filter(
      (req) => !req.test(newPassword)
    );
    if (failedRequirements.length > 0) {
      toast.error(`Password requirements not met: ${failedRequirements[0].label}`);
      return;
    }

    if (currentPassword === newPassword) {
      toast.error("New password must be different from current password");
      return;
    }

    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please log in again.");
        setIsLoading(false);
        return;
      }

      // Prepare request body
      const requestBody = {
        currentPassword,
        newPassword,
        confirmPassword,
      };

      // Log API request details
      console.log("=== Change Password API Request ===");
      console.log("URL:", API_ENDPOINTS.CHANGE_PASSWORD);
      console.log("Method: PUT");
      console.log("Headers:", {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token.substring(0, 20)}...`,
      });
      console.log("Request Body:", {
        currentPassword: "***hidden***",
        newPassword: "***hidden***",
        confirmPassword: "***hidden***",
      });
      console.log("Token exists:", !!token);
      console.log("Token length:", token.length);

      const response = await fetch(API_ENDPOINTS.CHANGE_PASSWORD, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestBody),
      });

      // Log response details
      console.log("=== Change Password API Response ===");
      console.log("Status:", response.status);
      console.log("Status Text:", response.statusText);
      console.log("OK:", response.ok);
      console.log("Headers:", Object.fromEntries(response.headers.entries()));

      // Handle non-OK responses
      if (!response.ok) {
        console.error("Response not OK. Status:", response.status);
        
        if (response.status === 403) {
          toast.error("Access denied. Please check your permissions or log in again.");
          return;
        }
        if (response.status === 401) {
          toast.error("Session expired. Please log in again.");
          return;
        }
        if (response.status === 404) {
          toast.error("Endpoint not found. Please contact support.");
          return;
        }
      }

      // Try to get response text first
      const responseText = await response.text();
      console.log("Response Text:", responseText);

      // Parse JSON if there's content
      let data;
      if (responseText) {
        try {
          data = JSON.parse(responseText);
          console.log("Parsed Response Data:", data);
        } catch (parseError) {
          console.error("Failed to parse JSON:", parseError);
          toast.error("Invalid response from server");
          return;
        }
      } else {
        console.warn("Empty response body");
        if (response.ok) {
          toast.success("Password changed successfully");
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
          setShowRequirements(false);
        } else {
          toast.error("Request failed with no error message");
        }
        return;
      }

      if (data.success) {
        toast.success(data.message || "Password changed successfully");
        // Clear form
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setShowRequirements(false);
      } else {
        toast.error(data.message || "Failed to change password");
      }
    } catch (error) {
      console.error("=== Change Password Error ===");
      console.error("Error Type:", error instanceof Error ? error.constructor.name : typeof error);
      console.error("Error Message:", error instanceof Error ? error.message : error);
      console.error("Full Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrength = (): { level: number; label: string; color: string } => {
    const passed = passwordRequirements.filter((req) => req.test(newPassword)).length;
    if (passed === 0) return { level: 0, label: "", color: "bg-gray-200" };
    if (passed <= 2) return { level: 1, label: "Weak", color: "bg-red-500" };
    if (passed <= 3) return { level: 2, label: "Fair", color: "bg-yellow-500" };
    if (passed <= 4) return { level: 3, label: "Good", color: "bg-blue-500" };
    return { level: 4, label: "Strong", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Current Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Enter current password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                onFocus={() => setShowRequirements(true)}
                className="w-full pl-10 pr-12 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder-gray-500 bg-white"
                placeholder="Enter new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                      style={{ width: `${(passwordStrength.level / 4) * 100}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      passwordStrength.level <= 1
                        ? "text-red-600"
                        : passwordStrength.level === 2
                        ? "text-yellow-600"
                        : passwordStrength.level === 3
                        ? "text-blue-600"
                        : "text-green-600"
                    }`}
                  >
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}

            {/* Password Requirements */}
            {showRequirements && (
              <div className="mt-3 p-3 bg-gray-100 rounded-lg border border-gray-200">
                <p className="text-xs font-semibold text-gray-800 mb-2">
                  Password requirements:
                </p>
                <ul className="space-y-1">
                  {passwordRequirements.map((req, index) => {
                    const passed = req.test(newPassword);
                    return (
                      <li
                        key={index}
                        className={`flex items-center gap-2 text-xs font-medium ${
                          passed ? "text-green-700" : "text-gray-700"
                        }`}
                      >
                        {passed ? (
                          <Check size={14} className="text-green-600" />
                        ) : (
                          <X size={14} className="text-gray-500" />
                        )}
                        {req.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className={`w-full pl-10 pr-12 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder-gray-500 bg-white ${
                  confirmPassword && confirmPassword !== newPassword
                    ? "border-red-400"
                    : confirmPassword && confirmPassword === newPassword
                    ? "border-green-400"
                    : "border-gray-300"
                }`}
                placeholder="Confirm new password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && confirmPassword !== newPassword && (
              <p className="mt-1 text-xs text-red-600 font-medium">Passwords do not match</p>
            )}
            {confirmPassword && confirmPassword === newPassword && newPassword && (
              <p className="mt-1 text-xs text-green-600 font-medium flex items-center gap-1">
                <Check size={12} /> Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#166534] text-white font-medium rounded-lg hover:bg-[#14532d] focus:outline-none focus:ring-2 focus:ring-[#166534] focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Changing Password...
                </>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Security Tips */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-300 rounded-lg">
        <h4 className="text-sm font-semibold text-amber-900 mb-2">
          Security Tips
        </h4>
        <ul className="text-xs text-amber-800 space-y-1 font-medium">
          <li>• Never share your password with anyone</li>
          <li>• Use a unique password for IndigoRx</li>
          <li>• Consider using a password manager</li>
          <li>• Change your password regularly</li>
        </ul>
      </div>
    </div>
  );
}