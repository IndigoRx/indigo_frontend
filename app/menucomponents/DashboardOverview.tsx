"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  UserPlus,
  Activity,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";
import CreatePrescriptionModal from "@/app/menucomponents/CreatePrescriptionModal";

interface DashboardStats {
  totalPatients: number;
  activePatients: number;
  totalPrescriptions: number;
  prescriptionsThisMonth: number;
  prescriptionsToday: number;
  pendingPrescriptions: number;
  newPatientsThisMonth: number;
  newPatientsThisWeek: number;
}

interface RecentPatient {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  prescriptionCount: number;
}

interface RecentPrescription {
  id: number;
  patientName: string;
  patientId: number;
  createdAt: string;
  status: string;
  diagnosis: string;
  medicationCount: number;
}

interface PatientTrend {
  month: string;
  year: number;
  count: number;
}

interface DashboardData {
  doctorId: number;
  doctorName: string;
  specialization: string;
  profileComplete: boolean;
  validated: number;
  stats: DashboardStats;
  recentPatients: RecentPatient[];
  recentPrescriptions: RecentPrescription[];
  patientTrend: PatientTrend[];
}

// Animated counter component
const AnimatedNumber = ({ value, duration = 1000 }: { value: number; duration?: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      // Easing function for smooth deceleration
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      setDisplayValue(Math.floor(easeOutQuart * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{displayValue}</>;
};

// Prescription Icon SVG Component
const PrescriptionIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round"
    className={className}
  >
    <path d="M14 3v4a1 1 0 0 0 1 1h4" />
    <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
    <path d="M10 12h4" />
    <path d="M10 16h4" />
    <path d="M9 12v4" />
  </svg>
);

export default function DashboardOverview() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(API_ENDPOINTS.DOCTOR_DASHBOARD, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard data: ${response.status}`);
      }

      const data: DashboardData = await response.json();
      setDashboardData(data);
    } catch (err: any) {
      console.error("Error fetching dashboard:", err);
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "COMPLETED":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // Loading state with pulse animation
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 border-3 border-gray-200 border-t-[#166534] rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-3 border-transparent border-t-[#22c55e] rounded-full animate-spin opacity-30" style={{ animationDuration: '1.5s' }}></div>
          </div>
          <p className="text-gray-600 animate-pulse">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Error state with fade-in
  if (error) {
    return (
      <div className="bg-white border border-red-200 rounded-xl p-6 text-center animate-fadeIn">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => fetchDashboardData()}
          className="px-4 py-2 bg-[#166534] text-white rounded-lg hover:bg-[#14532D] transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!dashboardData) {
    return null;
  }

  const { stats, recentPatients, recentPrescriptions, patientTrend } = dashboardData;
  const maxTrendCount = Math.max(...patientTrend.map((t) => t.count), 1);

  return (
    <>
      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(20px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(-20px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        
        @keyframes growWidth {
          from { width: 0; }
        }
        
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        
        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-4px);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out forwards;
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }
        
        .animate-scaleIn {
          animation: scaleIn 0.4s ease-out forwards;
        }
        
        .stagger-1 { animation-delay: 0.1s; opacity: 0; }
        .stagger-2 { animation-delay: 0.2s; opacity: 0; }
        .stagger-3 { animation-delay: 0.3s; opacity: 0; }
        .stagger-4 { animation-delay: 0.4s; opacity: 0; }
        .stagger-5 { animation-delay: 0.5s; opacity: 0; }
        .stagger-6 { animation-delay: 0.6s; opacity: 0; }
        
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.15);
        }
        
        .icon-float {
          transition: transform 0.3s ease;
        }
        
        .group:hover .icon-float {
          transform: translateY(-2px) scale(1.05);
        }
        
        .progress-bar-animated {
          animation: growWidth 1s ease-out forwards;
        }
        
        .table-row-hover {
          transition: all 0.2s ease;
        }
        
        .table-row-hover:hover {
          background-color: rgba(22, 101, 52, 0.04);
        }
        
        .btn-hover {
          position: relative;
          overflow: hidden;
        }
        
        .btn-hover::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s ease;
        }
        
        .btn-hover:hover::after {
          transform: translateX(100%);
        }
        
        .fab-pulse::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: inherit;
          animation: pulse-ring 2s ease-out infinite;
        }
        
        .fab-hover:hover {
          animation: bounce-subtle 0.6s ease-in-out;
        }
      `}</style>

      <div className={`space-y-6 ${mounted ? 'animate-fadeIn' : 'opacity-0'}`}>
        {/* Header with refresh */}
        <div className="flex items-center justify-between animate-fadeInUp stagger-1">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-500 mt-1">Monitor your practice at a glance</p>
          </div>
          <button
            onClick={() => fetchDashboardData(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50 group btn-hover"
          >
            <RefreshCw 
              size={16} 
              className={`transition-transform duration-500 ${refreshing ? "animate-spin" : "group-hover:rotate-180"}`} 
            />
            <span className="text-sm font-medium text-gray-700">Refresh</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Patients */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift group animate-fadeInUp stagger-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Patients</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  <AnimatedNumber value={stats.totalPatients} />
                </p>
                <p className="text-sm text-[#166534] mt-2 flex items-center gap-1">
                  <UserPlus size={14} className="transition-transform group-hover:scale-110" />
                  <span>+{stats.newPatientsThisMonth} this month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-blue-100 group-hover:scale-110">
                <Users size={24} className="text-blue-600 icon-float" />
              </div>
            </div>
          </div>

          {/* Total Prescriptions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift group animate-fadeInUp stagger-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  <AnimatedNumber value={stats.totalPrescriptions} />
                </p>
                <p className="text-sm text-[#166534] mt-2 flex items-center gap-1">
                  <TrendingUp size={14} className="transition-transform group-hover:scale-110" />
                  <span>+{stats.prescriptionsThisMonth} this month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-green-100 group-hover:scale-110">
                <FileText size={24} className="text-green-600 icon-float" />
              </div>
            </div>
          </div>

          {/* Today's Prescriptions */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift group animate-fadeInUp stagger-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Today's Prescriptions</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  <AnimatedNumber value={stats.prescriptionsToday} duration={800} />
                </p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Calendar size={14} className="transition-transform group-hover:scale-110" />
                  <span>Updated just now</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-purple-100 group-hover:scale-110">
                <Activity size={24} className="text-purple-600 icon-float" />
              </div>
            </div>
          </div>

          {/* New Patients This Week */}
          <div className="bg-white rounded-xl border border-gray-200 p-5 hover-lift group animate-fadeInUp stagger-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">New This Week</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  <AnimatedNumber value={stats.newPatientsThisWeek} duration={800} />
                </p>
                <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
                  <Clock size={14} className="transition-transform group-hover:scale-110" />
                  <span>New patients</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:bg-orange-100 group-hover:scale-110">
                <UserPlus size={24} className="text-orange-600 icon-float" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Lists Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Patient Trend Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fadeInUp stagger-5 hover-lift">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Patient Growth</h3>
              <span className="text-sm text-gray-500 px-3 py-1 bg-gray-50 rounded-full">Last 6 months</span>
            </div>
            <div className="space-y-3">
              {patientTrend.map((trend, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-4 group"
                  style={{ animationDelay: `${0.7 + index * 0.1}s` }}
                >
                  <div className="w-12 text-sm text-gray-600 font-medium transition-colors group-hover:text-[#166534]">
                    {trend.month}
                  </div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#166534] to-[#22c55e] rounded-lg transition-all duration-700 ease-out relative overflow-hidden"
                      style={{
                        width: mounted ? `${(trend.count / maxTrendCount) * 100}%` : '0%',
                        minWidth: trend.count > 0 ? "20px" : "0",
                        transitionDelay: `${0.3 + index * 0.1}s`,
                      }}
                    >
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                        style={{
                          animation: 'shimmer 2s infinite',
                          backgroundSize: '200% 100%',
                        }}
                      />
                    </div>
                  </div>
                  <div className="w-8 text-sm font-semibold text-gray-900 text-right transition-transform group-hover:scale-110">
                    {trend.count}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Patients */}
          <div className="bg-white rounded-xl border border-gray-200 p-6 animate-fadeInUp stagger-6 hover-lift">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Patients</h3>
              <button className="text-sm text-[#166534] hover:text-[#14532D] flex items-center gap-1 group transition-colors">
                <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#166534] after:transition-all group-hover:after:w-full">
                  View all
                </span>
                <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
            <div className="space-y-3">
              {recentPatients.length === 0 ? (
                <p className="text-gray-500 text-center py-8 animate-pulse">No patients yet</p>
              ) : (
                recentPatients.map((patient, index) => (
                  <div
                    key={patient.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all duration-300 cursor-pointer group animate-slideInRight"
                    style={{ animationDelay: `${0.8 + index * 0.1}s`, opacity: 0 }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#166534] rounded-full flex items-center justify-center text-white font-semibold text-sm transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        {patient.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-[#166534] transition-colors">{patient.name}</p>
                        <p className="text-sm text-gray-500">{patient.phone || patient.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        {patient.prescriptionCount} Rx
                      </p>
                      <p className="text-xs text-gray-500">{formatDate(patient.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 animate-scaleIn hover-lift" style={{ animationDelay: '0.7s', opacity: 0, animationFillMode: 'forwards' }}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Prescriptions</h3>
            <button className="text-sm text-[#166534] hover:text-[#14532D] flex items-center gap-1 group transition-colors">
              <span className="relative after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#166534] after:transition-all group-hover:after:w-full">
                View all
              </span>
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="overflow-x-auto">
            {recentPrescriptions.length === 0 ? (
              <p className="text-gray-500 text-center py-8 animate-pulse">No prescriptions yet</p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Patient</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Diagnosis</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Medications</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentPrescriptions.map((prescription, index) => (
                    <tr 
                      key={prescription.id} 
                      className="border-b border-gray-100 table-row-hover cursor-pointer"
                      style={{ 
                        animation: 'fadeInUp 0.5s ease-out forwards',
                        animationDelay: `${0.9 + index * 0.1}s`,
                        opacity: 0 
                      }}
                    >
                      <td className="py-3 px-4">
                        <p className="font-medium text-gray-900 hover:text-[#166534] transition-colors">{prescription.patientName}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-gray-600 truncate max-w-[200px]">
                          {prescription.diagnosis || "—"}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 transition-transform hover:scale-105">
                          {prescription.medicationCount} items
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm text-gray-600">{formatDate(prescription.createdAt)}</p>
                        <p className="text-xs text-gray-400">{formatTime(prescription.createdAt)}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-all duration-300 hover:shadow-sm ${getStatusColor(
                            prescription.status
                          )}`}
                        >
                          {prescription.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          className="fixed bottom-6 right-6 z-50 group"
          onClick={() => setShowPrescriptionModal(true)}
        >
          {/* Pulse ring effect */}
          <span className="absolute inset-0 rounded-full bg-[#166534] fab-pulse"></span>
          
          {/* Main button */}
          <div className="relative flex items-center gap-2 px-5 py-4 bg-gradient-to-r from-[#166534] to-[#15803d] text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 fab-hover">
            {/* Prescription SVG Icon */}
            <PrescriptionIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" />
            
            {/* Text */}
            <span className="font-semibold text-sm tracking-wide">Rx +</span>
          </div>
          
          {/* Tooltip on hover */}
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            New Prescription
            <span className="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></span>
          </span>
        </button>

        {/* Create Prescription Modal */}
        <CreatePrescriptionModal
          isOpen={showPrescriptionModal}
          onClose={() => setShowPrescriptionModal(false)}
          onSuccess={() => {
            setShowPrescriptionModal(false);
            fetchDashboardData(true);
          }}
        />
      </div>
    </>
  );
}