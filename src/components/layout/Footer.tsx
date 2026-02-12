"use client";

import Link from "next/link";
import { Mail, Phone, MapPin, Facebook, Linkedin, Twitter } from "lucide-react";
import { Container } from "@/components/ui";

const footerLinks = {
  solutions: [
    { label: "Online Solutions", href: "/services/online-solutions" },
    { label: "Teacher Training", href: "/services/teacher-training" },
    { label: "Customizable Curriculum", href: "/services/customizable-curriculum" },
    { label: "District Partnership", href: "/services/district-partnership" },
    { label: "TIA Data Platform", href: "/services/tia-platform" },
    { label: "Strategy of the Day", href: "/services/strategy-of-the-day" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Results", href: "/results" },
    { label: "Contact", href: "/contact" },
  ],
  resources: [
    { label: "Resource Library", href: "/resources" },
    { label: "District Portal", href: "https://surescore.edis.io/Account/testlogon" },
    { label: "Request Demo", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <Container>
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold font-[family-name:var(--font-montserrat)] text-white">
                  SURESCORE
                </span>
              </Link>
              <p className="mt-4 text-gray-400 max-w-md">
                Partnering with Texas school districts since 1995 to boost CCMR ratings
                and get more students college ready through comprehensive solutions.
              </p>
              <div className="mt-6 space-y-3">
                <a
                  href="mailto:info@surescore.com"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  info@surescore.com
                </a>
                <a
                  href="tel:+18885458378"
                  className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  888-545-TEST (8378)
                </a>
                <div className="flex items-start gap-3 text-gray-400">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <span>4301 W Wm Cannon, Ste. B150, Austin, Texas 78749</span>
                </div>
              </div>
              {/* Social Media Icons */}
              <div className="mt-6 flex items-center gap-4">
                <a
                  href="https://www.facebook.com/surescore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[var(--primary-500)] hover:text-white transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/company/surescore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[var(--primary-500)] hover:text-white transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com/sabordesurescore"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-gray-400 hover:bg-[var(--primary-500)] hover:text-white transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Solutions Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Solutions</h3>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Company</h3>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-semibold text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                {footerLinks.resources.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("http") ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        href={link.href}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h3 className="font-semibold text-white mb-2">Stay Updated</h3>
                <p className="text-gray-400">
                  Subscribe to our newsletter for district resources and CCMR insights.
                </p>
              </div>
              <form className="flex gap-2 max-w-md w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[var(--primary-500)] focus:border-transparent"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-[var(--primary-500)] text-white font-semibold rounded-lg hover:bg-[var(--primary-600)] transition-colors"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} SureScore, Inc. All Rights Reserved.</p>
            <div className="flex gap-6">
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
