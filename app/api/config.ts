export const API_BASE_URL = "http://147.93.114.66:9090";
//export const API_BASE_URL = "http://localhost:9090";
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  EDITPROFILE: `${API_BASE_URL}/doctor/update`,
  DOCTOR_DATA: (userId: number | string) => `${API_BASE_URL}/doctor/getdata/${userId}`,
  DOCTOR_PATIENTS: (doctorId: number | string, page: number = 0, size: number = 10, sort: string = 'firstName,asc') => 
    `${API_BASE_URL}/api/patients/doctor/${doctorId}?page=${page}&size=${size}&sort=${sort}`,
  ADD_PATIENT: `${API_BASE_URL}/api/patients`,
}