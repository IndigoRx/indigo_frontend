"use client";

import React, { useState } from "react";
import {
  FileText,
  Search,
  Filter,
  Plus,
  Download,
  Eye,
  Calendar,
  User,
  Pill,
  Clock,
} from "lucide-react";

interface Prescription {
  id: number;
  patientName: string;
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  date: string;
  status: "Active" | "Completed" | "Pending";
}

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Mock prescription data
  const prescriptions: Prescription[] = [
    {
      id: 1001,
      patientName: "John Smith",
      medication: "Lisinopril",
      dosage: "10mg",
      frequency: "Once daily",
      duration: "30 days",
      date: "2024-12-10",
      status: "Active",
    },
    {
      id: 1002,
      patientName: "Sarah Johnson",
      medication: "Metformin",
      dosage: "500mg",
      frequency: "Twice daily",
      duration: "90 days",
      date: "2024-12-08",
      status: "Active",
    },
    {
      id: 1003,
      patientName: "Michael Brown",
      medication: "Albuterol Inhaler",
      dosage: "90mcg",
      frequency: "As needed",
      duration: "30 days",
      date: "2024-11-28",
      status: "Completed",
    },
    {
      id: 1004,
      patientName: "Emily Davis",
      medication: "Amoxicillin",
      dosage: "500mg",
      frequency: "Three times daily",
      duration: "7 days",
      date: "2024-12-12",
      status: "Pending",
    },
  ];

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medication.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-700";
      case "Completed":
        return "bg-gray-100 text-gray-700";
      case "Pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Prescriptions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all prescription records
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors"
        >
          <Plus size={20} strokeWidth={2} />
          <span>Create Prescription</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by patient name or medication..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            <Filter size={18} strokeWidth={2} />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Prescriptions</p>
            <FileText size={20} className="text-[#166534]" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">856</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active</p>
            <FileText size={20} className="text-green-600" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">234</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <Clock size={20} className="text-yellow-600" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">12</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">This Month</p>
            <Calendar size={20} className="text-[#166534]" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">142</p>
        </div>
      </div>

      {/* Prescription List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rx ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Medication
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Dosage & Frequency
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Date Issued
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPrescriptions.map((prescription) => (
                <tr
                  key={prescription.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm text-gray-900">
                      #{prescription.id}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-400" />
                      <span className="font-medium text-gray-900">
                        {prescription.patientName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Pill size={16} className="text-gray-400" />
                      <span className="text-gray-900">
                        {prescription.medication}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-sm text-gray-900">
                        {prescription.dosage}
                      </p>
                      <p className="text-xs text-gray-500">
                        {prescription.frequency} • {prescription.duration}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={14} />
                      <span>
                        {new Date(prescription.date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        prescription.status
                      )}`}
                    >
                      {prescription.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-[#166534]">
                        <Eye size={18} strokeWidth={2} />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-[#166534]">
                        <Download size={18} strokeWidth={2} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Prescription Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Prescription
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent">
                    <option value="">Select patient</option>
                    <option>John Smith</option>
                    <option>Sarah Johnson</option>
                    <option>Michael Brown</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medication Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                    placeholder="Enter medication name"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      placeholder="e.g., 10mg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
                    </label>
                    <select className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent">
                      <option>Once daily</option>
                      <option>Twice daily</option>
                      <option>Three times daily</option>
                      <option>As needed</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                    placeholder="e.g., 30 days"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent resize-none"
                    placeholder="Enter any special instructions for the patient"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors">
                Create Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}