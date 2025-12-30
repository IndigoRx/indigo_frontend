"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Plus,
  X,
  Pill,
  FileText,
  Loader2,
  AlertCircle,
  UserPlus,
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";
import AddPatientModal from "./AddPatientModal";

// Types
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

interface Drug {
  id: number;
  name: string;
  genericName: string;
  category: string;
  commonDosages: string[];
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

interface CreatePrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  preselectedPatient?: Patient | null;
}

const mockDrugs: Drug[] = [
  { id: 1, name: "Lisinopril", genericName: "Lisinopril", category: "ACE Inhibitor", commonDosages: ["5mg", "10mg", "20mg", "40mg"] },
  { id: 2, name: "Metformin", genericName: "Metformin HCL", category: "Antidiabetic", commonDosages: ["500mg", "850mg", "1000mg"] },
  { id: 3, name: "Atorvastatin", genericName: "Atorvastatin Calcium", category: "Statin", commonDosages: ["10mg", "20mg", "40mg", "80mg"] },
  { id: 4, name: "Amlodipine", genericName: "Amlodipine Besylate", category: "Calcium Channel Blocker", commonDosages: ["2.5mg", "5mg", "10mg"] },
  { id: 5, name: "Omeprazole", genericName: "Omeprazole", category: "Proton Pump Inhibitor", commonDosages: ["10mg", "20mg", "40mg"] },
];

export default function CreatePrescriptionModal({
  isOpen,
  onClose,
  onSuccess,
  preselectedPatient,
}: CreatePrescriptionModalProps) {
  // Form state
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
  const [drugs, setDrugs] = useState<Drug[]>([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [creatingPrescription, setCreatingPrescription] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Quick Add Patient Modal state
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  // Initialize with preselected patient
  useEffect(() => {
    if (isOpen && preselectedPatient) {
      setSelectedPatient(preselectedPatient);
      setPatientSearchQuery(preselectedPatient.name);
    }
  }, [isOpen, preselectedPatient]);

  // Fetch drugs on mount
  useEffect(() => {
    if (isOpen) {
      fetchDrugs();
    }
  }, [isOpen]);

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
      setHasSearched(true);
    } catch (err: any) {
      console.error("Error fetching patients:", err);
      setError(err.message || "Failed to load patients");
      setPatients([]);
      setHasSearched(true);
    } finally {
      setPatientsLoading(false);
    }
  };

  const handlePatientSearch = () => {
    fetchPatients(0, patientSearchQuery);
    setShowPatientDropdown(true);
  };

  const handlePatientSearchKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePatientSearch();
    }
  };

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setPatientSearchQuery(patient.name);
    setShowPatientDropdown(false);
    setHasSearched(false);
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

      // Reset medication fields
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

      // Reset and close
      resetModal();
      onSuccess?.();
    } catch (err: any) {
      console.error("Error creating prescription:", err);
      setError(err.message || "Failed to create prescription");
    } finally {
      setCreatingPrescription(false);
    }
  };

  const handleAddPatientSuccess = () => {
    setShowAddPatientModal(false);
    // Re-run the search to include the newly added patient
    if (patientSearchQuery.trim()) {
      fetchPatients(0, patientSearchQuery);
    }
  };

  const resetModal = () => {
    setPatientSearchQuery("");
    setSelectedPatient(preselectedPatient || null);
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
    setShowDrugDropdown(false);
    setHasSearched(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-xl font-semibold text-gray-900">
              Create New Prescription
            </h3>
            <button
              onClick={resetModal}
              className="p-1 hover:bg-gray-100 rounded transition-colors text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
                <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="space-y-6">
              {/* Patient Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-900">Patient Information</h4>
                  {!preselectedPatient && !selectedPatient && (
                    <span className="text-xs text-gray-500">Search existing or add new patient</span>
                  )}
                </div>

                {/* Patient Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Existing Patient
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
                            setSelectedPatient(preselectedPatient || null);
                            setPatients([]);
                            setShowPatientDropdown(false);
                            setHasSearched(false);
                          }
                        }}
                        onKeyPress={handlePatientSearchKeyPress}
                        disabled={!!preselectedPatient}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400 disabled:bg-gray-100 disabled:cursor-not-allowed bg-white"
                        placeholder="Type patient name, email or phone..."
                      />
                      {patientsLoading && (
                        <Loader2 size={18} className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400" />
                      )}
                    </div>
                    {!preselectedPatient && (
                      <button
                        onClick={handlePatientSearch}
                        disabled={patientsLoading || !patientSearchQuery.trim()}
                        className="px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <Search size={18} strokeWidth={2} />
                        <span>Search</span>
                      </button>
                    )}
                  </div>

                  {/* Patient Dropdown */}
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

                  {/* No Results - Show Quick Add Option */}
                  {showPatientDropdown && patients.length === 0 && !patientsLoading && hasSearched && patientSearchQuery && (
                    <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                      <div className="text-center">
                        <p className="text-sm text-gray-500 mb-3">
                          No patients found for "{patientSearchQuery}"
                        </p>
                        <button
                          onClick={() => setShowAddPatientModal(true)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors"
                        >
                          <UserPlus size={18} strokeWidth={2} />
                          <span>Add New Patient</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Selected Patient */}
                  {selectedPatient && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-green-900">
                            Selected: {selectedPatient.name}
                          </p>
                          <p className="text-xs text-green-700 mt-0.5">
                            Age {selectedPatient.age} • {selectedPatient.phone}
                          </p>
                          {selectedPatient.allergies && (
                            <p className="text-xs text-red-600 mt-1">
                              ⚠️ Allergies: {selectedPatient.allergies}
                            </p>
                          )}
                        </div>
                        {!preselectedPatient && (
                          <button
                            onClick={() => {
                              setSelectedPatient(null);
                              setPatientSearchQuery("");
                              setPatients([]);
                              setHasSearched(false);
                            }}
                            className="p-1 hover:bg-green-100 rounded transition-colors text-green-700"
                          >
                            <X size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Quick Add Patient Divider */}
                {!preselectedPatient && !selectedPatient && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <span className="text-xs text-gray-500 font-medium">OR</span>
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <button
                      onClick={() => setShowAddPatientModal(true)}
                      className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-dashed border-gray-300 text-gray-600 rounded-lg font-medium hover:border-[#166534] hover:text-[#166534] hover:bg-green-50 transition-colors"
                    >
                      <UserPlus size={18} strokeWidth={2} />
                      <span>Add New Patient</span>
                    </button>
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

              {/* Medications Section */}
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

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex gap-3 sticky bottom-0 bg-white">
            <button
              onClick={resetModal}
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

      {/* Add Patient Modal */}
      <AddPatientModal
        isOpen={showAddPatientModal}
        onClose={() => setShowAddPatientModal(false)}
        onSuccess={handleAddPatientSuccess}
      />
    </>
  );
}

// Export types for use in other components
export type { Patient, Drug, PrescriptionMedicationDTO, CreatePrescriptionDTO };