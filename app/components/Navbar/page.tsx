"use client";

import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null); // <-- new ref

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node | null;
      // if click is inside panel OR inside the toggle button -> do nothing
      if (
        panelRef.current?.contains(target as Node) ||
        toggleBtnRef.current?.contains(target as Node)
      ) {
        return;
      }
      // otherwise close
      setOpen(false);
    };

    // listen to 'click' so the toggle button's React onClick runs predictably
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []); // run once

  return (
    <header className="bg-white ">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Logo + Links */}
          <div className="flex items-center space-x-6 ">
            <a href="#" className="text-3xl font-bold text-green-700 ">
              IndigoRx
            </a>

            {/* Desktop links */}
            <div className="hidden md:flex space-x-6 text-gray-700 font-medium ml-10">
              <a href="" className="hover:text-green-700 transition">Home</a>
              <a href="#" className="hover:text-green-700 transition">Articles</a>
              <a href="#" className="hover:text-green-700 transition">Contact</a>
               <a href="#" className="hover:text-green-700 transition">About</a>
            </div>
          </div>

          {/* Right: Buttons + Mobile Hamburger */}
          <div className="flex items-center space-x-3">
            {/* Desktop buttons */}
            <div className="hidden md:flex items-center space-x-3">
              <button className="px-4 py-2 rounded-md bg-white-700 text-green-700 hover:bg-green-700 hover:text-white transition">
                <Link href='/components/Login'>Login </Link>
              </button>
              <button className="px-4 py-2 rounded-md bg-green-700 text-white hover:bg-white hover:text-green-700 transition">
                Sign Up
              </button>
            </div>

            {/* Mobile: Hamburger */}
            <button
              ref={toggleBtnRef} // <-- attach ref here
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              aria-controls="mobile-menu"
              aria-expanded={open}
              onClick={() => setOpen((s) => !s)}
            >
              <span className="sr-only">Open menu</span>
              {open ? (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        id="mobile-menu"
        ref={panelRef}
        className={`md:hidden overflow-hidden transition-max-height duration-300 ease-in-out ${
          open ? "max-h-[500px]" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-4 space-y-2">
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            Home
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            About
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            Products
          </a>
          <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
            Contact
          </a>

          <div className="pt-2 border-t border-gray-200 mt-2 flex flex-col gap-2">
            <button className="w-full px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition">
              Login
            </button>
            <button className="w-full px-4 py-2 rounded-md bg-green-500 text-white hover:bg-green-600 transition">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
