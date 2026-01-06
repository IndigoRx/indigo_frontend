import { API_ENDPOINTS } from "@/app/api/config";

// Backend DTO structure (matches Spring Boot DoctorProfileDTO)
interface DoctorProfileDTO {
  name: string;
  licenseNumber: string;
  specialization: string;
  phone: string;
  address?: string;
  qualifications?: string;
  hospitalName?: string;
}

// Frontend form data structure
export interface DoctorFormData {
  id: number;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  hospitalName: string;
  contactNumber: string;
  email: string;
  stripeUsername: string;
  address?: string;
  qualifications?: string;
}

// Backend response structure
interface DoctorResponse {
  id: number;
  name: string;
  email: string;
  username?: string;
  licenseNumber: string;
  specialization: string;
  phone: string;
  address: string;
  qualifications: string;
  hospitalName: string;
  isValidated: boolean;
  status: string;
  profileComplete: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
  doctor?: DoctorResponse;
}

interface ProfileResponse {
  success: boolean;
  doctor?: DoctorFormData;
  message?: string;
  isValidated?: boolean;
  status?: string;
  profileComplete?: boolean;
}

// Transform frontend data to backend DTO
const transformToDTO = (formData: DoctorFormData): DoctorProfileDTO => {
  return {
    name: `${formData.firstName} ${formData.lastName}`.trim(),
    licenseNumber: formData.licenseNumber,
    specialization: formData.specialization,
    phone: formData.contactNumber,
    address: formData.address || "",
    qualifications: formData.qualifications || "",
    hospitalName: formData.hospitalName,
  };
};

// Transform backend response to frontend format
const transformFromResponse = (doctor: DoctorResponse): DoctorFormData => {
  const nameParts = (doctor.name || "").split(" ");
  
  return {
    id: doctor.id,
    firstName: nameParts[0] || "",
    lastName: nameParts.slice(1).join(" ") || "",
    specialization: doctor.specialization || "",
    licenseNumber: doctor.licenseNumber || "",
    hospitalName: doctor.hospitalName || "",
    contactNumber: doctor.phone || "",
    email: doctor.email || "",
    stripeUsername: "",
    address: doctor.address || "",
    qualifications: doctor.qualifications || "",
  };
};

// Get auth token from localStorage
const getAuthToken = (): string => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token") || "";
  }
  return "";
};

// Get doctor profile
export const getDoctorProfile = async (
  token?: string
): Promise<ProfileResponse> => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: "No authentication token found",
      };
    }

    const response = await fetch(API_ENDPOINTS.DOCTOR_PROFILE_GET, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to fetch profile",
      };
    }

    const doctor = data.doctor;

    return {
      success: true,
      doctor: transformFromResponse(doctor),
      isValidated: doctor.isValidated,
      status: doctor.status,
      profileComplete: doctor.profileComplete,
    };
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};

// Update doctor profile (partial update)
export const updateDoctorProfile = async (
  formData: DoctorFormData,
  token?: string
): Promise<ApiResponse> => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: "No authentication token found",
      };
    }

    const dto = transformToDTO(formData);

    const response = await fetch(API_ENDPOINTS.DOCTOR_PROFILE_UPDATE, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to update profile",
      };
    }

    return {
      success: true,
      message: data.message || "Profile updated successfully",
      doctor: data.doctor,
    };
  } catch (error) {
    console.error("Error updating doctor profile:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};

// Complete doctor profile (for new registrations - all required fields)
export const completeDoctorProfile = async (
  formData: DoctorFormData,
  token?: string
): Promise<ApiResponse> => {
  try {
    const authToken = token || getAuthToken();
    
    if (!authToken) {
      return {
        success: false,
        message: "No authentication token found",
      };
    }

    const dto = transformToDTO(formData);

    // Validate required fields before sending
    if (!dto.name || dto.name.trim() === "") {
      return {
        success: false,
        message: "Name is required",
      };
    }

    if (!dto.licenseNumber || dto.licenseNumber.trim() === "") {
      return {
        success: false,
        message: "License number is required",
      };
    }

    if (!dto.specialization || dto.specialization.trim() === "") {
      return {
        success: false,
        message: "Specialization is required",
      };
    }

    if (!dto.phone || dto.phone.trim() === "") {
      return {
        success: false,
        message: "Phone number is required",
      };
    }

    const response = await fetch(API_ENDPOINTS.DOCTOR_PROFILE_COMPLETE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(dto),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || "Failed to complete profile",
      };
    }

    return {
      success: true,
      message: data.message || "Profile completed successfully",
      doctor: data.doctor,
    };
  } catch (error) {
    console.error("Error completing doctor profile:", error);
    return {
      success: false,
      message: "Network error. Please try again.",
    };
  }
};

// Check if profile is complete
export const checkProfileComplete = async (
  token?: string
): Promise<{ complete: boolean; message?: string }> => {
  const result = await getDoctorProfile(token);
  
  if (!result.success) {
    return {
      complete: false,
      message: result.message,
    };
  }

  return {
    complete: result.profileComplete || false,
  };
};