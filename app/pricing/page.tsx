"use client";

import { motion } from "framer-motion";
import { Check, Star } from "lucide-react";
import Link from "next/link";
import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

const plans = [
  {
    name: "Starter",
    price: "20,000",
    tagline: "For independent practices getting started",
    popular: false,
    features: [
      "Up to 500 patient records",
      "Digital prescription tracking",
      "Basic analytics dashboard",
      "Email support",
      "1 doctor account",
    ],
  },
  {
    name: "Professional",
    price: "50,000",
    tagline: "For growing clinics that need more power",
    popular: true,
    features: [
      "Up to 5,000 patient records",
      "Digital prescription tracking",
      "Advanced analytics & reports",
      "Priority email & phone support",
      "Up to 5 doctor accounts",
      "Custom branding",
    ],
  },
  {
    name: "Enterprise",
    price: "1,00,000",
    tagline: "For hospitals and multi-location practices",
    popular: false,
    features: [
      "Unlimited patient records",
      "EMR/EHR (HL7 FHIR) integration",
      "Advanced analytics & reports",
      "Dedicated account manager",
      "Unlimited doctor accounts",
      "HIPAA-grade compliance & audit logs",
    ],
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};

const cardVariant = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function PricingPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950 text-white px-4 py-20 md:py-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="inline-block text-sm font-medium text-green-400 bg-green-400/10 px-4 py-2 rounded-full border border-green-400/20 mb-4">
              Enterprise Plans
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight">
              Plans that scale with your practice
            </h1>
            <p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
              Choose the plan that fits your practice. Upgrade, downgrade, or
              cancel anytime.
            </p>
          </motion.div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch"
          >
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                variants={cardVariant}
                whileHover={{
                  scale: plan.popular ? 1.05 : 1.04,
                  y: -8,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className={`relative rounded-2xl p-8 flex flex-col ${
                  plan.popular
                    ? "bg-gradient-to-b from-green-700 to-green-900 border-2 border-green-400 shadow-[0_0_40px_rgba(34,197,94,0.35)]"
                    : "bg-gray-900 border border-gray-800"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-green-400 text-gray-900 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                    <Star size={12} fill="currentColor" />
                    MOST POPULAR
                  </div>
                )}

                <h2 className="text-2xl font-bold mb-1">{plan.name}</h2>
                <p
                  className={`text-sm mb-6 ${
                    plan.popular ? "text-green-100" : "text-gray-400"
                  }`}
                >
                  {plan.tagline}
                </p>

                <div className="mb-8">
                  <span className="text-4xl md:text-5xl font-extrabold">
                    ₹{plan.price}
                  </span>
                  <span
                    className={`text-sm ml-1 ${
                      plan.popular ? "text-green-100" : "text-gray-400"
                    }`}
                  >
                    /month
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check
                        size={18}
                        className={`flex-shrink-0 mt-0.5 ${
                          plan.popular ? "text-green-300" : "text-green-500"
                        }`}
                      />
                      <span
                        className={plan.popular ? "text-white" : "text-gray-300"}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/contact"
                  className={`text-center rounded-xl px-6 py-3 font-semibold transition-all duration-300 ${
                    plan.popular
                      ? "bg-white text-green-800 hover:bg-gray-100"
                      : "bg-green-700 text-white hover:bg-green-600"
                  }`}
                >
                  Contact Us
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="text-center text-gray-500 text-sm mt-12"
          >
            All prices in INR, billed monthly. Contact our sales team for
            custom enterprise pricing.
          </motion.p>
        </div>
      </div>

      <Footer />
    </>
  );
}
