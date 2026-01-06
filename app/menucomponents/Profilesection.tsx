"use client";

import React, { useState, useEffect } from "react";
import { User, Phone, Mail, Building2, IdCard, Award, MapPin, GraduationCap, Loader2, Save } from "lucide-react";
import { updateDoctorProfile, getDoctorProfile } from "@/app/service/Doctorservice";
import toast from "react-hot-toast";

interface DoctorData {
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

interface ProfileSectionProps {
  formData: DoctorData;
  setFormData: React.Dispatch<React.SetStateAction<DoctorData>>;
}

export default function ProfileSection({ formData, setFormData }: ProfileSectionProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch doctor profile on component mount
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      try {
        const result = await getDoctorProfile();
        if (result.success && result.doctor) {
          setFormData(result.doctor);
        } else {
          toast.error(result.message || "Failed to load profile");
        }
      } catch (error) {
        toast.error("Failed to load profile data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [setFormData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const result = await updateDoctorProfile(formData);
      if (result.success) {
        toast.success(result.message || "Profile updated successfully");
      } else {
        toast.error(result.message || "Failed to update profile");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setIsSaving(false);
    }
  };

  const isDisabled = isSaving || isLoading;

  const inputClassName = `w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent transition-all duration-200 text-gray-900 placeholder:text-gray-400 ${
    isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-700" : "bg-white"
  }`;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#166534]" />
          <p className="text-sm text-gray-500">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Information */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                disabled={isDisabled}
                placeholder="Enter first name"
                className={inputClassName}
              />
            </div>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                disabled={isDisabled}
                placeholder="Enter last name"
                className={inputClassName}
              />
            </div>
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="email"
                value={formData.email}
                disabled={true}
                placeholder="Email address"
                className={`${inputClassName} !bg-gray-50 !cursor-not-allowed`}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Email cannot be changed
            </p>
          </div>

          {/* Contact Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <div className="relative">
              <Phone
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="tel"
                value={formData.contactNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    contactNumber: e.target.value,
                  })
                }
                disabled={isDisabled}
                placeholder="Enter contact number"
                className={inputClassName}
              />
            </div>
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <div className="relative">
              <MapPin
                className="absolute left-3 top-3 text-gray-400"
                size={18}
              />
              <textarea
                value={formData.address || ""}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                disabled={isDisabled}
                placeholder="Enter your clinic/hospital address"
                rows={2}
                className={`w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent transition-all duration-200 resize-none text-gray-900 placeholder:text-gray-400 ${
                  isDisabled ? "bg-gray-100 cursor-not-allowed text-gray-700" : "bg-white"
                }`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Professional Details */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Professional Details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Specialization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Specialization
            </label>
            <div className="relative">
              <Award
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={formData.specialization}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    specialization: e.target.value,
                  })
                }
                disabled={isDisabled}
                placeholder="e.g., Cardiology, Pediatrics"
                className={inputClassName}
              />
            </div>
          </div>

          {/* License Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              License Number
            </label>
            <div className="relative">
              <IdCard
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    licenseNumber: e.target.value,
                  })
                }
                disabled={isDisabled}
                placeholder="Enter your medical license number"
                className={inputClassName}
              />
            </div>
          </div>

          {/* Qualifications */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Qualifications
            </label>
            <div className="relative">
              <GraduationCap
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={formData.qualifications || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    qualifications: e.target.value,
                  })
                }
                disabled={isDisabled}
                placeholder="e.g., MBBS, MD, FRCP"
                className={inputClassName}
              />
            </div>
          </div>

          {/* Hospital Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital / Clinic Name
            </label>
            <div className="relative">
              <Building2
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                type="text"
                value={formData.hospitalName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hospitalName: e.target.value,
                  })
                }
                disabled={isDisabled}
                placeholder="Enter hospital or clinic name"
                className={inputClassName}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="border-t border-gray-200 pt-6 flex justify-end">
        <button
          onClick={handleSave}
          disabled={isDisabled}
          className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-all duration-200 ${
            isDisabled
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#166534] text-white hover:bg-[#14532d] active:scale-[0.98] shadow-sm hover:shadow-md"
          }`}
        >
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </div>
  );
}