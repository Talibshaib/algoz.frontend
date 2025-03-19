"use client";

import React from "react";
import { Link } from "@nextui-org/react";
import { MotionDiv } from "@/components/ui/motion";
import { SiPaytm } from "react-icons/si";
import { FaPhoneAlt } from "react-icons/fa";
import { CgPaypal } from "react-icons/cg";
import { FaGooglePay } from "react-icons/fa";
import { FaCcVisa } from "react-icons/fa";
import { FaCcMastercard } from "react-icons/fa";
import { FaRupeeSign } from "react-icons/fa";
import { SiBitcoinsv } from "react-icons/si";

const Footer = () => {
  return (
    <footer className="py-16 bg-gray-50 text-gray-800 border-t border-gray-100 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-white to-gray-50 z-0"></div>
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* About Us Column */}
          <MotionDiv 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 relative inline-block">
              About AlgoZ
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-orange-500 to-amber-600"></span>
            </h3>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              AlgoZ is a user-friendly web-based application that operates through a unique
              Webhook system, enabling users to call and trigger various Public API methods, including
              Post, Delete, and Get. This innovative platform functions as both a programming tool and a
              marketplace, providing a seamless experience for anyone to use AlgoZ without the need
              for coding or programming knowledge. Whether you are a seasoned developer or a non-technical
              user, AlgoZ opens up a world of possibilities for automating tasks and accessing
              APIs with ease.
            </p>
          </MotionDiv>

          {/* MORE LINK Column */}
          <MotionDiv 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 relative inline-block">
              MORE LINKS
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-orange-500 to-amber-600"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/community" 
                  className="text-gray-600 hover:text-orange-600 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Community
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/youtube" 
                  className="text-gray-600 hover:text-orange-600 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Youtube Channel
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/indicator-request" 
                  className="text-gray-600 hover:text-orange-600 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Indicator Request
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-gray-600 hover:text-orange-600 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Resources
                  </span>
                </Link>
              </li>
            </ul>
          </MotionDiv>

          {/* PAGES Column */}
          <MotionDiv 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 relative inline-block">
              PAGES
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-orange-500 to-amber-600"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-600 hover:text-orange-600 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Privacy Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/disclaimer" 
                  className="text-gray-600 hover:text-orange-600 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Disclaimer Policy
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-600 hover:text-orange-600 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Terms & Conditions
                  </span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-gray-600 hover:text-orange-600 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Cookies Policy
                  </span>
                </Link>
              </li>
            </ul>
          </MotionDiv>

          {/* CONNECT WITH US Column */}
          <MotionDiv 
            className="col-span-1"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-900 relative inline-block">
              CONNECT WITH US
              <span className="absolute -bottom-1 left-0 w-1/2 h-0.5 bg-gradient-to-r from-orange-500 to-amber-600"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <p className="text-gray-600 text-sm mb-1">Channel:</p>
                <Link 
                  href="/channel" 
                  className="text-orange-600 hover:text-orange-800 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    AlgoZ Channel
                  </span>
                </Link>
              </li>
              <li>
                <p className="text-gray-600 text-sm mb-1">Telegram Chat:</p>
                <Link 
                  href="/chat" 
                  className="text-orange-600 hover:text-orange-800 text-sm transition-colors duration-200 flex items-center"
                >
                  <span className="hover:translate-x-1 transition-transform duration-200 inline-block">
                    Chat Now
                  </span>
                </Link>
              </li>
              
              {/* Social Media Icons */}
              <li className="pt-4">
                <p className="text-gray-600 text-sm mb-2">Follow us:</p>
                <div className="flex space-x-3">
                  <MotionDiv whileHover={{ y: -3, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center hover:shadow-md transition-all duration-300">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                  </MotionDiv>
                  <MotionDiv whileHover={{ y: -3, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="w-8 h-8 bg-gradient-to-br from-amber-400 to-amber-500 rounded-full flex items-center justify-center hover:shadow-md transition-all duration-300">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                  </MotionDiv>
                  <MotionDiv whileHover={{ y: -3, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center hover:shadow-md transition-all duration-300">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </a>
                  </MotionDiv>
                  <MotionDiv whileHover={{ y: -3, scale: 1.1 }} transition={{ duration: 0.2 }}>
                    <a href="#" className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center hover:shadow-md transition-all duration-300">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                  </MotionDiv>
                </div>
              </li>
            </ul>
          </MotionDiv>
        </div>

        {/* Disclaimer Section */}
        <MotionDiv 
          className="border-t border-gray-200 pt-8 mb-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-gray-600 text-center leading-relaxed max-w-4xl mx-auto">
            <span className="font-bold text-gray-800">Disclaimer:</span> Futures, stocks, and options trading carry a significant risk of loss and may not be suitable for all investors. At algoz.com, we 
            solely provide automation trading tools and a strategy marketplace; we do not offer trading buy or sell signals, recommendations, or any form of 
            investment advisory services. The use of our trading strategies is at your own risk, and algoz.com cannot be held responsible for any losses incurred 
            during their implementation. We advise users to exercise caution and perform their due diligence before engaging in any trading activities.
          </p>
        </MotionDiv>

        {/* Payment Methods */}
        <MotionDiv 
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <p className="text-sm text-gray-500 text-center mb-4">ACCEPTED PAYMENT METHODS</p>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <FaCcVisa className="w-8 h-8 text-blue-600" />
                <span className="text-sm text-gray-600">Visa</span>
              </div>
              <div className="flex items-center gap-2">
                <FaCcMastercard className="w-8 h-8 text-red-500" />
                <span className="text-sm text-gray-600">Mastercard</span>
              </div>
              <div className="flex items-center gap-2">
                <SiPaytm className="w-8 h-8 text-blue-500" />
                <span className="text-sm text-gray-600">Paytm</span>
              </div>
              <div className="flex items-center gap-2">
                <CgPaypal className="w-8 h-8 text-blue-700" />
                <span className="text-sm text-gray-600">PayPal</span>
              </div>
              <div className="flex items-center gap-2">
                <FaGooglePay className="w-8 h-8 text-gray-700" />
                <span className="text-sm text-gray-600">Google Pay</span>
              </div>
              <div className="flex items-center gap-2">
                <SiBitcoinsv className="w-8 h-8 text-amber-500" />
                <span className="text-sm text-gray-600">Crypto</span>
              </div>
            </div>
          </div>
        </MotionDiv>

        {/* Bottom Footer */}
        <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500 mb-4 md:mb-0">
            © {new Date().getFullYear()} AlgoZ. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200">
              Terms
            </Link>
            <Link href="/cookies" className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200">
              Cookies
            </Link>
            <Link href="/sitemap" className="text-sm text-gray-500 hover:text-orange-600 transition-colors duration-200">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
