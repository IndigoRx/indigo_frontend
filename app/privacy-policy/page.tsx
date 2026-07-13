import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Privacy Policy
          </h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: July 12, 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                1. Introduction
              </h2>
              <p>
                IndigoRx ("we", "our", "us"), operated by Zeeza Global, is
                committed to protecting the privacy of doctors, patients, and
                visitors who use our platform. This Privacy Policy explains
                what information we collect, how we use it, and the choices
                you have regarding your data.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2. Information We Collect
              </h2>
              <p>
                We collect account information (such as name, email, and
                professional details) provided during registration, patient
                and prescription data entered by healthcare providers, and
                usage data such as log files and device information collected
                automatically when you use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. How We Use Your Information
              </h2>
              <p>
                We use collected information to provide and maintain the
                IndigoRx platform, manage patient records and prescriptions on
                behalf of doctors, communicate important updates, and improve
                the security and performance of our services.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                4. Data Sharing
              </h2>
              <p>
                We do not sell your personal information. Data may be shared
                with service providers who help us operate the platform,
                subject to confidentiality obligations, or when required by
                law or to protect the rights and safety of our users.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                5. Data Security
              </h2>
              <p>
                We implement industry-standard technical and organizational
                measures to protect patient and account data from
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                6. Your Rights
              </h2>
              <p>
                You may request access to, correction of, or deletion of your
                personal information, subject to applicable healthcare record
                retention requirements. Contact us to exercise these rights.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                7. Contact Us
              </h2>
              <p>
                If you have questions about this Privacy Policy, please
                contact us at{" "}
                <a
                  href="mailto:info@indigorx.me"
                  className="text-green-700 hover:text-green-800 font-medium"
                >
                  info@indigorx.me
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
