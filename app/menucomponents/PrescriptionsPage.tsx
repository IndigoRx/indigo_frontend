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
  X,
  ChevronDown,
} from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import QRCode from "qrcode";

interface PrescriptionMedication {
  medication: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: number;
  patientName: string;
  medications: PrescriptionMedication[];
  date: string;
  status: "Active" | "Completed" | "Pending";
  specialInstructions?: string;
}

interface Patient {
  id: number;
  name: string;
  age: number;
  phone: string;
  lastVisit: string;
}

interface PreviousPrescription {
  id: number;
  medication: string;
  dosage: string;
  frequency: string;
  date: string;
  status: string;
}

interface Drug {
  id: number;
  name: string;
  genericName: string;
  category: string;
  commonDosages: string[];
}

import { API_ENDPOINTS } from "@/app/api/config";

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
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [addedMedications, setAddedMedications] = useState<PrescriptionMedication[]>([]);

  // Mock patient data
  const patients: Patient[] = [
    { id: 1, name: "John Smith", age: 45, phone: "(555) 123-4567", lastVisit: "2024-12-10" },
    { id: 2, name: "Sarah Johnson", age: 32, phone: "(555) 234-5678", lastVisit: "2024-12-08" },
    { id: 3, name: "Michael Brown", age: 58, phone: "(555) 345-6789", lastVisit: "2024-11-28" },
    { id: 4, name: "Emily Davis", age: 29, phone: "(555) 456-7890", lastVisit: "2024-12-12" },
    { id: 5, name: "Robert Wilson", age: 51, phone: "(555) 567-8901", lastVisit: "2024-12-05" },
    { id: 6, name: "Jennifer Martinez", age: 38, phone: "(555) 678-9012", lastVisit: "2024-12-03" },
  ];

  // Mock previous prescriptions for patients
  const previousPrescriptions: Record<number, PreviousPrescription[]> = {
    1: [
      { id: 1, medication: "Lisinopril", dosage: "10mg", frequency: "Once daily", date: "2024-12-10", status: "Active" },
      { id: 2, medication: "Atorvastatin", dosage: "20mg", frequency: "Once daily", date: "2024-11-15", status: "Active" },
      { id: 3, medication: "Aspirin", dosage: "81mg", frequency: "Once daily", date: "2024-10-20", status: "Completed" },
    ],
    2: [
      { id: 4, medication: "Metformin", dosage: "500mg", frequency: "Twice daily", date: "2024-12-08", status: "Active" },
      { id: 5, medication: "Levothyroxine", dosage: "50mcg", frequency: "Once daily", date: "2024-11-20", status: "Active" },
    ],
    3: [
      { id: 6, medication: "Albuterol Inhaler", dosage: "90mcg", frequency: "As needed", date: "2024-11-28", status: "Completed" },
      { id: 7, medication: "Prednisone", dosage: "10mg", frequency: "Once daily", date: "2024-11-28", status: "Completed" },
      { id: 8, medication: "Montelukast", dosage: "10mg", frequency: "Once daily", date: "2024-10-15", status: "Active" },
    ],
    4: [
      { id: 9, medication: "Amoxicillin", dosage: "500mg", frequency: "Three times daily", date: "2024-12-12", status: "Pending" },
    ],
    5: [
      { id: 10, medication: "Omeprazole", dosage: "20mg", frequency: "Once daily", date: "2024-12-05", status: "Active" },
      { id: 11, medication: "Ibuprofen", dosage: "400mg", frequency: "As needed", date: "2024-11-10", status: "Completed" },
    ],
    6: [
      { id: 12, medication: "Sertraline", dosage: "50mg", frequency: "Once daily", date: "2024-12-03", status: "Active" },
    ],
  };

  // Mock drug database
  const drugs: Drug[] = [
    { id: 1, name: "Lisinopril", genericName: "Lisinopril", category: "ACE Inhibitor", commonDosages: ["5mg", "10mg", "20mg", "40mg"] },
    { id: 2, name: "Metformin", genericName: "Metformin HCL", category: "Antidiabetic", commonDosages: ["500mg", "850mg", "1000mg"] },
    { id: 3, name: "Atorvastatin", genericName: "Atorvastatin Calcium", category: "Statin", commonDosages: ["10mg", "20mg", "40mg", "80mg"] },
    { id: 4, name: "Amlodipine", genericName: "Amlodipine Besylate", category: "Calcium Channel Blocker", commonDosages: ["2.5mg", "5mg", "10mg"] },
    { id: 5, name: "Omeprazole", genericName: "Omeprazole", category: "Proton Pump Inhibitor", commonDosages: ["10mg", "20mg", "40mg"] },
    { id: 6, name: "Albuterol", genericName: "Albuterol Sulfate", category: "Bronchodilator", commonDosages: ["90mcg", "180mcg"] },
    { id: 7, name: "Levothyroxine", genericName: "Levothyroxine Sodium", category: "Thyroid Hormone", commonDosages: ["25mcg", "50mcg", "75mcg", "100mcg"] },
    { id: 8, name: "Sertraline", genericName: "Sertraline HCL", category: "SSRI Antidepressant", commonDosages: ["25mg", "50mg", "100mg"] },
    { id: 9, name: "Amoxicillin", genericName: "Amoxicillin", category: "Antibiotic", commonDosages: ["250mg", "500mg", "875mg"] },
    { id: 10, name: "Gabapentin", genericName: "Gabapentin", category: "Anticonvulsant", commonDosages: ["100mg", "300mg", "400mg", "600mg"] },
  ];

  // Mock prescription data
  const prescriptions: Prescription[] = [
    {
      id: 1001,
      patientName: "John Smith",
      medications: [
        {
          medication: "Lisinopril",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "30 days",
        }
      ],
      date: "2024-12-10",
      status: "Active",
    },
    {
      id: 1002,
      patientName: "Sarah Johnson",
      medications: [
        {
          medication: "Metformin",
          dosage: "500mg",
          frequency: "Twice daily",
          duration: "90 days",
        }
      ],
      date: "2024-12-08",
      status: "Active",
    },
    {
      id: 1003,
      patientName: "Michael Brown",
      medications: [
        {
          medication: "Albuterol Inhaler",
          dosage: "90mcg",
          frequency: "As needed",
          duration: "30 days",
        },
        {
          medication: "Prednisone",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "7 days",
        }
      ],
      date: "2024-11-28",
      status: "Completed",
    },
    {
      id: 1004,
      patientName: "Emily Davis",
      medications: [
        {
          medication: "Amoxicillin",
          dosage: "500mg",
          frequency: "Three times daily",
          duration: "7 days",
        }
      ],
      date: "2024-12-12",
      status: "Pending",
    },
  ];

  const filteredPrescriptions = prescriptions.filter(
    (prescription) =>
      prescription.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prescription.medications.some(med => 
        med.medication.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const filteredPatients = patients.filter((patient) =>
    patient.name.toLowerCase().includes(patientSearchQuery.toLowerCase())
  );

  const filteredDrugs = drugs.filter(
    (drug) =>
      drug.name.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
      drug.genericName.toLowerCase().includes(drugSearchQuery.toLowerCase()) ||
      drug.category.toLowerCase().includes(drugSearchQuery.toLowerCase())
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
    // Auto-fill first common dosage if available
    if (drug.commonDosages.length > 0) {
      setDosage(drug.commonDosages[0]);
    }
  };

  const handleAddMedication = () => {
    if (selectedDrug && dosage && frequency && duration) {
      const newMedication: PrescriptionMedication = {
        medication: selectedDrug.name,
        dosage,
        frequency,
        duration,
      };
      setAddedMedications([...addedMedications, newMedication]);
      
      // Reset medication fields
      setDrugSearchQuery("");
      setSelectedDrug(null);
      setDosage("");
      setFrequency("Once daily");
      setDuration("");
    }
  };

  const handleRemoveMedication = (index: number) => {
    setAddedMedications(addedMedications.filter((_, i) => i !== index));
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
    setSpecialInstructions("");
    setAddedMedications([]);
  };

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

  // Function to download prescription as PDF
  const downloadPrescriptionPDF = async (prescription: Prescription) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - (margin * 2);

    // Generate QR code for prescription ID
    const qrCodeDataUrl = await QRCode.toDataURL(`RX-${prescription.id}`, {
      width: 200,
      margin: 1,
      color: {
        dark: '#166534',
        light: '#FFFFFF'
      }
    });

    // Function to add a new page with border
    const addNewPage = () => {
      doc.addPage();
      // Add page border
      doc.setDrawColor(22, 101, 52);
      doc.setLineWidth(1);
      doc.rect(10, 10, pageWidth - 20, pageHeight - 20);
    };

    // Function to check if we need a new page
    const checkPageBreak = (currentY: number, requiredSpace: number) => {
      if (currentY + requiredSpace > pageHeight - 30) {
        addNewPage();
        return 30; // Return top margin for new page
      }
      return currentY;
    };

    // Add professional header with green accent
    doc.setFillColor(22, 101, 52); // #166534
    doc.rect(0, 0, pageWidth, 35, "F");

    // Clinic/Doctor Name (white text on green background)
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("IndigoRx Medical Center", pageWidth / 2, 15, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123 Healthcare Avenue, Medical District", pageWidth / 2, 22, { align: "center" });
    doc.text("Phone: (555) 100-2000 | Fax: (555) 100-2001", pageWidth / 2, 28, { align: "center" });

    // Prescription symbol (Rx) in top right
    doc.setFontSize(32);
    doc.setFont("times", "italic");
    doc.text("℞", pageWidth - 25, 25);

    // Reset text color for body
    doc.setTextColor(0, 0, 0);

    // Document title
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("PRESCRIPTION", margin, 50);

    // Prescription ID and Date
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Rx #${prescription.id}`, margin, 56);
    doc.text(`Date Issued: ${new Date(prescription.date).toLocaleDateString("en-US", { 
      year: "numeric", 
      month: "long", 
      day: "numeric" 
    })}`, pageWidth - margin, 56, { align: "right" });

    // Patient Information Section
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("PATIENT INFORMATION", margin, 70);

    // Patient info box
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.5);
    doc.rect(margin, 73, contentWidth, 25);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${prescription.patientName}`, margin + 5, 82);
    
    // Find patient details
    const patient = patients.find(p => p.name === prescription.patientName);
    if (patient) {
      doc.text(`Age: ${patient.age} years`, margin + 5, 89);
      doc.text(`Phone: ${patient.phone}`, margin + 5, 96);
    }

    // Medications Section
    let currentY = 112;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PRESCRIBED MEDICATIONS", margin, currentY);

    currentY += 3;
    
    // Loop through all medications
    prescription.medications.forEach((med, index) => {
      const boxHeight = 40;
      
      // Check if we need a new page for this medication
      currentY = checkPageBreak(currentY, boxHeight + 10);
      
      // Medication box with light green background
      doc.setFillColor(240, 253, 244); // Light green
      doc.setDrawColor(200, 200, 200);
      doc.rect(margin, currentY, contentWidth, boxHeight, "FD");

      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(22, 101, 52);
      doc.text(`${index + 1}. ${med.medication}`, margin + 5, currentY + 10);

      doc.setTextColor(0, 0, 0);
      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");

      // Medication details in a structured format
      const detailsStartY = currentY + 20;
      const lineHeight = 6;

      doc.setFont("helvetica", "bold");
      doc.text("Dosage:", margin + 5, detailsStartY);
      doc.setFont("helvetica", "normal");
      doc.text(med.dosage, margin + 40, detailsStartY);

      doc.setFont("helvetica", "bold");
      doc.text("Frequency:", margin + 5, detailsStartY + lineHeight);
      doc.setFont("helvetica", "normal");
      doc.text(med.frequency, margin + 40, detailsStartY + lineHeight);

      doc.setFont("helvetica", "bold");
      doc.text("Duration:", margin + 5, detailsStartY + lineHeight * 2);
      doc.setFont("helvetica", "normal");
      doc.text(med.duration, margin + 40, detailsStartY + lineHeight * 2);

      currentY += boxHeight + 5;
    });

    // Special Instructions Section (if provided)
    if (prescription.specialInstructions) {
      currentY += 5;
      
      // Check if we need a new page
      currentY = checkPageBreak(currentY, 35);
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("SPECIAL INSTRUCTIONS", margin, currentY);
      currentY += 3;

      doc.setDrawColor(200, 200, 200);
      const instructionsLines = doc.splitTextToSize(prescription.specialInstructions, contentWidth - 10);
      const instructionsHeight = Math.max(20, instructionsLines.length * 5 + 10);
      
      doc.rect(margin, currentY, contentWidth, instructionsHeight);

      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 0, 0);
      doc.text(instructionsLines, margin + 5, currentY + 7);
      currentY += instructionsHeight + 5;
    }

    // General Instructions Section
    currentY += 5;
    
    // Check if we need a new page
    currentY = checkPageBreak(currentY, 35);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("GENERAL INSTRUCTIONS", margin, currentY);
    currentY += 3;

    doc.setDrawColor(200, 200, 200);
    doc.rect(margin, currentY, contentWidth, 25);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const instructions = [
      "• Take medication exactly as prescribed",
      "• Do not skip doses or stop medication without consulting your doctor",
      "• Store medication as per package instructions",
      "• Contact your doctor if you experience any adverse effects"
    ];

    instructions.forEach((instruction, index) => {
      doc.text(instruction, margin + 5, currentY + 7 + (index * 5));
    });

    currentY += 30;

    // Check if we need a new page for signature section
    currentY = checkPageBreak(currentY, 60);

    // Status badge
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    
    let statusColor;
    switch (prescription.status) {
      case "Active":
        statusColor = [22, 101, 52]; // Green
        break;
      case "Pending":
        statusColor = [234, 179, 8]; // Yellow
        break;
      case "Completed":
        statusColor = [100, 100, 100]; // Gray
        break;
      default:
        statusColor = [100, 100, 100];
    }
    
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.setTextColor(255, 255, 255);
    doc.roundedRect(margin, currentY, 30, 8, 2, 2, "F");
    doc.text(prescription.status.toUpperCase(), margin + 15, currentY + 5, { align: "center" });

    currentY += 15;

    // Doctor's signature section
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text("PRESCRIBING PHYSICIAN", margin, currentY);

    doc.setDrawColor(200, 200, 200);
    doc.line(margin, currentY + 20, margin + 80, currentY + 20);
    
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.text("Dr. [Your Name Here]", margin, currentY + 25);
    doc.text("Medical License #: [License Number]", margin, currentY + 30);
    doc.text("Signature", margin, currentY + 35);

    // Add QR Code (positioned on the right side of signature section)
    const qrSize = 35;
    const qrX = pageWidth - qrSize - margin;
    const qrY = currentY;
    
    doc.addImage(qrCodeDataUrl, 'PNG', qrX, qrY, qrSize, qrSize);
    
    // QR Code label
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Scan to verify", qrX + (qrSize / 2), qrY + qrSize + 5, { align: "center" });
    doc.text(`RX-${prescription.id}`, qrX + (qrSize / 2), qrY + qrSize + 10, { align: "center" });

    // Footer with disclaimer (on each page)
    const addFooter = (pageNum: number) => {
      doc.setPage(pageNum);
      doc.setFontSize(7);
      doc.setTextColor(100, 100, 100);
      doc.setFont("helvetica", "italic");
      const disclaimer = "This prescription is valid for 30 days from the date of issue. This is a computer-generated prescription.";
      doc.text(disclaimer, pageWidth / 2, pageHeight - 15, { align: "center", maxWidth: contentWidth });
    };

    // Add footer to all pages
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      addFooter(i);
    }

    // Add page border to first page
    doc.setPage(1);
    doc.setDrawColor(22, 101, 52);
    doc.setLineWidth(1);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Save the PDF
    doc.save(`Prescription_${prescription.id}_${prescription.patientName.replace(/\s+/g, "_")}.pdf`);
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
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
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
                    <div className="flex flex-col gap-1">
                      {prescription.medications.map((med, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <Pill size={16} className="text-gray-400" />
                          <span className="text-gray-900">
                            {med.medication}
                          </span>
                        </div>
                      ))}
                      {prescription.medications.length > 1 && (
                        <span className="text-xs text-gray-500 mt-1">
                          +{prescription.medications.length - 1} more medication{prescription.medications.length > 2 ? 's' : ''}
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
                      {prescription.medications.length > 1 && (
                        <p className="text-xs text-gray-400 italic">
                          See details for all medications
                        </p>
                      )}
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
                      <button 
                        onClick={() => downloadPrescriptionPDF(prescription)}
                        className="p-1.5 hover:bg-gray-100 rounded transition-colors text-gray-600 hover:text-[#166534]"
                        title="Download Prescription PDF"
                      >
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
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
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
              <div className="space-y-6">
                {/* Patient Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Patient
                  </label>
                  <div className="relative">
                    <Search
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <input
                      type="text"
                      value={patientSearchQuery}
                      onChange={(e) => {
                        setPatientSearchQuery(e.target.value);
                        setShowPatientDropdown(true);
                        if (!e.target.value) {
                          setSelectedPatient(null);
                        }
                      }}
                      onFocus={() => setShowPatientDropdown(true)}
                      className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                      placeholder="Type to search patients..."
                    />
                    {showPatientDropdown && filteredPatients.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredPatients.map((patient) => (
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
                              </div>
                              <p className="text-xs text-gray-400">
                                Last visit: {new Date(patient.lastVisit).toLocaleDateString()}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Previous Prescriptions Section */}
                {selectedPatient && previousPrescriptions[selectedPatient.id] && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <FileText size={16} className="text-[#166534]" />
                      Previous Prescriptions for {selectedPatient.name}
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {previousPrescriptions[selectedPatient.id].map((prev) => (
                        <div
                          key={prev.id}
                          className="bg-white rounded p-3 border border-gray-200"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-gray-900 text-sm">
                                {prev.medication}
                              </p>
                              <p className="text-xs text-gray-500">
                                {prev.dosage} • {prev.frequency}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-gray-500">
                                {new Date(prev.date).toLocaleDateString()}
                              </p>
                              <span
                                className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${getStatusColor(
                                  prev.status
                                )}`}
                              >
                                {prev.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Drug Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search Medication
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
                    {showDrugDropdown && filteredDrugs.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                        {filteredDrugs.map((drug) => (
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Dosage
                    </label>
                    {selectedDrug && selectedDrug.commonDosages.length > 0 ? (
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
                        placeholder="e.g., 10mg"
                      />
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Frequency
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

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent text-gray-900 placeholder:text-gray-400"
                    placeholder="e.g., 30 days, 2 weeks, 3 months"
                  />
                </div>

                {/* Add Medication Button */}
                <div>
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

                {/* Added Medications List */}
                {addedMedications.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Pill size={16} className="text-[#166534]" />
                      Added Medications ({addedMedications.length})
                    </h4>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {addedMedications.map((med, index) => (
                        <div
                          key={index}
                          className="bg-white rounded p-3 border border-gray-200 flex items-center justify-between"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">
                              {index + 1}. {med.medication}
                            </p>
                            <p className="text-xs text-gray-500">
                              {med.dosage} • {med.frequency} • {med.duration}
                            </p>
                          </div>
                          <button
                            onClick={() => handleRemoveMedication(index)}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors text-red-600 hover:text-red-700"
                            title="Remove medication"
                          >
                            <X size={18} strokeWidth={2} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Instructions */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions
                  </label>
                  <textarea
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent resize-none text-gray-900 placeholder:text-gray-400"
                    placeholder="Enter any special instructions for the patient (e.g., take with food, avoid alcohol)"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={resetCreateModal}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                disabled={!selectedPatient || addedMedications.length === 0}
                className="flex-1 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Create Prescription
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}