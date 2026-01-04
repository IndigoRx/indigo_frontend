export const API_BASE_URL = "https://api.indigorx.me";
//export const API_BASE_URL = "http://localhost:9090";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/doctor/register`,
  VALIDATE_TOKEN: `${API_BASE_URL}/auth/validate-token`,
  DOCTOR_REGISTER: `${API_BASE_URL}/auth/doctor/register`,
  DOCTOR_VERIFY_EMAIL: `${API_BASE_URL}/auth/doctor/verify-email`,
  DOCTOR_RESEND_OTP: `${API_BASE_URL}/auth/doctor/resend-otp`,
  PATIENT_REGISTER: `${API_BASE_URL}/auth/patient/register`,
  
  // Password Reset endpoints
  FORGOT_PASSWORD: `${API_BASE_URL}/auth/forgot-password`,
  RESET_PASSWORD_VALIDATE: `${API_BASE_URL}/auth/reset-password/validate`,
  RESET_PASSWORD: `${API_BASE_URL}/auth/reset-password`,
  
  // Doctor profile endpoints
  DOCTOR_PROFILE_GET: `${API_BASE_URL}/api/doctors/profile`,
  DOCTOR_PROFILE_UPDATE: `${API_BASE_URL}/api/doctors/profile`,
  DOCTOR_PROFILE_COMPLETE: `${API_BASE_URL}/api/doctors/profile/complete`,
  DOCTOR_DASHBOARD: `${API_BASE_URL}/api/doctor/dashboard`,
  DOCTOR_DASHBOARD_STATS: `${API_BASE_URL}/api/doctor/dashboard/stats`,
  
  // Patient endpoints
  SEARCH_PATIENTS: (firstName: string) =>
    `${API_BASE_URL}/api/patients/search?firstName=${encodeURIComponent(firstName)}`,
  GET_PATIENTS: `${API_BASE_URL}/api/patients/doctor`,
  PATIENTS: `${API_BASE_URL}/api/patients`,
  ADD_PATIENT: `${API_BASE_URL}/api/patients`,
  PATIENT_BY_ID: (id: number) => `${API_BASE_URL}/api/patients/${id}`,
  
  // Patient Report endpoints
  PATIENT_REPORT: (patientId: number) => 
    `${API_BASE_URL}/api/patient-reports/${patientId}`,
  PATIENT_REPORT_PDF: (patientId: number) => 
    `${API_BASE_URL}/api/patient-reports/${patientId}/pdf`,
  PATIENT_REPORT_PDF_VIEW: (patientId: number) => 
    `${API_BASE_URL}/api/patient-reports/${patientId}/pdf/view`,
  
  // Prescription endpoints
  PRESCRIPTIONS: `${API_BASE_URL}/api/prescriptions`,
  PRESCRIPTION_BY_ID: (id: number) => `${API_BASE_URL}/api/prescriptions/${id}`,
  PRESCRIPTIONS_BY_PATIENT: (patientId: number) => 
    `${API_BASE_URL}/api/prescriptions/patient/${patientId}`,
  PRESCRIPTIONS_BY_STATUS: (status: string) => 
    `${API_BASE_URL}/api/prescriptions/status/${status}`,
  PRESCRIPTION_STATS: `${API_BASE_URL}/api/prescriptions/stats`,
  ACTIVE_PRESCRIPTIONS: (patientId: number) => 
    `${API_BASE_URL}/api/prescriptions/patient/${patientId}/active`,
  PRESCRIPTION_COUNT: (patientId: number) => 
    `${API_BASE_URL}/api/prescriptions/patient/${patientId}/count`,
  UPDATE_PRESCRIPTION_STATUS: (id: number) => 
    `${API_BASE_URL}/api/prescriptions/${id}/status`,
  DELETE_PRESCRIPTION: (id: number) => `${API_BASE_URL}/api/prescriptions/${id}`,
  PRESCRIPTION_DOWNLOAD: (id: number) => `${API_BASE_URL}/api/prescriptions/${id}/download`,

     SUBSCRIPTION_STATUS: `${API_BASE_URL}/api/subscription/status`,
  SUBSCRIPTION_DETAILS: `${API_BASE_URL}/api/subscription/details`,
  SUBSCRIPTION_CHECK_ACCESS: `${API_BASE_URL}/api/subscription/check-access`,
  SUBSCRIPTION_CHECKOUT: `${API_BASE_URL}/api/subscription/checkout`,
  SUBSCRIPTION_BILLING_PORTAL: `${API_BASE_URL}/api/subscription/billing-portal`,
  SUBSCRIPTION_CANCEL: `${API_BASE_URL}/api/subscription/cancel`,
  SUBSCRIPTION_PRICING: `${API_BASE_URL}/api/subscription/pricing`,
   SUBSCRIPTION: '/api/subscription',
  SUBSCRIPTION_CHECKOUT_SUCCESS: (sessionId: string) => 
    `${API_BASE_URL}/api/subscription/checkout-success?session_id=${sessionId}`,
  // Drug endpoints
  DRUGS: `${API_BASE_URL}/api/drugs`,
  DRUG_BY_ID: (id: number) => `${API_BASE_URL}/api/drugs/${id}`,
  DRUGS_SEARCH: `${API_BASE_URL}/api/drugs/search`,
  DRUGS_BY_CATEGORY: (category: string) => 
    `${API_BASE_URL}/api/drugs/category/${encodeURIComponent(category)}`,
};