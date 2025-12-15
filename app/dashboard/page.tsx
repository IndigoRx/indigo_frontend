"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  FileText,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  AlertCircle,
  Activity,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";
import DashboardOverview from "../menucomponents/DashboardOverview";
import PatientsPage from "../menucomponents/PatientsPage";
import PrescriptionsPage from "../menucomponents/PrescriptionsPage";
import SettingsPage from "../menucomponents/SettingsPage";

interface DoctorData {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  hospitalName: string;
  contactNumber: string;
  stripeUsername: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      console.log("Fetching doctor data...", { token: !!token, userId });

      if (!token || !userId) {
        console.log("Missing credentials, redirecting to login");
        router.push("/login");
        return;
      }

      const endpoint = API_ENDPOINTS.DOCTOR_DATA(userId);
      console.log("API Endpoint:", endpoint);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(endpoint, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      console.log("Response status:", response.status);

      if (response.status === 401) {
        console.log("Unauthorized - clearing storage and redirecting");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        router.push("/login");
        return;
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`Failed to fetch doctor data: ${response.status}`);
      }

      const data = await response.json();
      console.log("Doctor data received:", data);

      if (!data || !data.firstName || !data.lastName) {
        throw new Error("Invalid doctor data structure received");
      }

      setDoctorData(data);
    } catch (error: any) {
      console.error("Error fetching doctor data:", error);

      if (error.name === "AbortError") {
        setError("Request timeout. Please check your connection.");
      } else if (error.message.includes("Failed to fetch")) {
        setError("Network error. Please check your internet connection.");
      } else {
        setError(error.message || "Failed to load doctor data");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    router.push("/login");
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "patients", label: "Patients", icon: Users },
    { id: "prescriptions", label: "Prescriptions", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-[#166534] rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white border border-red-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Unable to Load Dashboard
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="flex gap-3">
              <button
                onClick={fetchDoctorData}
                className="flex-1 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors"
              >
                Retry
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // No data state
  if (!doctorData || !doctorData.firstName || !doctorData.lastName) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="bg-white border border-gray-200 rounded-lg p-6 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Profile Data
            </h2>
            <p className="text-gray-600 mb-6">
              Your profile data could not be loaded. Please try again or contact
              support.
            </p>
            <div className="flex gap-3">
              <button
                onClick={fetchDoctorData}
                className="flex-1 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors"
              >
                Retry
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render the active section content
  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "patients":
        return <PatientsPage />;
      case "prescriptions":
        return <PrescriptionsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Confirm Logout
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to logout?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-[#166534] z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg
                width="32"
                height="32"
                viewBox="0 0 32 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect
                  width="32"
                  height="32"
                  rx="6"
                  fill="white"
                  fillOpacity="0.15"
                />
                <path
                  d="M10 16L14.5 20.5L22 11"
                  stroke="white"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <h1 className="text-xl font-semibold text-white">IndigoRx</h1>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-white/80 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all ${
                    isActive
                      ? "bg-white text-[#166534]"
                      : "text-white/90 hover:bg-white/10"
                  }`}
                >
                  <Icon size={20} strokeWidth={2} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Doctor Profile Card */}
        <div className="absolute bottom-6 left-4 right-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-semibold">
                {doctorData.firstName.charAt(0)}
                {doctorData.lastName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate text-sm">
                  Dr. {doctorData.firstName} {doctorData.lastName}
                </p>
                <p className="text-xs text-white/70 truncate">
                  {doctorData.specialization}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-lg text-sm font-medium transition-all"
            >
              <LogOut size={16} strokeWidth={2} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Menu size={24} className="text-gray-700" />
                </button>
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Welcome, Dr. {doctorData.firstName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder="Search patients..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent w-64 text-sm"
                  />
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell size={20} className="text-gray-700" strokeWidth={2} />
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#166534] rounded-full"></div>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6 bg-gray-50 min-h-screen">
          {renderActiveSection()}
        </main>
      </div>
    </div>
  );
}