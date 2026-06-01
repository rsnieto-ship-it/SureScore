"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, LogIn, ClipboardCheck, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Home", href: "/" },
  {
    label: "Solutions",
    href: "/services",
    children: [
      { label: "AI Tutors", href: "/services/ai-tutor" },
      { label: "TIA Data Platform", href: "/services/tia-platform" },
      { label: "District Partnership", href: "/services/district-partnership" },
      { label: "Strategy of the Day", href: "/services/strategy-of-the-day" },
    ],
  },
  { label: "Newsletter", href: "/newsletter" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <Container>
          <nav className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-[var(--primary-800)]">
                SURESCORE
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navigation.map((item) => (
                <div key={item.label} className="relative group">
                  {item.children ? (
                    <>
                      <button
                        className="flex items-center gap-1 text-gray-700 hover:text-[var(--primary-500)] font-medium transition-colors"
                        onMouseEnter={() => setServicesOpen(true)}
                        onMouseLeave={() => setServicesOpen(false)}
                      >
                        {item.label}
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <div
                        className={cn(
                          "absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200"
                        )}
                        onMouseEnter={() => setServicesOpen(true)}
                        onMouseLeave={() => setServicesOpen(false)}
                      >
                        <div className="bg-white rounded-xl shadow-lg border border-gray-100 py-2 min-w-[220px]">
                          {item.children.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="block px-4 py-2 text-gray-700 hover:bg-[var(--primary-50)] hover:text-[var(--primary-500)] transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="text-gray-700 hover:text-[var(--primary-500)] font-medium transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/contact" className="inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] text-sm px-4 py-2">
                Request Demo
              </Link>
              <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)}>
                <LogIn className="w-4 h-4 mr-1.5" />
                Log In
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </nav>
        </Container>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-100">
            <Container>
              <div className="py-4 space-y-2">
                {navigation.map((item) => (
                  <div key={item.label}>
                    {item.children ? (
                      <div>
                        <button
                          className="flex items-center justify-between w-full py-2 text-gray-700 font-medium"
                          onClick={() => setServicesOpen(!servicesOpen)}
                        >
                          {item.label}
                          <ChevronDown
                            className={cn(
                              "w-4 h-4 transition-transform",
                              servicesOpen && "rotate-180"
                            )}
                          />
                        </button>
                        {servicesOpen && (
                          <div className="pl-4 space-y-2">
                            {item.children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block py-2 text-gray-600 hover:text-[var(--primary-500)]"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className="block py-2 text-gray-700 font-medium hover:text-[var(--primary-500)]"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
                <div className="pt-4 space-y-2">
                  <Link href="/contact" className="block w-full inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 bg-[var(--primary-500)] text-white hover:bg-[var(--primary-600)] px-6 py-3 text-center">
                    Request Demo
                  </Link>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginOpen(true);
                    }}
                  >
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Student & Teacher Log In
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        )}
      </header>

      {/* Login Modal — Two Panel Layout */}
      {loginOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setLoginOpen(false)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Close button */}
          <button
            onClick={() => setLoginOpen(false)}
            className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal card */}
          <div
            className="relative max-w-2xl w-full mx-4 rounded-3xl overflow-hidden bg-white shadow-2xl ring-1 ring-black/5 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="px-8 pt-10 pb-6 text-center">
              <h2 className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900">
                Welcome back
              </h2>
              <p className="mt-2 text-sm text-gray-500">
                Choose where you&apos;d like to log in.
              </p>
            </div>

            {/* Two Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 px-8 pb-10">
              {/* Option 1: TIA */}
              <a
                href="https://tia.surescore.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center text-center rounded-2xl border border-gray-200 p-8 transition-all duration-200 hover:border-[var(--primary-300)] hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => setLoginOpen(false)}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[var(--primary-100)] to-[var(--primary-200)] text-[var(--primary-600)] transition-all duration-200 group-hover:from-[var(--primary-500)] group-hover:to-[var(--primary-600)] group-hover:text-white group-hover:shadow-md">
                  <ClipboardCheck className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-gray-900">
                  TIA Portal
                </h3>
                <p className="mt-1.5 text-sm text-gray-500">
                  <span className="block whitespace-nowrap">Teacher Incentive Allotment</span>
                  <span className="block">data platform</span>
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--primary-600)] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              </a>

              {/* Option 2: Test Prep */}
              <a
                href="https://prep.surescore.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex flex-col items-center text-center rounded-2xl border border-gray-200 p-8 transition-all duration-200 hover:border-[var(--secondary-300)] hover:shadow-lg hover:-translate-y-0.5"
                onClick={() => setLoginOpen(false)}
              >
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 bg-gradient-to-br from-[var(--secondary-100)] to-[var(--secondary-200)] text-[var(--secondary-600)] transition-all duration-200 group-hover:from-[var(--secondary-500)] group-hover:to-[var(--secondary-600)] group-hover:text-white group-hover:shadow-md">
                  <Zap className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold font-[family-name:var(--font-montserrat)] text-gray-900">
                  Test Prep
                </h3>
                <p className="mt-1.5 text-sm text-gray-500">
                  TSIA, SAT, ACT, and PSAT
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[var(--secondary-600)] opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0">
                  Continue <ArrowRight className="w-4 h-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
