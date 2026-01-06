"use client";

import React, { useState, useEffect } from "react";
import {
  Shield,
  CreditCard,
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

export default function SubscriptionSection() {
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [details, setDetails] = useState<SubscriptionDetails | null>(null);
  const [pricing, setPricing] = useState<PricingInfo | null>(null);
  const [billingLoading, setBillingLoading] = useState(false);

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
    loadData();
  }, []);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
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

  return (
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
  );
}