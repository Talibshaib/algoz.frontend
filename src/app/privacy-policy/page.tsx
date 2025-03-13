"use client";

import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="mb-4">
              At AlgoZ, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, 
              and safeguard your information when you visit our website and use our services.
            </p>
            <p className="mb-4">
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the site.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
            <p className="mb-4">
              We may collect personal information that you voluntarily provide to us when you register on the website, 
              express interest in obtaining information about us or our products and services, or otherwise contact us.
            </p>
            <p className="mb-4">
              The personal information that we collect depends on the context of your interactions with us and the website, 
              the choices you make, and the products and features you use. The personal information we collect may include:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Name and contact data</li>
              <li>Credentials (password and similar security information)</li>
              <li>Payment data</li>
              <li>Usage data and preferences</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <p className="mb-4">
              We use personal information collected via our website for a variety of business purposes described below:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>To provide and maintain our service</li>
              <li>To notify you about changes to our service</li>
              <li>To allow you to participate in interactive features of our service</li>
              <li>To provide customer support</li>
              <li>To gather analysis or valuable information so that we can improve our service</li>
              <li>To monitor the usage of our service</li>
              <li>To detect, prevent and address technical issues</li>
              <li>To fulfill any other purpose for which you provide it</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Disclosure of Your Information</h2>
            <p className="mb-4">
              We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>By Law or to Protect Rights: If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.</li>
              <li>Third-Party Service Providers: We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</li>
              <li>Marketing Communications: With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes.</li>
              <li>Business Transfers: We may share or transfer your information in connection with, or during negotiations of, any merger, sale of company assets, financing, or acquisition of all or a portion of our business to another company.</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Security of Your Information</h2>
            <p className="mb-4">
              We use administrative, technical, and physical security measures to help protect your personal information. 
              While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
              that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission 
              can be guaranteed against any interception or other type of misuse.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="mb-4">
              If you have questions or comments about this Privacy Policy, please contact us at:
            </p>
            <p>
              Email: privacy@algoz.com<br />
              Phone: +91 88981-35037
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 