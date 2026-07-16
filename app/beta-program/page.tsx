"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Mail } from "lucide-react";
import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

export default function BetaProgramPage() {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");
    setJoined(true);
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Be the first to try what's next
          </h1>
          <p className="text-gray-600 mb-10">
            Join the IndigoRx beta program to get early access to new features
            before they're released to everyone.
          </p>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8">
            {joined ? (
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle2 size={28} className="text-green-700" />
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Thanks for joining the beta program!
                </h2>
                <p className="text-gray-600 text-sm">
                  We'll email you at <span className="font-medium">{email}</span> as
                  soon as the beta program starts.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="text-center">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <div className="relative flex-1 max-w-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail size={18} className="text-gray-400" />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@yourclinic.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-600"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-green-700 text-white rounded-lg px-6 py-2.5 font-semibold hover:bg-green-800 transition whitespace-nowrap"
                  >
                    Join Beta
                  </button>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </form>
            )}
          </div>

          <p className="text-xs text-gray-400 leading-relaxed mt-8">
            Beta features are provided as-is and may change or be discontinued
            at any time before general release, without notice. Availability
            is limited and not guaranteed for all applicants, and acceptance
            into the beta program is at IndigoRx's sole discretion. Beta
            software may contain bugs and is not intended for use with real
            patient data unless explicitly stated otherwise. By joining, you
            agree to provide feedback that IndigoRx may use to improve the
            product, and to keep unreleased features confidential until they
            are publicly announced. Joining the beta program does not
            guarantee early or continued access, and IndigoRx may end the
            program or remove participants at any time. See our{" "}
            <Link href="/terms-of-service" className="underline hover:text-gray-600">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy-policy" className="underline hover:text-gray-600">
              Privacy Policy
            </Link>{" "}
            for more details.
          </p>
        </div>
      </div>

      <Footer />
    </>
  );
}
