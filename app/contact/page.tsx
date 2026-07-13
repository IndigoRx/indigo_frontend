"use client";

import { Mail, Phone, ExternalLink } from "lucide-react";
import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Support",
    description: "Get help via email within 24 hours",
    action: "info@indigorx.me",
    href: "mailto:info@indigorx.me",
    buttonText: "Send Email",
  },
  {
    icon: Phone,
    title: "Phone Support",
    description: "Speak with our support team",
    action: "+91 94911 89000",
    href: "tel:+919491189000",
    buttonText: "Call Now",
  },
];

export default function ContactPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Contact Us
            </h1>
            <p className="text-gray-600 mt-2">
              Choose your preferred way to reach our support team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contactMethods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:border-green-700/30 hover:shadow-md transition-all"
                >
                  <div className="w-12 h-12 bg-green-700/10 rounded-lg flex items-center justify-center mb-4">
                    <Icon size={22} className="text-green-700" />
                  </div>
                  <h3 className="font-semibold text-gray-900 text-lg mb-1">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {method.description}
                  </p>
                  <p className="text-sm font-medium text-gray-700 mb-4">
                    {method.action}
                  </p>
                  <a
                    href={method.href}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                  >
                    {method.buttonText}
                    <ExternalLink size={14} />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
