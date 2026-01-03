"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
    User,
    Phone,
    Building2,
    GraduationCap,
    FileText,
    Save,
    ArrowLeft,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { API_ENDPOINTS } from "@/app/api/config";

interface DoctorProfile {
    name: string;
    licenseNumber: string;
    specialization: string;
    phone: string;
    address: string;
    qualifications: string;
    hospitalName: string;
}

export default function CompleteProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [mounted, setMounted] = useState(false);

    const [profile, setProfile] = useState<DoctorProfile>({
        name: "",
        licenseNumber: "",
        specialization: "",
        phone: "",
        address: "",
        qualifications: "",
        hospitalName: ""
    });

    useEffect(() => {
        setMounted(true);
        // Check if user is authenticated and needs to complete profile
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/login");
        }
    }, [router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const token = localStorage.getItem("token");

            if (!token) {
                setError("Authentication required. Please log in again.");
                router.push("/login");
                return;
            }

            // Validate required fields
            if (!profile.name || !profile.licenseNumber || !profile.specialization || !profile.phone) {
                setError("Please fill in all required fields.");
                setLoading(false);
                return;
            }

            // Complete doctor profile - prepend +91 to phone number
            const profileData = {
                ...profile,
                phone: `+91${profile.phone.replace(/\s/g, '')}`
            };

            const response = await fetch(API_ENDPOINTS.DOCTOR_PROFILE_COMPLETE, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(profileData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to complete profile");
            }

            // Success - redirect to dashboard
           router.push("/subscription");

        } catch (err: any) {
            console.error("Error completing profile:", err);
            setError(err.message || "Failed to complete profile. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 relative overflow-hidden">
            {/* Animated background shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-64 h-64 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute top-40 right-10 w-64 h-64 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-64 h-64 bg-teal-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className={`mb-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="48" height="48" rx="10" fill="#429C36" />
                                    <path d="M14 24L21 31L34 17" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-ping"></div>
                            </div>
                            <div>
                                <h1 className="text-4xl font-bold text-gray-900 font-akatab">Complete Your Profile</h1>
                                <p className="text-gray-600 font-akatab mt-1">Just a few more details to get started</p>
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
                                    width: `${(Object.values(profile).filter(val => val !== "").length / Object.keys(profile).length) * 100}%`
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
                                            IndigoRx is exclusively for licensed medical doctors and healthcare professionals. All credentials will be verified through official medical licensing databases and background checks.
                                        </p>
                                        <p className="text-xs text-amber-700 mt-3 italic">
                                            Note: Providing false information or impersonating a medical professional is a serious offense and may result in legal action.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Error Message */}
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
                                    <div className="group md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Full Name <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <User size={18} className="text-gray-400 group-focus-within:text-green-500 transition-colors" />
                                            </div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={profile.name}
                                                onChange={handleChange}
                                                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="Dr. John Doe"
                                                required
                                            />
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">Enter your full name as it appears on your medical license</p>
                                    </div>

                                    <div className="group md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Contact Number <span className="text-red-500">*</span>
                                        </label>
                                        <div className="flex">
                                            <div className="flex items-center px-4 py-3 bg-gray-100 border border-r-0 border-gray-200 rounded-l-lg">
                                                <Phone size={18} className="text-gray-500 mr-2" />
                                                <span className="text-gray-700 font-medium">+91</span>
                                            </div>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={profile.phone}
                                                onChange={handleChange}
                                                className="flex-1 px-4 py-3 rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                                placeholder="98765 43210"
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

                                    <div className="group md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Qualifications <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="qualifications"
                                            value={profile.qualifications}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 text-gray-900"
                                            placeholder="MBBS, MD, etc."
                                            required
                                        />
                                        <p className="mt-1 text-xs text-gray-500">Enter your medical degree(s) and certifications</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hospital/Practice Information Section */}
                            <div className="mb-10">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6 font-akatab flex items-center gap-2">
                                    <Building2 size={24} className="text-green-600" />
                                    Hospital & Practice Information
                                </h2>

                                <div className="grid grid-cols-1 gap-6">
                                    <div className="group">
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

                                    <div className="group">
                                        <label className="block text-sm font-medium text-gray-700 mb-2 font-akatab">
                                            Practice Address <span className="text-gray-500 text-xs">(Optional)</span>
                                        </label>
                                        <textarea
                                            name="address"
                                            value={profile.address}
                                            onChange={handleChange}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition-all duration-200 hover:border-gray-300 resize-none text-gray-900"
                                            placeholder="123 Medical Street, City, State, ZIP"
                                        />
                                    </div>
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
                                            Completing Profile...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={20} />
                                            Complete Profile
                                        </>
                                    )}
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