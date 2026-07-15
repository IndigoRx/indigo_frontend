"use client";

import { useState } from "react";
import CreatePrescriptionModal, {
  type Patient,
} from "@/app/menucomponents/CreatePrescriptionModal";
import PrescriptionSuccessModal from "@/app/menucomponents/PrescriptionSuccessModal";

interface CreatePrescriptionFlowProps {
  isOpen: boolean;
  onClose: () => void;
  /** Called after a prescription is successfully created (e.g. to refresh lists). */
  onCreated?: () => void;
  preselectedPatient?: Patient | null;
}

/**
 * End-to-end "create a prescription" flow: the create modal followed by the
 * share/open success modal. Shared by every entry point (the Prescriptions
 * page, the dashboard floating button, etc.) so the behaviour stays identical.
 */
export default function CreatePrescriptionFlow({
  isOpen,
  onClose,
  onCreated,
  preselectedPatient,
}: CreatePrescriptionFlowProps) {
  const [createdPrescription, setCreatedPrescription] = useState<{
    id: number;
    patientName: string;
  } | null>(null);

  return (
    <>
      <CreatePrescriptionModal
        isOpen={isOpen}
        onClose={onClose}
        preselectedPatient={preselectedPatient}
        onSuccess={(prescriptionId, patientName) => {
          onClose();
          onCreated?.();
          setCreatedPrescription({ id: prescriptionId, patientName });
        }}
      />

      {createdPrescription && (
        <PrescriptionSuccessModal
          prescriptionId={createdPrescription.id}
          patientName={createdPrescription.patientName}
          onClose={() => setCreatedPrescription(null)}
        />
      )}
    </>
  );
}
