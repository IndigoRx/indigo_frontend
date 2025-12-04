"use client";

import React, { useState, useEffect, useRef } from "react";
import WhiteButton from "../SubComponents/whiteButton";
import GreenButton from "../SubComponents/GreenButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      if (
        panelRef.current?.contains(target as Node) ||
        toggleBtnRef.current?.contains(target as Node)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="bg-white/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <a href="#" className="text-3xl font-bold text-green-700">
                IndigoRx
              </a>

              {/* Desktop links */}
              <div className="hidden md:flex space-x-6 text-gray-700 font-medium ml-10">
                <a href="/" className="hover:text-green-700 transition">
                  Home
                </a>
                <a href="#" className="hover:text-green-700 transition">
                  Articles
                </a>
                <a href="#" className="hover:text-green-700 transition">
                  Contact
                </a>
                <a
                  href="/components/About"
                  className="hover:text-green-700 transition"
                >
                  About
                </a>
              </div>
            </div>

            {/* Right: Buttons + Mobile Hamburger */}
            <div className="flex items-center space-x-3">
              {/* Desktop buttons */}
              <div className="hidden md:flex items-center space-x-3">

                <WhiteButton href="/components/Login" buttonName="Login" />
                <GreenButton href="/components/Register" buttonName="Sign up" />

                
              </div>

              {/* Mobile: Hamburger */}
              <button
                ref={toggleBtnRef}
                className={`md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200 ${
                  open
                    ? "text-green-700"
                    : "text-gray-800 hover:text-green-700"
                }`}
                aria-controls="mobile-menu"
                aria-expanded={open}
                onClick={() => setOpen((s) => !s)}
              >
                <span className="sr-only">Open menu</span>
                {open ? (
                  // Close icon (green when open)
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  // Hamburger icon (turns green on hover)
                  <svg
                    className="h-6 w-6"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`md:hidden absolute left-0 right-0 top-full z-40 overflow-hidden transition-[max-height] duration-300 ease-in-out bg-white shadow-md ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
        aria-hidden={!open}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          <a
            href="/"
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-300 transition"
          >
            Home
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-300 transition"
          >
            About
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-300 transition"
          >
            Products
          </a>
          <a
            href="#"
            className="block px-3 py-2 rounded-md text-base font-medium text-black hover:bg-gray-300 transition"
          >
            Contact
          </a>

          <div className="pt-2 border-t border-gray-700 mt-2 flex flex-col gap-2">
            <button className="w-full px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
              Login
            </button>
            <button className="w-full px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
