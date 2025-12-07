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
  Stethoscope,
  Phone,
  CreditCard,
  Building2,
  IdCard,
  Award,
  Activity,
  TrendingUp,
  Calendar,
  Bell,
  Search,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

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
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        router.push("/login");
        return;
      }

      const response = await fetch(API_ENDPOINTS.DOCTOR_DATA(userId), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch doctor data");
      }

      const data = await response.json();
      setDoctorData(data);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      if (error instanceof Error && error.message.includes("401")) {
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

  const stats = [
    { label: "Total Patients", value: "1,234", change: "+12%", icon: Users },
    { label: "Prescriptions", value: "856", change: "+8%", icon: FileText },
    { label: "This Month", value: "142", change: "+23%", icon: Calendar },
    { label: "Active Cases", value: "89", change: "+5%", icon: TrendingUp },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-gray-200 border-t-[#166534] rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

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
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="32" height="32" rx="6" fill="white" fillOpacity="0.15" />
                <path d="M10 16L14.5 20.5L22 11" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <h1 className="text-xl font-semibold text-white">
                IndigoRx
              </h1>
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
                {doctorData?.firstName.charAt(0)}
                {doctorData?.lastName.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-white truncate text-sm">
                  Dr. {doctorData?.firstName} {doctorData?.lastName}
                </p>
                <p className="text-xs text-white/70 truncate">{doctorData?.specialization}</p>
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
                    Welcome, Dr. {doctorData?.firstName}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative hidden md:block">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
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
          {/* Profile Completion Banner */}
          <div className="mb-6">
            <button className="w-full bg-white rounded-lg border border-gray-200 p-4 hover:border-[#166534] hover:shadow-sm transition-all text-left group">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">Complete Your Profile</h3>
                  <p className="text-sm text-gray-600">Add more information to unlock all features</p>
                </div>
                <span className="text-2xl font-bold text-[#166534]">20%</span>
              </div>
              <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#166534] rounded-full transition-all duration-500"
                  style={{ width: '20%' }}
                ></div>
              </div>
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#166534] hover:shadow-sm transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-[#166534]">
                      <Icon size={20} className="text-white" strokeWidth={2} />
                    </div>
                    <span className="text-xs font-semibold text-[#166534] bg-green-50 px-2 py-1 rounded">
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                </div>
              );
            })}
          </div>

          {/* Doctor Information Card */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
            <div className="bg-[#166534] p-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                  <span className="text-2xl font-semibold text-white">
                    {doctorData?.firstName.charAt(0)}
                    {doctorData?.lastName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Dr. {doctorData?.firstName} {doctorData?.lastName}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90">
                    <Award size={16} strokeWidth={2} />
                    <span className="text-sm font-medium">{doctorData?.specialization}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-lg">
                    <IdCard size={20} className="text-gray-700" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">License Number</p>
                    <p className="text-sm font-medium text-gray-900">{doctorData?.licenseNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-lg">
                    <Building2 size={20} className="text-gray-700" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Hospital</p>
                    <p className="text-sm font-medium text-gray-900">{doctorData?.hospitalName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-lg">
                    <Phone size={20} className="text-gray-700" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Contact</p>
                    <p className="text-sm font-medium text-gray-900">{doctorData?.contactNumber}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-lg">
                    <CreditCard size={20} className="text-gray-700" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Stripe Account</p>
                    <p className="text-sm font-medium text-gray-900 truncate">{doctorData?.stripeUsername}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2.5 bg-gray-100 rounded-lg">
                    <Stethoscope size={20} className="text-gray-700" strokeWidth={2} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Doctor ID</p>
                    <p className="text-sm font-medium text-gray-900">{doctorData?.id}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <button className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#166534] hover:shadow-sm transition-all text-left group">
              <div className="w-12 h-12 bg-[#166534] rounded-lg flex items-center justify-center mb-4">
                <Users size={22} className="text-white" strokeWidth={2} />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Add New Patient</h4>
              <p className="text-sm text-gray-600">Register a new patient to your practice</p>
            </button>

            <button className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#166534] hover:shadow-sm transition-all text-left group">
              <div className="w-12 h-12 bg-[#166534] rounded-lg flex items-center justify-center mb-4">
                <FileText size={22} className="text-white" strokeWidth={2} />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">Create Prescription</h4>
              <p className="text-sm text-gray-600">Generate a new digital prescription</p>
            </button>

            <button className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#166534] hover:shadow-sm transition-all text-left group">
              <div className="w-12 h-12 bg-[#166534] rounded-lg flex items-center justify-center mb-4">
                <Activity size={22} className="text-white" strokeWidth={2} />
              </div>
              <h4 className="text-base font-semibold text-gray-900 mb-2">View Analytics</h4>
              <p className="text-sm text-gray-600">Check your practice statistics</p>
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}