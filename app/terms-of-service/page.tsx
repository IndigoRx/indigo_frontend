import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Terms of Service
          </h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: July 12, 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing or using IndigoRx, operated by Zeeza Global, you
                agree to be bound by these Terms of Service. If you do not
                agree to these terms, please do not use the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2. Eligibility
              </h2>
              <p>
                IndigoRx is intended for use by licensed healthcare
                professionals and authorized staff. By registering, you
                confirm that you have the necessary credentials and authority
                to use the platform in a professional capacity.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. Account Responsibilities
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of
                your login credentials and for all activity that occurs under
                your account. Notify us immediately of any unauthorized use.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                4. Acceptable Use
              </h2>
              <p>
                You agree to use IndigoRx only for lawful purposes related to
                patient care and practice management, and not to misuse the
                platform, attempt to access data you are not authorized to
                view, or interfere with the platform's operation.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                5. Medical Disclaimer
              </h2>
              <p>
                IndigoRx is a practice management tool and does not provide
                medical advice. All clinical decisions, prescriptions, and
                patient care remain the sole responsibility of the treating
                healthcare provider.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                6. Limitation of Liability
              </h2>
              <p>
                To the fullest extent permitted by law, Zeeza Global shall
                not be liable for any indirect, incidental, or consequential
                damages arising from your use of the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                7. Changes to These Terms
              </h2>
              <p>
                We may update these Terms of Service from time to time.
                Continued use of IndigoRx after changes are posted constitutes
                acceptance of the revised terms.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                8. Contact Us
              </h2>
              <p>
                Questions about these Terms of Service can be sent to{" "}
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
