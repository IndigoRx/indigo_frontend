"use client";

import { createPortal } from "react-dom";
import { CheckCircle2, Share2, ExternalLink, X } from "lucide-react";
import { openPrescriptionPDF, sharePrescriptionPDF } from "./prescriptionPdf";

interface PrescriptionSuccessModalProps {
  prescriptionId: number;
  patientName: string;
  onClose: () => void;
}

export default function PrescriptionSuccessModal({
  prescriptionId,
  patientName,
  onClose,
}: PrescriptionSuccessModalProps) {
  return createPortal(
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[10001] p-4">
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle2 size={28} className="text-[#166534]" />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Prescription Created
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          Prescription for {patientName} is ready.
        </p>

        <div className="flex gap-3">
          <button
            onClick={() => sharePrescriptionPDF(prescriptionId, patientName)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
          <button
            onClick={() => openPrescriptionPDF(prescriptionId, patientName)}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors"
          >
            <ExternalLink size={16} />
            Open
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
