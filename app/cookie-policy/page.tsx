import Navbar from "../components/Navbar/page";
import Footer from "../components/SubComponents/Footer";

export default function CookiePolicyPage() {
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-50 px-4 py-16 md:py-20">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-100 shadow-sm p-8 md:p-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Cookie Policy
          </h1>
          <p className="text-sm text-gray-400 mb-8">Last updated: July 12, 2026</p>

          <div className="space-y-8 text-gray-700 leading-relaxed">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                1. What Are Cookies
              </h2>
              <p>
                Cookies are small text files stored on your device when you
                visit a website. They help the site remember your preferences
                and keep you signed in between visits.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                2. How We Use Cookies
              </h2>
              <p>
                IndigoRx uses cookies to keep you securely logged in, remember
                your preferences, and understand how the platform is used so
                we can improve performance and reliability.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                3. Types of Cookies We Use
              </h2>
              <p>
                <span className="font-medium text-gray-900">Essential cookies</span> are
                required for core functionality such as authentication and
                security, and cannot be disabled. <span className="font-medium text-gray-900">Functional cookies</span> remember
                your settings and preferences. <span className="font-medium text-gray-900">Analytics cookies</span> help
                us understand usage patterns to improve the platform.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                4. Managing Cookies
              </h2>
              <p>
                Most browsers allow you to control cookies through their
                settings, including blocking or deleting them. Please note
                that disabling essential cookies may prevent you from logging
                in or using core features of IndigoRx.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                5. Changes to This Policy
              </h2>
              <p>
                We may update this Cookie Policy from time to time to reflect
                changes in our practices. Any updates will be posted on this
                page with a revised date.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                6. Contact Us
              </h2>
              <p>
                If you have questions about our use of cookies, contact us at{" "}
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
