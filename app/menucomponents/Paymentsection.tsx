"use client";

import React from "react";
import { CreditCard, Shield } from "lucide-react";

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

interface PaymentSectionProps {
  formData: DoctorData;
  setFormData: React.Dispatch<React.SetStateAction<DoctorData>>;
}

export default function PaymentSection({ formData, setFormData }: PaymentSectionProps) {
  return (
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
  );
}