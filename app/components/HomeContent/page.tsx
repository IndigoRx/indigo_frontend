"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import Navbar from "../Navbar/page";


const roboto = Roboto({
  weight: ["400", "500"],
  subsets: ["latin"],
});

export default function HomeContent() {
  const [isVisible, setIsVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const timer = setTimeout(() => setCardsVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const cardItems = [
    {
      image: "/images/card/cardSample.jpg",
      description:
        "Patient Management: Keep all patient records organized and accessible, so you can provide personalized care without the clutter.",
    },
    {
      image: "/images/card/card1.jpg",
      description:
        "Prescription Tracking: Create, update, and manage prescriptions digitally, reducing errors and saving time.",
    },
    {
      image: "/images/card/card3.jpg",
      description:
        "Analytics & Reports: Gain insights into patient trends and treatment outcomes to make informed decisions faster.",
    },
  ];

  return (
    <>
      <Navbar />

      <div className="flex flex-col">
        {/* Hero Section */}
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex flex-col items-center justify-center px-4 py-24 md:py-20">
          <div
            className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${
              isVisible
                ? "translate-y-0 opacity-100"
                : "translate-y-8 opacity-0"
            }`}
          >
            <div className="inline-block mb-4">
              <span className="text-sm md:text-base font-medium text-gray-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
                Download now
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl text-gray-900 font-bold mb-6 leading-tight">
              Streamline Patient Care,{" "}
              <span className="text-[#5A9B5A] relative">
                Effortlessly
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="8"
                  viewBox="0 0 200 8"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1 5.5C50 1.5 150 1.5 199 5.5"
                    stroke="#5A9B5A"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-draw-line"
                  />
                </svg>
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Transform your healthcare practice with our comprehensive patient
              management solution
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <button
                className="group flex items-center bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
                style={{
                  fontFamily:
                    "-apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Helvetica Neue', Arial, sans-serif",
                }}
              >
                <img
                  src="/images/logo/appstore.png"
                  alt="App Store"
                  className="mr-3 w-7 h-auto transition-transform group-hover:scale-110"
                />
                <div className="flex flex-col items-start leading-tight text-left">
                  <span className="text-[10px] opacity-90">Download on the</span>
                  <span className="text-sm font-semibold">App Store</span>
                </div>
              </button>

              <button
                className={`group flex items-center bg-black text-white rounded-xl px-6 py-3 hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${roboto.className}`}
              >
                <Image
                  src="/images/logo/playstore.png"
                  alt="Google Play"
                  width={28}
                  height={28}
                  className="mr-3 transition-transform group-hover:scale-110"
                />
                <div className="flex flex-col items-start leading-tight text-left">
                  <span className="text-[10px] opacity-90">Get it on</span>
                  <span className="text-sm font-semibold">Google Play</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-green-700 via-green-600 to-green-700 px-4 py-16 md:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Section Header */}
            <div
              className={`text-center mb-10 md:mb-14 transition-all duration-1000 transform ${
                cardsVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
            >
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">
                Powerful Features for Modern Healthcare
              </h2>
              <p className="text-green-50 text-sm md:text-base max-w-2xl mx-auto">
                Everything you need to manage your practice efficiently in one place
              </p>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {cardItems.map((item, index) => (
                <div
                  key={index}
                  className={`transition-all duration-700 transform ${
                    cardsVisible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-12 opacity-0"
                  }`}
                  style={{
                    transitionDelay: `${index * 150}ms`,
                  }}
                >
                  <div className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 h-full flex flex-col">
                    {/* Image Container */}
                    <div className="relative h-48 overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={`Feature ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Content */}
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="flex items-start mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 flex-shrink-0 group-hover:bg-green-600 transition-colors duration-300">
                          <span className="text-green-600 text-xl font-bold group-hover:text-white transition-colors duration-300">
                            {index + 1}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                          {item.description.split(":")[0]}
                        </h3>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description.split(":")[1]}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Section */}
            <div
              className={`mt-12 text-center transition-all duration-1000 transform ${
                cardsVisible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: "600ms" }}
            >
              <p className="text-white text-lg mb-4 font-medium">
                Ready to transform your practice?
              </p>
              <button className="bg-white text-green-700 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                Get Started Today
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes draw-line {
          from {
            stroke-dasharray: 200;
            stroke-dashoffset: 200;
          }
          to {
            stroke-dasharray: 200;
            stroke-dashoffset: 0;
          }
        }

        .animate-draw-line {
          animation: draw-line 1.5s ease-out forwards;
          animation-delay: 0.5s;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
        }
      `}</style>
    </>
  );
}