export const API_BASE_URL = "https://api.indigorx.me";
//export const API_BASE_URL = "http://localhost:9090";

export const API_ENDPOINTS = {
  BASE_URL: API_BASE_URL,
  
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  VALIDATE_TOKEN: `${API_BASE_URL}/auth/validate-token`,
  DOCTOR_REGISTER: `${API_BASE_URL}/auth/doctor/register`,
  PATIENT_REGISTER: `${API_BASE_URL}/auth/patient/register`,
  
  // Doctor profile endpoints
  DOCTOR_PROFILE_GET: `${API_BASE_URL}/api/doctors/profile`,
  DOCTOR_PROFILE_UPDATE: `${API_BASE_URL}/api/doctors/profile`,
  DOCTOR_PROFILE_COMPLETE: `${API_BASE_URL}/api/doctors/profile/complete`,
  
  // Patient endpoints
  SEARCH_PATIENTS: (firstName: string) =>
    `${API_BASE_URL}/api/patients/search?firstName=${encodeURIComponent(firstName)}`,
  GET_PATIENTS: `${API_BASE_URL}/api/patients`,
  PATIENTS: `${API_BASE_URL}/api/patients`,
  ADD_PATIENT: `${API_BASE_URL}/api/patients`,
  PATIENT_BY_ID: (id: number) => `${API_BASE_URL}/api/patients/${id}`,
  
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
    
  // Drug endpoints
  DRUGS: `${API_BASE_URL}/api/drugs`,
  DRUG_BY_ID: (id: number) => `${API_BASE_URL}/api/drugs/${id}`,
  DRUGS_SEARCH: `${API_BASE_URL}/api/drugs/search`,
  DRUGS_BY_CATEGORY: (category: string) => 
    `${API_BASE_URL}/api/drugs/category/${encodeURIComponent(category)}`,
};