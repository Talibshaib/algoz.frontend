"use client";

import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function CookiesPolicyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Cookies Policy</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">What Are Cookies</h2>
            <p className="mb-4">
              As is common practice with almost all professional websites, AlgoZ uses cookies, which are tiny files 
              that are downloaded to your computer, to improve your experience. This page describes what information 
              they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you 
              can prevent these cookies from being stored, however, this may downgrade or 'break' certain elements of 
              the site's functionality.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">How We Use Cookies</h2>
            <p className="mb-4">
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry 
              standard options for disabling cookies without completely disabling the functionality and features they add 
              to this site. It is recommended that you leave on all cookies if you are not sure whether you need them or 
              not in case they are used to provide a service that you use.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">The Cookies We Set</h2>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-3">
                <p className="font-medium">Account related cookies</p>
                <p>If you create an account with us, we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out, however in some cases they may remain afterward to remember your site preferences when logged out.</p>
              </li>
              <li className="mb-3">
                <p className="font-medium">Login related cookies</p>
                <p>We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.</p>
              </li>
              <li className="mb-3">
                <p className="font-medium">Forms related cookies</p>
                <p>When you submit data through a form such as those found on contact pages or comment forms, cookies may be set to remember your user details for future correspondence.</p>
              </li>
              <li className="mb-3">
                <p className="font-medium">Site preferences cookies</p>
                <p>In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences, we need to set cookies so that this information can be called whenever you interact with a page that is affected by your preferences.</p>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Third-Party Cookies</h2>
            <p className="mb-4">
              In some special cases, we also use cookies provided by trusted third parties. The following section details 
              which third-party cookies you might encounter through this site.
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li className="mb-3">
                <p>This site uses Google Analytics which is one of the most widespread and trusted analytics solutions on the web for helping us to understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.</p>
              </li>
              <li className="mb-3">
                <p>From time to time, we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features, these cookies may be used to ensure that you receive a consistent experience whilst on the site whilst ensuring we understand which optimizations our users appreciate the most.</p>
              </li>
              <li className="mb-3">
                <p>We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways. For these to work, social media sites including Facebook, Twitter, and LinkedIn, will set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies.</p>
              </li>
            </ul>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">More Information</h2>
            <p className="mb-4">
              Hopefully, that has clarified things for you and as was previously mentioned if there is something that 
              you aren't sure whether you need or not it's usually safer to leave cookies enabled in case it does 
              interact with one of the features you use on our site.
            </p>
            <p className="mb-4">
              However, if you are still looking for more information, you can contact us through one of our preferred 
              contact methods:
            </p>
            <p>
              Email: cookies@algoz.com<br />
              Phone: +91 88981-35037
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 