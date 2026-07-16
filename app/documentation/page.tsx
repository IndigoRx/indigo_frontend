"use client";

import { useState } from "react";
import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

interface DocArticle {
  slug: string;
  title: string;
  content: string[];
  tip?: string;
}

interface DocCategory {
  category: string;
  items: DocArticle[];
}

const docs: DocCategory[] = [
  {
    category: "Getting Started",
    items: [
      {
        slug: "how-to-login",
        title: "How to Login",
        content: [
          "To access your IndigoRx account, click the \"Login\" button in the top navigation bar from any page.",
          "Enter the email address you registered with, along with your password, then click \"Sign in\".",
          "If your doctor profile isn't complete yet, you'll be redirected to finish setting it up before you can access your dashboard.",
        ],
        tip: "Forgot your password? Use the \"Forgot password?\" link on the login page to reset it via email.",
      },
      {
        slug: "how-to-register",
        title: "How to Create an Account",
        content: [
          "Click \"Sign up\" in the top navigation bar to open the registration form.",
          "Fill in your details, including your professional license information, and choose a secure password.",
          "After submitting, we'll send a one-time verification code to your email. Enter it to verify your account and complete registration.",
        ],
      },
      {
        slug: "dashboard-overview",
        title: "Understanding Your Dashboard",
        content: [
          "Your dashboard is the first thing you see after logging in. It gives you a quick summary of your practice at a glance.",
          "You'll find stats like total patients, prescriptions this month, and pending prescriptions at the top.",
          "Below that, the \"Patients Per Day\" chart shows how many new patients you've seen over the last 7 days.",
          "The Recent Patients and Recent Prescriptions lists let you jump straight into a record without searching.",
        ],
      },
    ],
  },
  {
    category: "Patients",
    items: [
      {
        slug: "add-a-patient",
        title: "How to Add a Patient",
        content: [
          "Go to the Patients section from your dashboard sidebar and click \"Add Patient\".",
          "Fill in the patient's name, age (or date of birth), gender, and phone number. Email, address, and medical history are optional.",
          "For infants, you can switch the age unit to \"Months\" instead of \"Years\".",
          "Click \"Add Patient\" to save. The new patient will now appear in your patient list.",
        ],
      },
      {
        slug: "search-patients",
        title: "Searching for a Patient",
        content: [
          "Use the search bar at the top of the Patients page to look up a patient by name.",
          "You can also sort the patient list by name or age using the sort dropdown.",
        ],
      },
    ],
  },
  {
    category: "Prescriptions",
    items: [
      {
        slug: "create-prescription",
        title: "How to Create a Prescription",
        content: [
          "Click the green \"Rx +\" floating button on your dashboard, or go to the Prescriptions page and click \"New Prescription\".",
          "Search for an existing patient, or add a new one on the spot if they're not in your records yet.",
          "Add one or more medications, along with dosage, frequency, and duration (in days, weeks, months, or years).",
          "Click \"Create Prescription\" to generate a signed, downloadable PDF prescription.",
        ],
        tip: "After creating a prescription, you can immediately Share it or Open the PDF from the confirmation dialog.",
      },
      {
        slug: "download-prescription",
        title: "Downloading a Prescription PDF",
        content: [
          "From the Prescriptions page, find the prescription you need in the list.",
          "Click the download icon in the row to save a signed PDF copy of the prescription to your device.",
        ],
      },
    ],
  },
  {
    category: "Articles",
    items: [
      {
        slug: "publish-article",
        title: "How to Publish an Article",
        content: [
          "Go to the Articles page and click \"Add Your Own Article\".",
          "Use the full-screen editor to write your title, a short summary, and the article body. The toolbar supports headings, bold, italics, lists, and more.",
          "Click \"Publish\" to make it visible to everyone, or \"Save as Draft\" to keep working on it later.",
        ],
      },
    ],
  },
  {
    category: "Account",
    items: [
      {
        slug: "manage-profile",
        title: "Managing Your Profile",
        content: [
          "Click your profile icon and go to \"Settings\" to update your professional details, such as your specialization and hospital name.",
          "You can also change your password from the Security tab in Settings.",
        ],
      },
      {
        slug: "pricing-plans",
        title: "Pricing & Plans",
        content: [
          "IndigoRx offers Starter, Professional, and Enterprise plans to fit practices of different sizes.",
          "Visit the Pricing page to compare plans, or contact our sales team for custom enterprise pricing.",
        ],
      },
    ],
  },
];

export default function DocumentationPage() {
  const [activeSlug, setActiveSlug] = useState(docs[0].items[0].slug);

  const activeArticle =
    docs.flatMap((c) => c.items).find((item) => item.slug === activeSlug) ??
    docs[0].items[0];

  const activeCategory = docs.find((c) =>
    c.items.some((item) => item.slug === activeSlug)
  );

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-white pt-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r border-gray-200 md:h-[calc(100vh-4rem)] md:sticky md:top-16 overflow-y-auto py-6">
            <div className="px-4 mb-4">
              <h2 className="text-lg font-bold text-gray-900">Documentation</h2>
              <p className="text-xs text-gray-500 mt-1">
                Guides for using IndigoRx
              </p>
            </div>

            <nav className="px-2">
              {docs.map((category) => (
                <div key={category.category} className="mb-5">
                  <h3 className="px-2 mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    {category.category}
                  </h3>
                  <ul>
                    {category.items.map((item) => (
                      <li key={item.slug}>
                        <button
                          onClick={() => setActiveSlug(item.slug)}
                          className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${
                            activeSlug === item.slug
                              ? "bg-green-50 text-green-700 font-medium"
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          }`}
                        >
                          {item.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 px-6 md:px-12 py-10 max-w-3xl">
            <p className="text-xs text-gray-400 mb-2">
              Documentation {activeCategory ? `/ ${activeCategory.category}` : ""}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">
              {activeArticle.title}
            </h1>

            <div className="space-y-4">
              {activeArticle.content.map((paragraph, i) => (
                <p key={i} className="text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            {activeArticle.tip && (
              <div className="mt-8 bg-green-50 border border-green-100 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  <span className="font-semibold">Tip: </span>
                  {activeArticle.tip}
                </p>
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
}
