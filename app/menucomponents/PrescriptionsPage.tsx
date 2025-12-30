"use client";

import React, { useState, useEffect } from "react";
import {
  FileText,
  Search,
  Plus,
  Download,
  Calendar,
  User,
  Pill,
  Clock,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";
import CreatePrescriptionModal from "@/app/menucomponents/CreatePrescriptionModal";

// Backend API types
interface BackendPrescription {
  id: number;
  patient: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
  };
  doctor: {
    id: number;
    firstName: string;
    lastName: string;
    specialization: string;
    licenseNumber: string;
  };
  medications: Array<{
    id: number;
    drug: {
      id: number;
      name: string;
      genericName: string;
      category: string;
    };
    dosage: string;
    frequency: string;
    duration: string;
    instructions?: string;
  }>;
  prescriptionDate: string;
  status: string;
  specialInstructions?: string;
  validUntil: string;
  diagnosis?: string;
  createdAt: string;
  updatedAt: string;
}

interface PrescriptionsResponse {
  success: boolean;
  data: BackendPrescription[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Frontend display types
interface PrescriptionMedication {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface Prescription {
  id: number;
  patientName: string;
  medications: PrescriptionMedication[];
  date: string;
  status: "ACTIVE" | "COMPLETED" | "PENDING" | "CANCELLED" | "EXPIRED";
  specialInstructions?: string;
  diagnosis?: string;
  patient?: any;
  doctor?: any;
}

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);

  // API state
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Pagination state
  const [prescriptionPage, setPrescriptionPage] = useState(0);
  const [prescriptionTotalPages, setPrescriptionTotalPages] = useState(0);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);

  // Download signed prescription PDF from backend
  const downloadPrescriptionPDF = async (prescription: Prescription) => {
    setDownloadingId(prescription.id);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(API_ENDPOINTS.PRESCRIPTION_DOWNLOAD(prescription.id), {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to download prescription");
      }

      // Get the blob from response
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Get filename from Content-Disposition header or generate one
      const contentDisposition = response.headers.get("Content-Disposition");
      let filename = `prescription_${prescription.id}_${prescription.patientName.replace(/\s+/g, "_")}.pdf`;

      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error("Error downloading prescription:", err);
      setError(err.message || "Failed to download prescription PDF");
    } finally {
      setDownloadingId(null);
    }
  };

  const fetchPrescriptions = async (page = 0) => {
    setPrescriptionsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      const url = new URL(`${API_ENDPOINTS.PRESCRIPTIONS}`);
      url.searchParams.append("page", page.toString());
      url.searchParams.append("size", "10");
      url.searchParams.append("sortBy", "prescriptionDate");
      url.searchParams.append("sortDirection", "desc");

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch prescriptions");
      }

      const data: PrescriptionsResponse = await response.json();

      const transformedPrescriptions: Prescription[] = data.data.map((p) => ({
        id: p.id,
        patientName: `${p.patient.firstName} ${p.patient.lastName}`,
        medications: p.medications.map((m) => ({
          medication: m.drug.name,
          dosage: m.dosage,
          frequency: m.frequency,
          duration: m.duration,
          instructions: m.instructions,
        })),
        date: p.prescriptionDate,
        status: p.status as any,
        specialInstructions: p.specialInstructions,
        diagnosis: p.diagnosis,
        patient: p.patient,
        doctor: p.doctor,
      }));

      setPrescriptions(transformedPrescriptions);
      setPrescriptionTotalPages(data.totalPages);
      setPrescriptionPage(data.currentPage);
      setTotalPrescriptions(data.totalElements);
    } catch (err: any) {
      console.error("Error fetching prescriptions:", err);
      setError(err.message || "Failed to load prescriptions");
    } finally {
      setPrescriptionsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medications.some((med) =>
        med.medication.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handlePrescriptionCreated = () => {
    setShowCreateModal(false);
    fetchPrescriptions();
    alert("Prescription created successfully!");
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "COMPLETED":
        return "bg-gray-100 text-gray-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "CANCELLED":
        return "bg-red-100 text-red-700";
      case "EXPIRED":
        return "bg-orange-100 text-orange-700";
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

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-800">Error</p>
            <p className="text-sm text-red-700 mt-1">{error}</p>
          </div>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-600"
          >
            <X size={18} />
          </button>
        </div>
      )}

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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Prescriptions</p>
            <FileText size={20} className="text-[#166534]" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{totalPrescriptions}</p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Active</p>
            <FileText size={20} className="text-green-600" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {prescriptions.filter((p) => p.status === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <Clock size={20} className="text-yellow-600" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {prescriptions.filter((p) => p.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">This Month</p>
            <Calendar size={20} className="text-[#166534]" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {prescriptions.filter((p) => {
              const prescDate = new Date(p.date);
              const now = new Date();
              return prescDate.getMonth() === now.getMonth() && prescDate.getFullYear() === now.getFullYear();
            }).length}
          </p>
        </div>
      </div>

      {/* Prescription List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {prescriptionsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={32} className="animate-spin text-[#166534]" />
          </div>
        ) : (
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
                {filteredPrescriptions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No prescriptions found
                    </td>
                  </tr>
                ) : (
                  filteredPrescriptions.map((prescription) => (
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
                        <div className="flex flex-col gap-1">
                          {prescription.medications.slice(0, 2).map((med, idx) => (
                            <div key={idx} className="flex items-center gap-2">
                              <Pill size={16} className="text-gray-400" />
                              <span className="text-gray-900">{med.medication}</span>
                            </div>
                          ))}
                          {prescription.medications.length > 2 && (
                            <span className="text-xs text-gray-500 mt-1 ml-6">
                              +{prescription.medications.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {prescription.medications.slice(0, 1).map((med, idx) => (
                            <div key={idx}>
                              <p className="text-sm text-gray-900">{med.dosage}</p>
                              <p className="text-xs text-gray-500">
                                {med.frequency} • {med.duration}
                              </p>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar size={14} />
                          <span>{new Date(prescription.date).toLocaleDateString()}</span>
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
                          <button
                            onClick={() => downloadPrescriptionPDF(prescription)}
                            disabled={downloadingId === prescription.id}
                            className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-[#166534] disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Download Signed Prescription PDF"
                          >
                            {downloadingId === prescription.id ? (
                              <Loader2 size={18} className="animate-spin" />
                            ) : (
                              <Download size={18} strokeWidth={2} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {prescriptionTotalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
            <button
              onClick={() => fetchPrescriptions(prescriptionPage - 1)}
              disabled={prescriptionPage === 0}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="text-sm text-gray-600">
              Page {prescriptionPage + 1} of {prescriptionTotalPages}
            </span>
            <button
              onClick={() => fetchPrescriptions(prescriptionPage + 1)}
              disabled={prescriptionPage >= prescriptionTotalPages - 1}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Create Prescription Modal */}
      <CreatePrescriptionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handlePrescriptionCreated}
      />
    </div>
  );
}