import { API_ENDPOINTS } from "@/app/api/config";

// Fetch the signed prescription PDF blob from the backend
export const fetchPrescriptionPdf = async (
  prescriptionId: number,
  patientName: string
) => {
  const token = localStorage.getItem("token");

  const response = await fetch(API_ENDPOINTS.PRESCRIPTION_DOWNLOAD(prescriptionId), {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to download prescription");
  }

  const blob = await response.blob();

  const contentDisposition = response.headers.get("Content-Disposition");
  let filename = `prescription_${prescriptionId}_${patientName.replace(/\s+/g, "_")}.pdf`;

  if (contentDisposition) {
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    if (filenameMatch && filenameMatch[1]) {
      filename = filenameMatch[1];
    }
  }

  return { blob, filename };
};

// Open the signed prescription PDF in a new tab
export const openPrescriptionPDF = async (prescriptionId: number, patientName: string) => {
  const { blob } = await fetchPrescriptionPdf(prescriptionId, patientName);
  const url = window.URL.createObjectURL(blob);
  window.open(url, "_blank");
};

// Share the signed prescription PDF using the Web Share API, falling back to download
export const sharePrescriptionPDF = async (prescriptionId: number, patientName: string) => {
  const { blob, filename } = await fetchPrescriptionPdf(prescriptionId, patientName);
  const file = new File([blob], filename, { type: "application/pdf" });

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: "Prescription",
      text: `Prescription for ${patientName}`,
    });
  } else {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};
