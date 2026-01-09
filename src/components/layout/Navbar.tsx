"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { NAV_ITEMS } from "@/utils/constants";
import { appConfig } from "@/config/app";
import { cn } from "@/utils/cn";
import Logo from "@/components/common/Logo";
import { useUserAuth } from "@/hooks/useUserAuth";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, loading, logout, isAuthenticated } = useUserAuth();

  return (
    <nav
      className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm"
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            <Logo variant="dark" width={50} height={50} className="h-10 w-10 sm:h-12 sm:w-12" />
            <span className="hidden sm:inline text-lg font-bold text-gray-900">
              {appConfig.shortName}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors duration-200"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Login/User Menu */}
            <div className="ml-4 flex items-center space-x-2">
              {!loading && (
                <>
                  {isAuthenticated && user ? (
                    <div className="flex items-center space-x-3">
                      <Link
                        href="/profile"
                        className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors duration-200"
                      >
                        {user.firstName || "Profile"}
                      </Link>
                      <button
                        onClick={logout}
                        className="px-4 py-2 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors duration-200"
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <Link
                      href="/login"
                      className="px-4 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium transition-colors duration-200"
                    >
                      Login
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg
              className="h-6 w-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
            isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-4 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Mobile Login/User Menu */}
            {!loading && (
              <div className="px-4 py-2 border-t border-gray-200 mt-2">
                {isAuthenticated && user ? (
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block px-4 py-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors duration-200"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {user.fullName || "Profile"}
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setIsMenuOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 rounded-lg text-gray-700 hover:text-primary-600 hover:bg-primary-50 font-medium transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="block px-4 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 font-medium transition-colors duration-200 text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

