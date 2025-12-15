"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Mail,
    Phone,
    Building2,
    GraduationCap,
    FileText,
    MapPin,
    Globe,
    Save,
    ArrowLeft,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

interface DoctorProfile {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    specialization: string;
    licenseNumber: string;
    hospitalName: string;
    contactNumber: string;
    yearsOfExperience: string;
    qualification: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    website: string;
    bio: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [mounted, setMounted] = useState(false);

    const [profile, setProfile] = useState<DoctorProfile>({
        firstName: "",
        lastName: "",
        email: "",
        specialization: "",
        licenseNumber: "",
        hospitalName: "",
        contactNumber: "",
        yearsOfExperience: "",
        qualification: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
        website: "",
        bio: ""
    });

    useEffect(() => {
        setMounted(true);
        fetchDoctorProfile();
    }, []);

    const fetchDoctorProfile = async () => {
        try {
            setFetchingData(true);
            setError("");

            // Get data from localStorage
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId");
            const email = localStorage.getItem("username");

            if (!token || !userId) {
                setError("Authentication required. Please log in again.");
                router.push("/login");
                return;
            }

            // Fetch doctor data
            const response = await fetch(API_ENDPOINTS.DOCTOR_DATA(userId), {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    setError("Session expired. Please log in again.");
                    localStorage.clear();
                    router.push("/login");
                    return;
                }
                throw new Error("Failed to fetch profile data");
            }

            const data = await response.json();

            // Update profile with fetched data and email from localStorage
            setProfile({
                ...data,
                email: email || data.email || "",
            });

        } catch (err) {
            console.error("Error fetching profile:", err);
            setError("Failed to load profile data. Please try again.");
        } finally {
            setFetchingData(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

        if (!token || !userId) {
            setError("Authentication required. Please log in again.");
            router.push("/login");
            return;
        }

        // Prepare data for update - ONLY fields the API accepts
        const updateData = {
            id: profile.id || parseInt(userId),
            firstName: profile.firstName,
            lastName: profile.lastName,
            specialization: profile.specialization,
            licenseNumber: profile.licenseNumber,
            hospitalName: profile.hospitalName,
            contactNumber: profile.contactNumber,
        };

        const response = await fetch(API_ENDPOINTS.EDITPROFILE, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updateData),
        });

        if (!response.ok) {
            if (response.status === 401) {
                setError("Session expired. Please log in again.");
                localStorage.clear();
                router.push("/login");
                return;
            }
            
            throw new Error("Failed to update profile");
        }

        // Success - redirect to dashboard
        router.push("/dashboard");

    } catch (err: any) {
        console.error("Error updating profile:", err);
        setError(err.message || "Failed to update profile. Please try again.");
    } finally {
        setLoading(false);
    }
};

    // Show loading state while fetching data
    if (fetchingData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
                <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-green-600 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600 font-akatab">Loading profile data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-40 right-10 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto">
                    {/* Header */}
                    <div className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <button
                            onClick={() => router.push("/dashboard")}
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-green-700 mb-6 transition-colors group"
                        >
                            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                            <span>Back to Dashboard</span>
                        </button>

                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="10" fill="#429C36" />
                                    <path d="M14 24L21 31L34 17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 font-akatab">Doctor Profile</h1>
                                <p className="text-gray-600 font-akatab mt-1">Complete your professional information</p>
                            </div>
                        </div>
                    </div>

                    {/* Main Form Card */}
                    <div className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-700 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        {/* Progress indicator */}
                        <div className="h-2 bg-gray-100">
                            <div
                                className="h-full bg-gradient-to-r from-[#278B51] to-[#32A05F] transition-all duration-500"
                                style={{
                                    width: `${Object.values(profile).filter(val => val !== "").length / Object.keys(profile).length * 100}%`
                                }}
                            ></div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 sm:p-10">
                            {/* Verification Warning Banner */}
                            <div className="mb-8 bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-500 p-5 rounded-lg">
                                <div className="flex items-start gap-3">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 17L12 22L22 17" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            <path d="M2 12L12 17L22 12" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold text-amber-900 mb-2 font-akatab">
                                            ⚠️ Verification Required - Licensed Medical Professionals Only
                                        </h3>
                                        <p className="text-sm text-amber-800 leading-relaxed mb-3">
                                            IndigoRx is exclusively for licensed medical doctors and healthcare professionals. All credentials will be verified through:
                                        </p>
                                        <ul className="text-sm text-amber-800 space-y-1.5 ml-4">
                                            <li className="flex items-start gap-2">
                                                <span className="text-amber-600 mt-0.5">•</span>
                                                <span><strong>Medical License Verification:</strong> Your license number will be validated against official medical board databases</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-amber-600 mt-0.5">•</span>
                                                <span><strong>Background Checks:</strong> Comprehensive verification of your professional credentials and qualifications</span>
                                            </li>
                                            <li className="flex items-start gap-2">
                                                <span className="text-amber-600 mt-0.5">•</span>
                                                <span><strong>Hospital/Practice Verification:</strong> Confirmation of your current practice location and affiliation</span>
                                            </li>
                                        </ul>
                                        <p className="text-xs text-amber-700 mt-3 italic">
                                            Note: Providing false information or impersonating a medical professional is a serious offense and may result in legal action.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Success/Error Messages */}
                            {success && (
                                <div className="mb-6 text-sm text-green-700 bg-green-50 p-4 rounded-lg border border-green-200 animate-fade-in flex items-center gap-3">
                                    <CheckCircle2 size={20} className="flex-shrink-0" />
                                    <span>{success}</span>
                                </div>
                            )}

                            {error && (
                                <div className="mb-6 text-sm text-red-600 bg-red-50 p-4 rounded-lg border border-red-200 animate-shake flex items-center gap-3">
                                    <AlertCircle size={20} className="flex-shrink-0" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {/* Personal Information Section */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-akatab flex items-center gap-2">
                                    <User size={24} className="text-green-600" />
                                    Personal Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            First Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={profile.firstName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="Enter first name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Last Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={profile.lastName}
                                                onChange={handleChange}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="Enter last name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail size={18} className="text-gray-400" />
                                            </div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={profile.email}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 bg-gray-50 cursor-not-allowed text-gray-700"
                                                placeholder="your.email@example.com"
                                                disabled
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                type="tel"
                                                name="contactNumber"
                                                value={profile.contactNumber}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="+1 (123) 456-7890"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Professional Information Section */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-akatab flex items-center gap-2">
                                    <GraduationCap size={24} className="text-green-600" />
                                    Professional Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Specialization <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="specialization"
                                            value={profile.specialization}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                            required
                                        >
                                            <option value="">Select specialization</option>
                                            <option value="Cardiology">Cardiology</option>
                                            <option value="Dermatology">Dermatology</option>
                                            <option value="Endocrinology">Endocrinology</option>
                                            <option value="Gastroenterology">Gastroenterology</option>
                                            <option value="General Practice">General Practice</option>
                                            <option value="Neurology">Neurology</option>
                                            <option value="Oncology">Oncology</option>
                                            <option value="Orthopedics">Orthopedics</option>
                                            <option value="Pediatrics">Pediatrics</option>
                                            <option value="Psychiatry">Psychiatry</option>
                                            <option value="Radiology">Radiology</option>
                                            <option value="Surgery">Surgery</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Medical License Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <FileText size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="licenseNumber"
                                                value={profile.licenseNumber}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="LIC12345"
                                                required
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-amber-600 flex items-start gap-1.5">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mt-0.5">
                                                <circle cx="7" cy="7" r="6" stroke="#D97706" strokeWidth="1.5" fill="none" />
                                                <path d="M7 4V7.5M7 10H7.005" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" />
                                            </svg>
                                            <span>This will be verified against official medical licensing databases</span>
                                        </p>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Qualification <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="qualification"
                                            value={profile.qualification}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                            placeholder="MBBS, MD, etc."
                                            required
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Years of Experience <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="number"
                                            name="yearsOfExperience"
                                            value={profile.yearsOfExperience}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                            placeholder="5"
                                            min="0"
                                            required
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Hospital/Practice Information Section */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-akatab flex items-center gap-2">
                                    <Building2 size={24} className="text-green-600" />
                                    Hospital & Practice Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="group md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Hospital/Clinic Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Building2 size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="hospitalName"
                                                value={profile.hospitalName}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="City Hospital"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="group md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Address <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                                                <MapPin size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="address"
                                                value={profile.address}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="123 Medical Street"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            City <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={profile.city}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                            placeholder="New York"
                                            required
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            State/Province <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={profile.state}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                            placeholder="NY"
                                            required
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            ZIP/Postal Code <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={profile.zipCode}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                            placeholder="10001"
                                            required
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Website (Optional)
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Globe size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                type="url"
                                                name="website"
                                                value={profile.website}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="https://www.example.com"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bio Section */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-akatab flex items-center gap-2">
                                    <FileText size={24} className="text-green-600" />
                                    Professional Bio
                                </h2>

                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                        About You (Optional)
                                    </label>
                                    <textarea
                                        name="bio"
                                        value={profile.bio || ""}
                                        onChange={handleChange}
                                        rows={5}
                                        maxLength={500}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 resize-none text-gray-900"
                                        placeholder="Brief introduction about your practice, areas of expertise, and approach to patient care..."
                                    />
                                    <p className="mt-1 text-xs text-gray-500">
                                        {(profile.bio || "").length}/500 characters
                                    </p>
                                </div>
                            </div>

                            {/* Verification Acknowledgment */}
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                                <label className="flex items-start gap-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        required
                                        className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-400 cursor-pointer"
                                    />
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                        I confirm that I am a licensed medical professional and that all information provided is accurate and truthful. I understand that my credentials will be verified and that providing false information may result in account suspension and legal consequences.
                                    </span>
                                </label>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`flex-1 bg-gradient-to-r from-[#278B51] to-[#32A05F] text-white py-3 px-6 rounded-lg font-semibold hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 ${loading ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} />
                                            Save Profile
                                        </>
                                    )}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => router.push("/dashboard")}
                                    className="flex-1 sm:flex-none bg-gray-100 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Footer Info */}
                    <div className={`mt-8 text-center transition-all duration-700 delay-400 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
                        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <rect x="2" y="5" width="14" height="11" rx="1" stroke="#429C36" strokeWidth="1.5" fill="none" />
                                        <path d="M5 5V4C5 2.34315 6.34315 1 8 1H10C11.6569 1 13 2.34315 13 4V5" stroke="#429C36" strokeWidth="1.5" />
                                    </svg>
                                    <span>SSL Encrypted & Secure</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="9" cy="9" r="7" stroke="#429C36" strokeWidth="1.5" fill="none" />
                                        <path d="M6 9L8 11L12 7" stroke="#429C36" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                    <span>Credentials Verified</span>
                                </div>
                                <div className="hidden sm:block w-1 h-1 bg-gray-300 rounded-full"></div>
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 2L11 7L16 7.5L12.5 11L13.5 16L9 13.5L4.5 16L5.5 11L2 7.5L7 7L9 2Z" fill="#429C36" />
                                    </svg>
                                    <span>HIPAA Compliant</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-shake {
          animation: shake 0.3s ease-in-out;
        }
      `}</style>
        </div>
    );
}