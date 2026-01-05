"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Lock,
  Shield,
  CreditCard,
  Save,
  Building2,
  Phone,
  Mail,
  IdCard,
  Award,
  Crown,
  Calendar,
  CheckCircle,
  ArrowRight,
  Clock,
  Loader2,
  AlertCircle,
  Star,
  Zap,
} from "lucide-react";
import Link from "next/link";
import subscriptionService, { SubscriptionDetails, PricingInfo } from "@/app/subscription/Subscriptionservice";

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
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [details, setDetails] = useState<SubscriptionDetails | null>(null);
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

  // Mock doctor data - in real app, this would come from props or context
  const [formData, setFormData] = useState<DoctorData>({
    id: 1,
    firstName: "John",
    lastName: "Doe",
    specialization: "Cardiology",
    licenseNumber: "MD123456",
    hospitalName: "City General Hospital",
    contactNumber: "+1 (555) 123-4567",
    email: "dr.john.doe@hospital.com",
    stripeUsername: "dr_john_stripe",
  });

  const loadData = async () => {
    setLoadingDetails(true);
    try {
      const [detailsData, pricingData] = await Promise.all([
        subscriptionService.getSubscriptionDetails(),
        subscriptionService.getPricing()
      ]);
      setDetails(detailsData);
      setPricing(pricingData);
    } catch (err) {
      console.error('Error loading subscription data:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  useEffect(() => {
    if (activeTab === "subscription") {
      loadData();
    }
  }, [activeTab]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getStatusDisplay = () => {
    if (!details) {
      return { text: "No Active Plan", className: "bg-gray-100 text-gray-800" };
    }
    switch (details.status) {
      case "ACTIVE":
        return { text: "Active", className: "bg-green-100 text-green-800" };
      case "TRIAL":
        return { text: "Free Trial", className: "bg-blue-100 text-blue-800" };
      case "PAST_DUE":
        return { text: "Past Due", className: "bg-amber-100 text-amber-800" };
      case "EXPIRED":
        return { text: "Expired", className: "bg-red-100 text-red-800" };
      default:
        return { text: details.status || "Unknown", className: "bg-gray-100 text-gray-800" };
    }
  };

  const handleManageBilling = async () => {
    setBillingLoading(true);
    try {
      const returnUrl = window.location.href;
      const response = await subscriptionService.getBillingPortalUrl(returnUrl);
      if (response?.portalUrl) {
        window.location.href = response.portalUrl;
      }
    } catch (err) {
      console.error("Error opening billing portal:", err);
    } finally {
      setBillingLoading(false);
    }
  };

  // Calculate days remaining for trial
  const calculateDaysRemaining = () => {
    if (details?.daysRemaining !== undefined) {
      return details.daysRemaining;
    }
    if (!details?.trialEndDate) return 0;
    const now = new Date();
    const trialEnd = new Date(details.trialEndDate);
    const diffTime = trialEnd.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const isTrialPeriod = details?.status === "TRIAL";
  const daysRemaining = calculateDaysRemaining();

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSaving(false);
  };

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "subscription", label: "Subscription", icon: Crown },
    { id: "payment", label: "Payment", icon: CreditCard },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? "border-[#166534] text-[#166534] bg-green-50/50"
                      : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={18} strokeWidth={2} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      />
                    </div>
                  </div>
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      />
                    </div>
                  </div>
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
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      />
                    </div>
                  </div>
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Professional Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      />
                    </div>
                  </div>
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hospital Name
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
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Change Password
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                        placeholder="Enter current password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                        placeholder="Enter new password"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="password"
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Two-Factor Authentication
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">
                      Enable Two-Factor Authentication
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#166534] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#166534]"></div>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === "subscription" && (
            <div className="space-y-6">
              {loadingDetails ? (
                <div className="flex items-center justify-center py-12">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-[#166534] animate-spin" />
                    <p className="text-sm text-gray-500">Loading subscription details...</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Current Status Banner - Active Subscription */}
                  {details?.status === "ACTIVE" && (
                    <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-[#166534] rounded-xl">
                            <Star size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-semibold text-gray-900">
                                Pro Annual Plan
                              </h4>
                              <span className="px-2.5 py-0.5 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                Active
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Full access to all IndigoRx features
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={handleManageBilling}
                          disabled={billingLoading}
                          className="px-4 py-2 text-sm font-medium text-[#166534] bg-white border border-[#166534] hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {billingLoading && <Loader2 size={16} className="animate-spin" />}
                          Manage Billing
                        </button>
                      </div>
                      
                      <div className="mt-5 pt-5 border-t border-emerald-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-[#166534]" />
                          <div>
                            <p className="text-xs text-gray-500">Renews on</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(details?.subscriptionEndDate || null)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <CreditCard size={18} className="text-[#166534]" />
                          <div>
                            <p className="text-xs text-gray-500">Amount</p>
                            <p className="text-sm font-medium text-gray-900">
                              ₹{pricing?.yearlyPrice || "6,000"}/year
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Shield size={18} className="text-[#166534]" />
                          <div>
                            <p className="text-xs text-gray-500">Payment</p>
                            <p className="text-sm font-medium text-gray-900">Auto-renewal</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Trial Status Banner */}
                  {isTrialPeriod && daysRemaining > 0 && (
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-blue-600 rounded-xl">
                            <Clock size={24} className="text-white" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-lg font-semibold text-gray-900">
                                Free Trial
                              </h4>
                              <span className="px-2.5 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                                {daysRemaining} days left
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">
                              Explore all features during your trial period
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Progress bar */}
                      <div className="mt-5">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                          <span>Trial progress</span>
                          <span>{Math.round(((90 - daysRemaining) / 90) * 100)}% complete</span>
                        </div>
                        <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                            style={{ width: `${((90 - daysRemaining) / 90) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div className="mt-5 pt-5 border-t border-blue-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Trial ends on</p>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDate(details?.trialEndDate || null)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Zap size={18} className="text-blue-600" />
                          <div>
                            <p className="text-xs text-gray-500">Access</p>
                            <p className="text-sm font-medium text-gray-900">Full features</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Expired Status Banner */}
                  {details?.status === "EXPIRED" && (
                    <div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-red-500 rounded-xl">
                          <AlertCircle size={24} className="text-white" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-semibold text-gray-900">
                              Subscription Expired
                            </h4>
                            <span className="px-2.5 py-0.5 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              Expired
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            Subscribe to continue creating prescriptions and managing your practice
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No Subscription Banner */}
                  {!details && (
                    <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-gray-500 rounded-xl">
                          <Crown size={24} className="text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-1">
                            No Active Plan
                          </h4>
                          <p className="text-sm text-gray-600">
                            Start your free trial or subscribe to access IndigoRx features
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Plan Features */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      {details?.status === "ACTIVE" ? "Your Plan Includes" : "Pro Plan Features"}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        "Unlimited prescriptions",
                        "Unlimited patients",
                        "Digital signatures",
                        "PDF reports & exports",
                        "Email notifications",
                        "Priority support",
                        "Data backup & security",
                        "Analytics dashboard",
                      ].map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <CheckCircle size={18} className="text-[#166534] flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Manage Subscription Button */}
                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {details?.status === "ACTIVE" 
                        ? "Need to make changes?" 
                        : "Ready to get started?"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {details?.status === "ACTIVE"
                        ? "Update your payment method, view invoices, or manage your subscription."
                        : details?.status === "TRIAL"
                        ? "Upgrade now to ensure uninterrupted access after your trial ends."
                        : "View all plans and choose the one that fits your practice."}
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href="/subscription"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors"
                      >
                        <span>
                          {details?.status === "ACTIVE" 
                            ? "View Plans" 
                            : details?.status === "TRIAL"
                            ? "Upgrade Now"
                            : "View Plans"}
                        </span>
                        <ArrowRight size={18} />
                      </Link>
                      {details?.status === "ACTIVE" && (
                        <button
                          onClick={handleManageBilling}
                          disabled={billingLoading}
                          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
                        >
                          {billingLoading && <Loader2 size={18} className="animate-spin" />}
                          <CreditCard size={18} />
                          <span>Billing Portal</span>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Payment Tab */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stripe Username
                    </label>
                    <div className="relative">
                      <CreditCard
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={18}
                      />
                      <input
                        type="text"
                        value={formData.stripeUsername}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            stripeUsername: e.target.value,
                          })
                        }
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#166534] focus:border-transparent"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Your Stripe account for receiving payments
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <Shield size={20} className="text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-blue-900">
                          Payment Security
                        </p>
                        <p className="text-sm text-blue-700 mt-1">
                          All payment information is encrypted and processed
                          securely through Stripe.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end gap-3">
        <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#166534] text-white rounded-lg font-medium hover:bg-[#14532D] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={18} strokeWidth={2} />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}