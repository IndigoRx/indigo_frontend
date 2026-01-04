"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, Sparkles, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { subscriptionService, SubscriptionStatus } from "@/app/subscription/Subscriptionservice";

interface CheckoutSuccessResponse {
  success: boolean;
  message: string;
  status: SubscriptionStatus;
}

export default function SubscriptionSuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<CheckoutSuccessResponse | null>(null);
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const verifySubscription = async () => {
      if (!sessionId) {
        setError("No session ID found");
        setLoading(false);
        return;
      }

      try {
        const result = await subscriptionService.handleCheckoutSuccess(sessionId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    verifySubscription();
  }, [sessionId]);

  // Auto-redirect countdown
  useEffect(() => {
    if (!loading && data?.success) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/dashboard");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [loading, data, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-green-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Verifying your subscription...</p>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Something went wrong
          </h1>
          <p className="text-gray-600 mb-6">
            {error || "We couldn't verify your subscription. Please try again or contact support."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/pricing")}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gray-100 text-gray-700 py-3 px-6 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000" />
      </div>

      <div className="max-w-lg w-full relative">
        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header with gradient */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-8 py-10 text-center relative overflow-hidden">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <CheckCircle className="w-12 h-12 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to IndigoRx!
              </h1>
              <p className="text-green-100 text-lg">
                Your subscription is now active
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="px-8 py-8">
            {/* Plan Details */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6 border border-green-100">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-gray-900">Your Plan</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subscription</span>
                  <span className="font-semibold text-gray-900">
                    {data.status.plan === "YEARLY" ? "Annual Plan" : data.status.plan}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status</span>
                  <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Active
                  </span>
                </div>
                {data.status.expiryDate && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Valid Until</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(data.status.expiryDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Features unlocked */}
            <div className="mb-8">
              <h3 className="font-semibold text-gray-900 mb-3">Features Unlocked</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  "Unlimited Prescriptions",
                  "Patient Management",
                  "Digital Signatures",
                  "PDF Reports",
                  "Email Notifications",
                  "Priority Support",
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button */}
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-green-600/25 hover:shadow-xl hover:shadow-green-600/30 transform hover:-translate-y-0.5"
            >
              Go to Dashboard
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Auto-redirect notice */}
            <p className="text-center text-sm text-gray-500 mt-4">
              Redirecting to dashboard in{" "}
              <span className="font-semibold text-green-600">{countdown}</span> seconds
            </p>
          </div>
        </div>

        {/* Support note */}
        <p className="text-center text-sm text-gray-500 mt-6">
          Need help?{" "}
          <a href="mailto:support@indigorx.me" className="text-green-600 hover:underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}