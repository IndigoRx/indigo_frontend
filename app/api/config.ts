export const API_BASE_URL = "http://147.93.114.66:9090";
//export const API_BASE_URL = "http://localhost:9090";
export const API_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  DOCTOR_DATA: (userId: number | string) => `${API_BASE_URL}/doctor/getdata/${userId}`,
}