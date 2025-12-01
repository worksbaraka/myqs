"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show only if user hasn't made a choice yet
    if (!localStorage.getItem("cookie-consent")) {
      setShow(true);
    }
  }, []);

  const acceptAll = () => {
    localStorage.setItem("cookie-consent", "all");
    setShow(false);
  };

  const rejectNonEssential = () => {
    localStorage.setItem("cookie-consent", "essential");
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-8 md:right-auto md:max-w-md z-50 animate-in slide-in-from-bottom">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6">
        <div className="flex items-start gap-4">
          <div className="text-3xl flex-shrink-0">Cookie</div>

          <div className="flex-1">
            <p className="text-gray-800 font-medium">
              We use cookies to enhance your experience.
            </p>
            <p className="text-sm text-gray-600 mt-1">
              We use Google Analytics and Google AdSense. More info in our{" "}
              <Link href="/privacy-policy" className="underline hover:text-blue-900">
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <Link
            href="/privacy-policy"
            className="text-center text-sm text-gray-600 underline hover:text-gray-900 order-3 sm:order-none"
          >
            Cookie settings
          </Link>

          <button
            onClick={rejectNonEssential}
            className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
          >
            Reject
          </button>

          <button
            onClick={acceptAll}
            className="px-6 py-2.5 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition font-medium shadow-md"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}