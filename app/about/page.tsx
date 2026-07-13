"use client";

import dynamic from "next/dynamic";
import { Globe, Mail } from "lucide-react";
import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

const AboutScene = dynamic(() => import("../components/About/AboutScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center text-white/70 text-sm">
      Loading 3D scene...
    </div>
  ),
});

export default function AboutPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-block text-sm font-medium text-gray-600 bg-green-50 px-4 py-2 rounded-full border border-green-100 mb-4">
              About Us
            </span>

            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Built for doctors,{" "}
              <span className="text-green-700">not just software</span>
            </h1>

            <p className="text-gray-600 text-base md:text-lg mb-4 leading-relaxed">
              IndigoRx is our flagship prescription management platform,
              built by Zeeza Global to give doctors back the hours lost to
              paperwork. From patient records to digital prescriptions,
              every part of IndigoRx is designed around how doctors actually
              practice medicine.
            </p>

            <p className="text-gray-600 text-base md:text-lg mb-8 leading-relaxed">
              Trusted by healthcare professionals across Canada, IndigoRx
              helps you manage patients, track prescriptions, and gain
              insights into treatment outcomes, so you can spend less time on
              admin and more time with your patients.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="https://www.zeezaglobal.ca"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Globe size={16} />
                www.zeezaglobal.ca
              </a>
              <a
                href="mailto:info@zeezaglobal.ca"
                className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Mail size={16} />
                info@zeezaglobal.ca
              </a>
            </div>
          </div>

          <div className="h-[420px] md:h-[520px] rounded-2xl overflow-hidden bg-gradient-to-br from-green-700 via-green-600 to-green-800">
            <AboutScene />
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
