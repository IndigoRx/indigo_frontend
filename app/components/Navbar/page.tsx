"use client";

import React, { useState, useEffect, useRef } from "react";
import WhiteButton from "../SubComponents/whiteButton";
import GreenButton from "../SubComponents/GreenButton";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        panelRef.current?.contains(target) ||
        toggleBtnRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/articles", label: "Articles" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav className="bg-white/95 backdrop-blur-sm shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center space-x-10">
              <a href="/" className="text-3xl font-bold text-green-700">
                IndigoRx
              </a>

              <div className="hidden md:flex space-x-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="text-gray-700 font-medium hover:text-green-700 transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <WhiteButton href="/login" buttonName="Login" />
              <GreenButton href="/register" buttonName="Sign up" />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              ref={toggleBtnRef}
              className="md:hidden p-2 rounded-md text-gray-800 hover:text-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
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
      </nav>

      {/* Mobile Menu Panel */}
      <div
        ref={panelRef}
        className={`md:hidden absolute left-0 right-0 bg-white shadow-lg transition-all duration-300 ease-in-out ${
          open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
        aria-hidden={!open}
      >
        <div className="px-4 py-4 space-y-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="block px-3 py-2 rounded-md text-base font-medium text-gray-800 hover:bg-gray-100 hover:text-green-700 transition-colors"
            >
              {link.label}
            </a>
          ))}

          <div className="pt-4 border-t border-gray-200 mt-4 space-y-2">
            <a
              href="/login"
              className="block w-full px-4 py-2 rounded-md text-center bg-white border border-green-600 text-green-600 font-medium hover:bg-green-50 transition-colors"
            >
              Login
            </a>
            <a
              href="/register"
              className="block w-full px-4 py-2 rounded-md text-center bg-green-600 text-white font-medium hover:bg-green-700 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}