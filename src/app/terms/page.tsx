"use client";

import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Agreement to Terms</h2>
            <p className="mb-4">
              These Terms and Conditions constitute a legally binding agreement made between you and AlgoZ, 
              concerning your access to and use of the website as well as any other media form, media channel, 
              mobile website or mobile application related, linked, or otherwise connected thereto.
            </p>
            <p className="mb-4">
              You agree that by accessing the Site, you have read, understood, and agree to be bound by all of these 
              Terms and Conditions. If you do not agree with all of these Terms and Conditions, then you are expressly 
              prohibited from using the Site and you must discontinue use immediately.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Intellectual Property Rights</h2>
            <p className="mb-4">
              Unless otherwise indicated, the Site is our proprietary property and all source code, databases, 
              functionality, software, website designs, audio, video, text, photographs, and graphics on the Site 
              (collectively, the "Content") and the trademarks, service marks, and logos contained therein 
              (the "Marks") are owned or controlled by us or licensed to us, and are protected by copyright and 
              trademark laws and various other intellectual property rights.
            </p>
            <p className="mb-4">
              The Content and the Marks are provided on the Site "AS IS" for your information and personal use only. 
              Except as expressly provided in these Terms and Conditions, no part of the Site and no Content or Marks 
              may be copied, reproduced, aggregated, republished, uploaded, posted, publicly displayed, encoded, 
              translated, transmitted, distributed, sold, licensed, or otherwise exploited for any commercial purpose 
              whatsoever, without our express prior written permission.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">User Representations</h2>
            <p className="mb-4">
              By using the Site, you represent and warrant that:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>All registration information you submit will be true, accurate, current, and complete.</li>
              <li>You will maintain the accuracy of such information and promptly update such registration information as necessary.</li>
              <li>You have the legal capacity and you agree to comply with these Terms and Conditions.</li>
              <li>You are not a minor in the jurisdiction in which you reside.</li>
              <li>You will not access the Site through automated or non-human means, whether through a bot, script or otherwise.</li>
              <li>You will not use the Site for any illegal or unauthorized purpose.</li>
              <li>Your use of the Site will not violate any applicable law or regulation.</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">User Registration</h2>
            <p className="mb-4">
              You may be required to register with the Site. You agree to keep your password confidential and 
              will be responsible for all use of your account and password. We reserve the right to remove, 
              reclaim, or change a username you select if we determine, in our sole discretion, that such 
              username is inappropriate, obscene, or otherwise objectionable.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Prohibited Activities</h2>
            <p className="mb-4">
              You may not access or use the Site for any purpose other than that for which we make the Site available. 
              The Site may not be used in connection with any commercial endeavors except those that are specifically 
              endorsed or approved by us.
            </p>
            <p className="mb-4">
              As a user of the Site, you agree not to:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Systematically retrieve data or other content from the Site to create or compile, directly or indirectly, a collection, compilation, database, or directory without written permission from us.</li>
              <li>Make any unauthorized use of the Site, including collecting usernames and/or email addresses of users by electronic or other means for the purpose of sending unsolicited email, or creating user accounts by automated means or under false pretenses.</li>
              <li>Use the Site to advertise or offer to sell goods and services.</li>
              <li>Circumvent, disable, or otherwise interfere with security-related features of the Site.</li>
              <li>Engage in unauthorized framing of or linking to the Site.</li>
              <li>Trick, defraud, or mislead us and other users, especially in any attempt to learn sensitive account information such as user passwords.</li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Modifications and Interruptions</h2>
            <p className="mb-4">
              We reserve the right to change, modify, or remove the contents of the Site at any time or for any reason 
              at our sole discretion without notice. We also reserve the right to modify or discontinue all or part of 
              the Site without notice at any time.
            </p>
            <p className="mb-4">
              We will not be liable to you or any third party for any modification, price change, suspension, or 
              discontinuance of the Site.
            </p>
            <p className="mb-4">
              We cannot guarantee the Site will be available at all times. We may experience hardware, software, 
              or other problems or need to perform maintenance related to the Site, resulting in interruptions, delays, 
              or errors. We reserve the right to change, revise, update, suspend, discontinue, or otherwise modify the 
              Site at any time or for any reason without notice to you.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 