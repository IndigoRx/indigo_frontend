"use client";

import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  Calendar,
  ChevronRight,
  UserCircle,
  ChevronLeft,
  MapPin,
  FileText,
  Download,
  Loader2,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";
import AddPatientModal from "@/app/menucomponents/AddPatientModal";

interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  contactNumber: string;
  email: string;
  address: string;
  bloodGroup: string;
  medicalHistory: string;
  allergies: string;
  numberOfVisit: number;
  age: number;
  doctorId: number;
}

interface PaginationInfo {
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingReportId, setDownloadingReportId] = useState<number | null>(null);
  const [pagination, setPagination] = useState<PaginationInfo>({
    totalElements: 0,
    totalPages: 0,
    size: 10,
    number: 0,
  });
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [sortField, setSortField] = useState("name,asc");

  useEffect(() => {
    fetchPatients();
  }, [currentPage, pageSize, sortField]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const [sortBy, sortDirection] = sortField.split(",");

      const requestUrl = `${API_ENDPOINTS.GET_PATIENTS}?page=${currentPage}&size=${pageSize}&sortBy=${sortBy}&sortDirection=${sortDirection}`;

      console.log("📤 GET Request to:", requestUrl);
      console.log("📋 Parameters:", {
        page: currentPage,
        size: pageSize,
        sortBy,
        sortDirection,
      });

      const response = await fetch(requestUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("📥 Response Status:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Failed to fetch patients: ${response.statusText}`);
      }

      const data = await response.json();
      console.log("✅ Patients Response:", {
        totalPatients: data.patients?.length,
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      });

      setPatients(data.patients || []);
      setPagination({
        totalElements: data.totalItems || 0,
        totalPages: data.totalPages || 0,
        size: pageSize,
        number: data.currentPage || 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch patients");
      console.error("❌ Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = async (patientId: number, patientName: string) => {
    try {
      setDownloadingReportId(patientId);
      
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Authentication required. Please log in.");
        return;
      }

      const response = await fetch(
        API_ENDPOINTS.PATIENT_REPORT_PDF(patientId),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.statusText}`);
      }

      // Get the blob from response
      const blob = await response.blob();
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      
      // Generate filename
      const cleanName = patientName.replace(/[^a-zA-Z0-9]/g, "_");
      const timestamp = new Date().toISOString().slice(0, 10);
      link.download = `Patient_Report_${cleanName}_${timestamp}.pdf`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      
      console.log("✅ Report downloaded successfully for patient:", patientName);
    } catch (err) {
      console.error("❌ Error downloading report:", err);
      setError(err instanceof Error ? err.message : "Failed to download report");
    } finally {
      setDownloadingReportId(null);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 0 && newPage < pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(0);
  };

  const calculateAge = (dateOfBirth: string) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleAddPatientSuccess = () => {
    setShowAddModal(false);
    fetchPatients();
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ??
      false
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#166534]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage your patient records and information
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors"
        >
          <Plus size={20} strokeWidth={2} />
          <span>Add Patient</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
          <span>{error}</span>
          <button 
            onClick={() => setError(null)}
            className="text-red-500 hover:text-red-700"
          >
            ×
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
              placeholder="Search patients by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
            />
          </div>
          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
            className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534]"
          >
            <option value="name,asc">Name (A-Z)</option>
            <option value="name,desc">Name (Z-A)</option>
            <option value="dateOfBirth,asc">Age (Oldest First)</option>
            <option value="dateOfBirth,desc">Age (Youngest First)</option>
            <option value="numberOfVisit,desc">Most Visits</option>
            <option value="numberOfVisit,asc">Least Visits</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Patients</p>
            <Users size={20} className="text-[#166534]" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {pagination.totalElements}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Current Page</p>
            <Users size={20} className="text-[#166534]" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {pagination.totalPages > 0 ? currentPage + 1 : 0} /{" "}
            {pagination.totalPages}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Showing</p>
            <Users size={20} className="text-[#166534]" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {filteredPatients.length}
          </p>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Demographics
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Visits
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Medical History
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Report
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <UserCircle size={24} className="text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {patient.fullName}
                          </p>
                          {patient.address && (
                            <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                              <MapPin size={12} />
                              <span className="truncate max-w-[150px]">
                                {patient.address}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {patient.contactNumber && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Phone size={14} />
                            <span>{patient.contactNumber}</span>
                          </div>
                        )}
                        {patient.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail size={14} />
                            <span className="truncate max-w-[180px]">
                              {patient.email}
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <p className="text-sm text-gray-900">
                          {calculateAge(patient.dateOfBirth)} years •{" "}
                          {patient.gender}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar size={12} />
                          <span>
                            DOB:{" "}
                            {new Date(patient.dateOfBirth).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {patient.numberOfVisit}{" "}
                          {patient.numberOfVisit === 1 ? "visit" : "visits"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-900 line-clamp-2 max-w-[200px]">
                        {patient.medicalHistory || "No history available"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleDownloadReport(patient.id, patient.fullName)}
                        disabled={downloadingReportId === patient.id}
                        className="flex items-center gap-2 px-3 py-2 bg-[#166534] text-white rounded-lg font-medium text-sm hover:bg-[#14532D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {downloadingReportId === patient.id ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <FileText size={16} />
                            <span>Print Report</span>
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination.totalPages > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-700">
                Showing {currentPage * pageSize + 1} to{" "}
                {Math.min(
                  (currentPage + 1) * pageSize,
                  pagination.totalElements
                )}{" "}
                of {pagination.totalElements} results
              </span>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#166534]"
              >
                <option value={5}>5 per page</option>
                <option value={10}>10 per page</option>
                <option value={20}>20 per page</option>
                <option value={50}>50 per page</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 0}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {Array.from({ length: pagination.totalPages }, (_, i) => i)
                  .filter((page) => {
                    return (
                      page === 0 ||
                      page === pagination.totalPages - 1 ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    const showEllipsisBefore =
                      index > 0 && page - array[index - 1] > 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className="px-2 text-gray-500">...</span>
                        )}
                        <button
                          onClick={() => handlePageChange(page)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-[#166534] text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page + 1}
                        </button>
                      </React.Fragment>
                    );
                  })}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages - 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleAddPatientSuccess}
      />
    </div>
  );
}