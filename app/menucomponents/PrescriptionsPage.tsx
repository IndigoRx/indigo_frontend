"use client";

import React, { useState, useEffect } from "react";
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
  X,
  ChevronDown,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

// Backend API types
interface BackendPatient {
  id: number;
  name: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  medicalHistory: string;
  allergies: string;
  age: number;
  firstName: string;
  lastName: string;
  contactNumber: string;
}

interface PatientsResponse {
  totalItems: number;
  patients: BackendPatient[];
  totalPages: number;
  currentPage: number;
}

interface PrescriptionMedicationDTO {
  drugId: number;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

interface CreatePrescriptionDTO {
  patientId: number;
  prescriptionDate?: string;
  validUntil?: string;
  diagnosis?: string;
  specialInstructions?: string;
  medications: PrescriptionMedicationDTO[];
}

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

interface Drug {
  id: number;
  name: string;
  genericName: string;
  category: string;
  commonDosages: string[];
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

interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
  email: string;
  bloodGroup?: string;
  allergies?: string;
  medicalHistory?: string;
}

export default function PrescriptionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [patientSearchQuery, setPatientSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [drugSearchQuery, setDrugSearchQuery] = useState("");
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);
  const [showDrugDropdown, setShowDrugDropdown] = useState(false);
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState("Once daily");
  const [duration, setDuration] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [instructions, setInstructions] = useState("");
  const [addedMedications, setAddedMedications] = useState<PrescriptionMedicationDTO[]>([]);

