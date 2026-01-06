"use client";

import React, { useState } from "react";
import { User, Lock, Crown, CreditCard, Save } from "lucide-react";
import ProfileSection from "./Profilesection";
import SecuritySection from "./Securitysection";
import SubscriptionSection from "./Subscriptionsection";
import PaymentSection from "./Paymentsection";

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

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSection formData={formData} setFormData={setFormData} />;
      case "security":
        return <SecuritySection />;
      case "subscription":
        return <SubscriptionSection />;
      case "payment":
        return <PaymentSection formData={formData} setFormData={setFormData} />;
      default:
        return null;
    }
  };

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
          {renderTabContent()}
        </div>
      </div>

    
     
    </div>
  );
}