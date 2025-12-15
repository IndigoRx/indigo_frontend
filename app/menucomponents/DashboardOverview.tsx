"use client";

import React from "react";
import {
  Users,
  FileText,
  Activity,
  TrendingUp,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

interface DashboardStats {
  label: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ElementType;
}

interface RecentActivity {
  id: number;
  type: "patient" | "prescription" | "appointment";
  title: string;
  subtitle: string;
  time: string;
}

export default function DashboardOverview() {
  const stats: DashboardStats[] = [
    {
      label: "Total Patients",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
    },
    {
      label: "Prescriptions",
      value: "856",
      change: "+8%",
      trend: "up",
      icon: FileText,
    },
    {
      label: "This Month",
      value: "142",
      change: "+23%",
      trend: "up",
      icon: Calendar,
    },
    {
      label: "Active Cases",
      value: "89",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
    },
  ];

  const recentActivities: RecentActivity[] = [
    {
      id: 1,
      type: "patient",
      title: "New patient registered",
      subtitle: "Emily Davis - General Checkup",
      time: "2 hours ago",
    },
    {
      id: 2,
      type: "prescription",
      title: "Prescription created",
      subtitle: "John Smith - Lisinopril 10mg",
      time: "4 hours ago",
    },
    {
      id: 3,
      type: "appointment",
      title: "Appointment scheduled",
      subtitle: "Sarah Johnson - Follow-up",
      time: "5 hours ago",
    },
    {
      id: 4,
      type: "prescription",
      title: "Prescription filled",
      subtitle: "Michael Brown - Albuterol Inhaler",
      time: "1 day ago",
    },
  ];

  const upcomingAppointments = [
    {
      id: 1,
      patient: "John Smith",
      time: "10:00 AM",
      type: "Follow-up",
      duration: "30 min",
    },
    {
      id: 2,
      patient: "Sarah Johnson",
      time: "11:30 AM",
      type: "Consultation",
      duration: "45 min",
    },
    {
      id: 3,
      patient: "Michael Brown",
      time: "2:00 PM",
      type: "Check-up",
      duration: "30 min",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <div
                  className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded ${
                    stat.trend === "up"
                      ? "text-[#166534] bg-green-50"
                      : "text-red-600 bg-red-50"
                  }`}
                >
                  {stat.trend === "up" ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}
                  <span>{stat.change}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h3>
              <button className="text-sm text-[#166534] hover:text-[#14532D] font-medium">
                View All
              </button>
            </div>
          </div>
          <div className="divide-y divide-gray-200">
            {recentActivities.map((activity) => {
              const getActivityIcon = () => {
                switch (activity.type) {
                  case "patient":
                    return <Users size={18} className="text-[#166534]" />;
                  case "prescription":
                    return <FileText size={18} className="text-[#166534]" />;
                  case "appointment":
                    return <Calendar size={18} className="text-[#166534]" />;
                  default:
                    return <Activity size={18} className="text-[#166534]" />;
                }
              };

              return (
                <div
                  key={activity.id}
                  className="p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2 bg-green-50 rounded-lg">
                      {getActivityIcon()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {activity.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-500">
                      <Clock size={14} />
                      <span>{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Today's Appointments */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Today's Appointments
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-gray-900">
                      {appointment.patient}
                    </p>
                    <p className="text-sm text-gray-600">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{appointment.time}</span>
                  </div>
                  <span>•</span>
                  <span>{appointment.duration}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t border-gray-200">
            <button className="w-full py-2 text-sm font-medium text-[#166534] hover:text-[#14532D] transition-colors">
              View Full Schedule
            </button>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#166534] hover:shadow-sm transition-all text-left group">
          <div className="w-12 h-12 bg-[#166534] rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Users size={22} className="text-white" strokeWidth={2} />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">
            Add New Patient
          </h4>
          <p className="text-sm text-gray-600">
            Register a new patient to your practice
          </p>
        </button>

        <button className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#166534] hover:shadow-sm transition-all text-left group">
          <div className="w-12 h-12 bg-[#166534] rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <FileText size={22} className="text-white" strokeWidth={2} />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">
            Create Prescription
          </h4>
          <p className="text-sm text-gray-600">
            Generate a new digital prescription
          </p>
        </button>

        <button className="bg-white rounded-lg p-6 border border-gray-200 hover:border-[#166534] hover:shadow-sm transition-all text-left group">
          <div className="w-12 h-12 bg-[#166534] rounded-lg flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
            <Activity size={22} className="text-white" strokeWidth={2} />
          </div>
          <h4 className="text-base font-semibold text-gray-900 mb-2">
            View Analytics
          </h4>
          <p className="text-sm text-gray-600">
            Check your practice statistics
          </p>
        </button>
      </div>
    </div>
  );
}