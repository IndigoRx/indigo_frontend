"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

const faqs = [
  {
    question: "What is IndigoRx?",
    answer:
      "IndigoRx is a prescription management platform built for doctors. It helps you manage patient records, create and track digital prescriptions, and get insights into your practice, all in one place.",
  },
  {
    question: "Who can create an account on IndigoRx?",
    answer:
      "IndigoRx is built for licensed healthcare professionals. Doctors can register with their professional details, and once verified, can start managing patients and prescriptions.",
  },
  {
    question: "Is my patient data secure?",
    answer:
      "Yes. Patient records and prescriptions are encrypted and access is restricted to your account. We follow industry-standard security practices to keep healthcare data private and protected.",
  },
  {
    question: "How do I create a digital prescription?",
    answer:
      "From your dashboard, click \"New Prescription\", select a patient, add medications with dosage and duration, and save. You can then share or open the signed PDF prescription instantly.",
  },
  {
    question: "Can I add a new patient while creating a prescription?",
    answer:
      "Yes. If a patient isn't in your records yet, you can add them directly from the prescription creation screen, and they'll be automatically selected for that prescription.",
  },
  {
    question: "What plans does IndigoRx offer?",
    answer:
      "We offer Starter, Professional, and Enterprise plans to fit practices of different sizes, from independent clinics to hospitals. Visit our Pricing page for details, or contact us for custom enterprise pricing.",
  },
  {
    question: "Can I publish articles on IndigoRx?",
    answer:
      "Yes. Doctors can write and publish articles to share knowledge with patients and the community from the Articles section, using our built-in editor.",
  },
  {
    question: "How do I get help if I run into an issue?",
    answer:
      "You can reach our support team via email or phone from the Contact page. We're also available for enterprise integration support.",
  },
];

export default function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Frequently Asked Questions
            </h1>
            <p className="text-gray-600 mt-2">
              Everything you need to know about using IndigoRx.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full flex items-center justify-between text-left px-6 py-4 gap-4"
                  >
                    <span className="font-medium text-gray-900">
                      {faq.question}
                    </span>
                    <ChevronDown
                      size={20}
                      className={`flex-shrink-0 text-gray-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-200 ease-in-out ${
                      isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-4 text-sm text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
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