  // API state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [loading, setLoading] = useState(false);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [prescriptionsLoading, setPrescriptionsLoading] = useState(false);
  const [creatingPrescription, setCreatingPrescription] = useState(false);
  const [downloadingId, setDownloadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Pagination state
  const [patientPage, setPatientPage] = useState(0);
  const [patientTotalPages, setPatientTotalPages] = useState(0);
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

  // Fetch patients from API with search
  const fetchPatients = async (page = 0, search = "") => {
    setPatientsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem("token");
      let url: string;

      if (search && search.trim() !== "") {
        url = `${API_ENDPOINTS.PATIENTS}/search/doctor?searchTerm=${encodeURIComponent(search)}&page=${page}&size=10`;
      } else {
        url = `${API_ENDPOINTS.PATIENTS}/doctor?page=${page}&size=10`;
      }

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch patients");
      }

      const data: PatientsResponse = await response.json();
      
      const transformedPatients: Patient[] = data.patients.map((p) => ({
        id: p.id,
        name: `${p.firstName} ${p.lastName}`,
        age: p.age,
        phone: p.contactNumber || p.phone,
        lastVisit: new Date().toISOString().split("T")[0],
        email: p.email,
        bloodGroup: p.bloodGroup,
        allergies: p.allergies,
        medicalHistory: p.medicalHistory,
      }));

      setPatients(transformedPatients);
      setPatientTotalPages(data.totalPages);
      setPatientPage(data.currentPage);
    } catch (err: any) {
      console.error("Error fetching patients:", err);
      setError(err.message || "Failed to load patients");
      setPatients([]);
    } finally {
      setPatientsLoading(false);
    }
  };

  const handlePatientSearch = () => {
    setPatientPage(0);
    fetchPatients(0, patientSearchQuery);
    setShowPatientDropdown(true);
  };

  const handlePatientSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handlePatientSearch();
    }
  };

  const fetchPrescriptions = async (page = 0, search = "") => {
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

  const fetchDrugs = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_ENDPOINTS.DRUGS}?page=0&size=100`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch drugs");
      }

      const data = await response.json();
      setDrugs(data.data || data.drugs || []);
    } catch (err: any) {
      console.error("Error fetching drugs:", err);
      setDrugs(mockDrugs);
    }
  };

  useEffect(() => {
    fetchPrescriptions();
    fetchDrugs();
  }, []);

  const mockDrugs: Drug[] = [
    { id: 1, name: "Lisinopril", genericName: "Lisinopril", category: "ACE Inhibitor", commonDosages: ["5mg", "10mg", "20mg", "40mg"] },
    { id: 2, name: "Metformin", genericName: "Metformin HCL", category: "Antidiabetic", commonDosages: ["500mg", "850mg", "1000mg"] },
    { id: 3, name: "Atorvastatin", genericName: "Atorvastatin Calcium", category: "Statin", commonDosages: ["10mg", "20mg", "40mg", "80mg"] },
    { id: 4, name: "Amlodipine", genericName: "Amlodipine Besylate", category: "Calcium Channel Blocker", commonDosages: ["2.5mg", "5mg", "10mg"] },
    { id: 5, name: "Omeprazole", genericName: "Omeprazole", category: "Proton Pump Inhibitor", commonDosages: ["10mg", "20mg", "40mg"] },
  ];

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medications.some(med => 
        med.medication.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearchQuery(patient.name);
    setShowPatientDropdown(false);
  };

  const handleDrugSelect = (drug: Drug) => {
    setSelectedDrug(drug);
    setDrugSearchQuery(drug.name);
    setShowDrugDropdown(false);
    if (drug.commonDosages && drug.commonDosages.length > 0) {
      setDosage(drug.commonDosages[0]);
    }
  };

  const handleAddMedication = () => {
    if (selectedDrug && dosage && frequency && duration) {
      const newMedication: PrescriptionMedicationDTO = {
        drugId: selectedDrug.id,
        dosage,
        frequency,
        duration,
        instructions: instructions || undefined,
      };
      setAddedMedications([...addedMedications, newMedication]);
      
      setDrugSearchQuery("");
      setSelectedDrug(null);
      setDosage("");
      setFrequency("Once daily");
      setDuration("");
      setInstructions("");
    }
  };

  const handleRemoveMedication = (index: number) => {
    setAddedMedications(addedMedications.filter((_, i) => i !== index));
  };

  const handleCreatePrescription = async () => {
    if (!selectedPatient || addedMedications.length === 0) {
      setError("Please select a patient and add at least one medication");
      return;
    }

    setCreatingPrescription(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      
      const prescriptionData: CreatePrescriptionDTO = {
        patientId: selectedPatient.id,
        prescriptionDate: new Date().toISOString().split("T")[0],
        diagnosis: diagnosis || undefined,
        specialInstructions: specialInstructions || undefined,
        medications: addedMedications,
      };

      const response = await fetch(API_ENDPOINTS.PRESCRIPTIONS, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(prescriptionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create prescription");
      }

      await fetchPrescriptions();
      resetCreateModal();
      
      alert("Prescription created successfully!");
    } catch (err: any) {
      console.error("Error creating prescription:", err);
      setError(err.message || "Failed to create prescription");
    } finally {
      setCreatingPrescription(false);
    }
  };

  const resetCreateModal = () => {
    setShowCreateModal(false);
    setPatientSearchQuery("");
    setSelectedPatient(null);
    setDrugSearchQuery("");
    setSelectedDrug(null);
    setDosage("");
    setFrequency("Once daily");
    setDuration("");
    setDiagnosis("");
    setSpecialInstructions("");
    setInstructions("");
    setAddedMedications([]);
    setError(null);
    setPatients([]);
    setShowPatientDropdown(false);
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
            {prescriptions.filter(p => p.status === "ACTIVE").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Pending</p>
            <Clock size={20} className="text-yellow-600" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">
            {prescriptions.filter(p => p.status === "PENDING").length}
          </p>
        </div>
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-600">Total Patients</p>
            <User size={20} className="text-[#166534]" strokeWidth={2} />
          </div>
          <p className="text-3xl font-semibold text-gray-900">{patients.length}</p>
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
                              <span className="text-gray-900">
                                {med.medication}
                              </span>
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
                              <p className="text-sm text-gray-900">
                                {med.dosage}
                              </p>
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
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-semibold text-gray-900">
                Create New Prescription
              </h3>
              <button
                onClick={resetCreateModal}
                className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6">
              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                  <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              )}

              <div className="space-y-6">
                {/* Patient Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Patient *
                  </label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={patientSearchQuery}
                        onChange={(e) => {
                          setPatientSearchQuery(e.target.value);
                          if (!e.target.value) {
                            setSelectedPatient(null);
                            setPatients([]);
                            setShowPatientDropdown(false);
                          }
                        }}
                        onKeyPress={handlePatientSearchKeyPress}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                        placeholder="Type patient name, email or phone..."
                      />
                      {patientsLoading && (
                        <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                      )}
                    </div>
                    <button
                      onClick={handlePatientSearch}
                      disabled={patientsLoading || !patientSearchQuery.trim()}
                      className="px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <Search size={18} strokeWidth={2} />
                      <span>Search</span>
                    </button>
                  </div>
                  
                  {showPatientDropdown && patients.length > 0 && !patientsLoading && (
                    <div className="mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {patients.map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => handlePatientSelect(patient)}
                          className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">{patient.name}</p>
                              <p className="text-sm text-gray-500">
                                Age {patient.age} • {patient.phone}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {patient.email}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {showPatientDropdown && patients.length === 0 && !patientsLoading && patientSearchQuery && (
                    <div className="mt-2 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center text-sm text-gray-500">
                      No patients found. Try a different search term.
                    </div>
                  )}
                  
                  {selectedPatient && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm font-medium text-green-900">
                        Selected: {selectedPatient.name}
                      </p>
                      {selectedPatient.allergies && (
                        <p className="text-xs text-red-600 mt-1">
                          ⚠️ Allergies: {selectedPatient.allergies}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Diagnosis
                  </label>
                  <input
                    type="text"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter diagnosis (e.g., Hypertension, Type 2 Diabetes)"
                  />
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Add Medications</h4>

                  {/* Drug Search */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Medication *
                    </label>
                    <div className="relative">
                      <Pill
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={drugSearchQuery}
                        onChange={(e) => {
                          setDrugSearchQuery(e.target.value);
                          setShowDrugDropdown(true);
                          if (!e.target.value) {
                            setSelectedDrug(null);
                          }
                        }}
                        onFocus={() => setShowDrugDropdown(true)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                        placeholder="Type to search medications..."
                      />
                      {showDrugDropdown && drugs.filter(
                        (drug) =>
                          drug.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                          drug.genericName.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                          drug.category.toLowerCase().includes(drugSearchQuery.toLowerCase())
                      ).length > 0 && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                          {drugs.filter(
                            (drug) =>
                              drug.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                              drug.genericName.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
                              drug.category.toLowerCase().includes(drugSearchQuery.toLowerCase())
                          ).map((drug) => (
                            <button
                              key={drug.id}
                              onClick={() => handleDrugSelect(drug)}
                              className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center justify-between">
                                <div>
                                  <p className="font-medium text-gray-900">{drug.name}</p>
                                  <p className="text-sm text-gray-500">{drug.genericName}</p>
                                </div>
                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  {drug.category}
                                </span>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dosage and Frequency */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dosage *
                      </label>
                      {selectedDrug && selectedDrug.commonDosages && selectedDrug.commonDosages.length > 0 ? (
                        <select
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900"
                        >
                          {selectedDrug.commonDosages.map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={dosage}
                          onChange={(e) => setDosage(e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                          placeholder="e.g., 10mg, 500mg"
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Frequency *
                      </label>
                      <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900"
                      >
                        <option>Once daily</option>
                        <option>Twice daily</option>
                        <option>Three times daily</option>
                        <option>Four times daily</option>
                        <option>Every 4 hours</option>
                        <option>Every 6 hours</option>
                        <option>Every 8 hours</option>
                        <option>As needed</option>
                        <option>Before meals</option>
                        <option>After meals</option>
                        <option>At bedtime</option>
                      </select>
                    </div>
                  </div>

                  {/* Duration and Instructions */}
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Duration *
                      </label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g., 7 days, 30 days, 3 months"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Instructions (Optional)
                      </label>
                      <input
                        type="text"
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                        placeholder="e.g., Take with food"
                      />
                    </div>
                  </div>

                  {/* Add Medication Button */}
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={handleAddMedication}
                      disabled={!selectedDrug || !dosage || !frequency || !duration}
                      className="w-full px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      <Plus size={18} strokeWidth={2} />
                      <span>Add Medication to Prescription</span>
                    </button>
                  </div>
                </div>

                {/* Added Medications List */}
                {addedMedications.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Pill size={16} className="text-[#166534]" />
                      Added Medications ({addedMedications.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {addedMedications.map((med, index) => {
                        const drug = drugs.find(d => d.id === med.drugId);
                        return (
                          <div
                            key={index}
                            className="bg-white rounded p-3 border border-gray-200 flex items-center justify-between"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {index + 1}. {drug?.name || `Drug ID: ${med.drugId}`}
                              </p>
                              <p className="text-xs text-gray-500">
                                {med.dosage} • {med.frequency} • {med.duration}
                              </p>
                              {med.instructions && (
                                <p className="text-xs text-gray-600 mt-1">
                                  📝 {med.instructions}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => handleRemoveMedication(index)}
                              className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-600 hover:text-red-700"
                              title="Remove medication"
                            >
                              <X size={18} strokeWidth={2} />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions (Optional)
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter any special instructions (e.g., take with food, avoid alcohol, monitor blood pressure)"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
              <button
                onClick={resetCreateModal}
                disabled={creatingPrescription}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePrescription}
                disabled={!selectedPatient || addedMedications.length === 0 || creatingPrescription}
                className="flex-1 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {creatingPrescription ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Creating...</span>
                  </>
                ) : (
                  <>
                    <FileText size={18} />
                    <span>Create Prescription</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}