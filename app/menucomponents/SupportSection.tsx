"use client";

import React, { useState } from "react";
import {
  Mail,
  Send,
  Building2,
  Globe,
  Phone,
  ExternalLink,
  CheckCircle,
  Loader2,
  Headphones,
  Shield,
  Zap,
  Users,
} from "lucide-react";

export default function SupportSection() {
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    category: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketSubmitted, setTicketSubmitted] = useState(false);

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setTicketSubmitted(true);
    setTicketForm({ subject: "", category: "", description: "" });
    setTimeout(() => setTicketSubmitted(false), 5000);
  };

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

  const enterpriseFeatures = [
    {
      icon: Building2,
      title: "Hospital Integration",
      description: "Seamless EMR/EHR system integration with HL7 FHIR support",
    },
    {
      icon: Shield,
      title: "HIPAA Compliant",
      description: "Enterprise-grade security and compliance for healthcare data",
    },
    {
      icon: Zap,
      title: "Custom API Access",
      description: "RESTful APIs for custom workflows and automation",
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "24/7 priority support with dedicated account manager",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Contact Us Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Contact Us</h3>
        <p className="text-sm text-gray-500 mb-4">
          Choose your preferred way to reach our support team
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contactMethods.map((method, index) => {
            const Icon = method.icon;
            return (
              <div
                key={index}
                className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:border-[#166534]/30 hover:bg-green-50/30 transition-all"
              >
                <div className="w-10 h-10 bg-[#166534]/10 rounded-lg flex items-center justify-center mb-3">
                  <Icon size={20} className="text-[#166534]" />
                </div>
                <h4 className="font-medium text-gray-900 mb-1">{method.title}</h4>
                <p className="text-sm text-gray-500 mb-3">{method.description}</p>
                <p className="text-sm font-medium text-gray-700 mb-3">{method.action}</p>
                <a
                  href={method.href}
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-[#166534] hover:text-[#14532d] transition-colors"
                >
                  {method.buttonText}
                  <ExternalLink size={14} />
                </a>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submit Ticket Section */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Submit a Ticket</h3>
        <p className="text-sm text-gray-500 mb-4">
          Describe your issue and we'll get back to you as soon as possible
        </p>

        {ticketSubmitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <CheckCircle size={20} className="text-green-600" />
            <div>
              <p className="font-medium text-green-800">Ticket Submitted Successfully</p>
              <p className="text-sm text-green-600">
                We'll respond to your inquiry within 24 hours.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Subject
                </label>
                <input
                  type="text"
                  value={ticketForm.subject}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, subject: e.target.value })
                  }
                  placeholder="Brief description of your issue"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534]"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={ticketForm.category}
                  onChange={(e) =>
                    setTicketForm({ ...ticketForm, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] bg-white"
                  required
                >
                  <option value="">Select a category</option>
                  <option value="technical">Technical Issue</option>
                  <option value="billing">Billing & Subscription</option>
                  <option value="account">Account Management</option>
                  <option value="feature">Feature Request</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Description
              </label>
              <textarea
                value={ticketForm.description}
                onChange={(e) =>
                  setTicketForm({ ...ticketForm, description: e.target.value })
                }
                placeholder="Please provide as much detail as possible..."
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#166534]/20 focus:border-[#166534] resize-none"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#166534] text-white text-sm font-medium rounded-lg hover:bg-[#14532d] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={16} />
                  Submit Ticket
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Enterprise Integrations Section */}
      <div className="border-t border-gray-200 pt-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              Enterprise Integrations
            </h3>
            <p className="text-sm text-gray-500">
              Scalable solutions designed for hospitals and healthcare organizations
            </p>
          </div>
          <a
            href="mailto:enterprise@zeezaglobal.ca"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Headphones size={16} />
            Contact Sales
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {enterpriseFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200"
              >
                <div className="w-9 h-9 bg-gray-900/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-gray-700" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-0.5">{feature.title}</h4>
                  <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* About Company Section */}
      <div className="border-t border-gray-200 pt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">About Zeeza Global</h3>

        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center">
              <Globe size={24} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-lg">Zeeza Global</h4>
              <p className="text-gray-400 text-sm">Healthcare Technology Solutions</p>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            Zeeza Global is a leading healthcare technology company dedicated to
            transforming prescription management and healthcare workflows. Our mission
            is to empower healthcare providers with innovative, secure, and efficient
            digital solutions that improve patient care and streamline operations.
          </p>

          <p className="text-gray-300 text-sm leading-relaxed mb-6">
            IndigoRx is our flagship prescription management platform, trusted by
            healthcare professionals across Canada. We're committed to building
            technology that makes healthcare more accessible, efficient, and secure.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-white/10">
            <a
              href="https://www.zeezaglobal.ca"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              <Globe size={16} />
              www.zeezaglobal.ca
              <ExternalLink size={14} />
            </a>
            <a
              href="mailto:info@zeezaglobal.ca"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors"
            >
              <Mail size={16} />
              info@zeezaglobal.ca
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}