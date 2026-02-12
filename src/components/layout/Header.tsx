"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, LogIn, ClipboardCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui";
import { Container } from "@/components/ui";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Home", href: "/" },
  {
    label: "Solutions",
    href: "/services",
    children: [
      { label: "Online Solutions", href: "/services/online-solutions" },
      { label: "Teacher Training", href: "/services/teacher-training" },
      { label: "Customizable Curriculum", href: "/services/customizable-curriculum" },
      { label: "District Partnership", href: "/services/district-partnership" },
      { label: "TIA Data Platform", href: "/services/tia-platform" },
      { label: "Strategy of the Day", href: "/services/strategy-of-the-day" },
    ],
  },
  { label: "Results", href: "/results" },
  { label: "Resources", href: "/resources" },
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
              <Link href="/contact">
                <Button size="sm">Request Demo</Button>
              </Link>
              <button onClick={() => setLoginOpen(true)}>
                <Button variant="outline" size="sm" asChild>
                  <span>
                    <LogIn className="w-4 h-4 mr-1.5" />
                    Log In
                  </span>
                </Button>
              </button>
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
                  <Link href="/contact" className="block">
                    <Button className="w-full">Request Demo</Button>
                  </Link>
                  <button
                    className="w-full"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setLoginOpen(true);
                    }}
                  >
                    <Button variant="outline" className="w-full">
                      <LogIn className="w-4 h-4 mr-1.5" />
                      Student & Teacher Log In
                    </Button>
                  </button>
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

          {/* Two Panels */}
          <div
            className="relative grid grid-cols-1 md:grid-cols-2 max-w-3xl w-full mx-4 rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Panel 1: Take a Diagnostic */}
            <a
              href="https://surescore.edis.io/Account/testlogon"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-10 md:p-12 bg-white hover:bg-[var(--primary-50)] transition-all group text-center"
              onClick={() => setLoginOpen(false)}
            >
              <div className="w-20 h-20 bg-[var(--primary-100)] text-[var(--primary-500)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--primary-500)] group-hover:text-white transition-colors">
                <ClipboardCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 group-hover:text-[var(--primary-600)] transition-colors mb-2">
                Take a Diagnostic
              </h3>
              <p className="text-gray-500 text-sm">
                SAT, ACT, and TSIA2 assessments
              </p>
            </a>

            {/* Panel 2: Strategy of the Day */}
            <a
              href="https://sotd.surescore.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-10 md:p-12 bg-white hover:bg-[var(--secondary-50)] transition-all group text-center border-t md:border-t-0 md:border-l border-gray-200"
              onClick={() => setLoginOpen(false)}
            >
              <div className="w-20 h-20 bg-[var(--secondary-100)] text-[var(--secondary-500)] rounded-2xl flex items-center justify-center mb-6 group-hover:bg-[var(--secondary-500)] group-hover:text-white transition-colors">
                <Zap className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold font-[family-name:var(--font-montserrat)] text-gray-900 group-hover:text-[var(--secondary-600)] transition-colors mb-2">
                Strategy of the Day
              </h3>
              <p className="text-gray-500 text-sm">
                Daily TSIA2 test prep for your classroom
              </p>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
