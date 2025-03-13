"use client";

import React from "react";
import { Link } from "@nextui-org/react";
import { MotionDiv } from "@/components/ui/motion";
// import { SiPaytm } from "react-icons/si";
// import { FaPhoneAlt } from "react-icons/fa";
// import { CgPaypal } from "react-icons/cg";
// import { FaGooglePay } from "react-icons/fa";
// import { FaCcVisa } from "react-icons/fa";
// import { FaCcMastercard } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-16 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Us Column */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white">About AlgoZ</h3>
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              AlgoZ is a user-friendly web-based application that operates through a unique
              Webhook system, enabling users to call and trigger various Public API methods, including
              Post, Delete, and Get. This innovative platform functions as both a programming tool and a
              marketplace, providing a seamless experience for anyone to use AlgoZ without the need
              for coding or programming knowledge. Whether you are a seasoned developer or a non-technical
              user, AlgoZ opens up a world of possibilities for automating tasks and accessing
              APIs with ease.
            </p>
          </div>

          {/* MORE LINK Column */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white">MORE LINKS</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/community" 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Community
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/youtube" 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Youtube Channel
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/indicator-request" 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Indicator Request
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Resources
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* PAGES Column */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white">PAGES</h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/disclaimer" 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Disclaimer Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Terms & Conditions
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-gray-300 hover:text-white text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Cookies Policy
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* MORE LINK (Second Column) */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4 text-white">CONNECT WITH US</h3>
            <ul className="space-y-3">
              <li>
                <p className="text-gray-400 text-sm mb-1">Channel:</p>
                <Link 
                  href="/channel" 
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    AlgoZ Channel
                  </span>
                </Link>
              </li>
              <li>
                <p className="text-gray-400 text-sm mb-1">Telegram Chat:</p>
                <Link 
                  href="/chat" 
                  className="text-blue-400 hover:text-blue-300 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Chat Now
                  </span>
                </Link>
              </li>
              
              {/* Social Media Icons */}
              <li className="pt-4">
                <p className="text-gray-400 text-sm mb-2">Follow us:</p>
                <div className="flex space-x-3">
                  <MotionDiv whileHover={{ y: -3, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  </MotionDiv>
                  <MotionDiv whileHover={{ y: -3, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-sky-500 transition-colors duration-300">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </MotionDiv>
                  <MotionDiv whileHover={{ y: -3, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-300">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  </MotionDiv>
                  <MotionDiv whileHover={{ y: -3, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </MotionDiv>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-sm text-gray-400 text-center leading-relaxed max-w-4xl mx-auto">
            <span className="font-bold text-gray-300">Disclaimer:</span> Futures, stocks, and options trading carry a significant risk of loss and may not be suitable for all investors. At algoz.com, we 
            solely provide automation trading tools and a strategy marketplace; we do not offer trading buy or sell signals, recommendations, or any form of 
            investment advisory services. The use of our trading strategies is at your own risk, and algoz.com cannot be held responsible for any losses incurred 
            during their implementation. We advise users to exercise caution and perform their due diligence before engaging in any trading activities.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-10">
          {/* Payment method items with hover effect */}
          <MotionDiv whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.2 }}>
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">VISA</span>
            </div>
          </MotionDiv>
          <MotionDiv whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.2 }}>
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">MasterCard</span>
            </div>
          </MotionDiv>
          <MotionDiv whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.2 }}>
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">PayPal</span>
            </div>
          </MotionDiv>
          <MotionDiv whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.2 }}>
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">RuPay</span>
            </div>
          </MotionDiv>
          <MotionDiv whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.2 }}>
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">G Pay</span>
            </div>
          </MotionDiv>
          <MotionDiv whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.2 }}>
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">Paytm</span>
            </div>
          </MotionDiv>
          <MotionDiv whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.2 }}>
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">PhonePe</span>
            </div>
          </MotionDiv>
          <MotionDiv whileHover={{ y: -5, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }} transition={{ duration: 0.2 }}>
            <div className="bg-white p-2 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">BHIM</span>
            </div>
          </MotionDiv>
        </div>

        {/* Copyright */}
        <div className="text-center border-t border-gray-800 pt-6">
          <p className="text-sm text-gray-500">© 2024 AlgoZ.com All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
