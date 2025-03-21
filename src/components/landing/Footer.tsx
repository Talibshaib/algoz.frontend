"use client";

import React from "react";
import { Link } from "@nextui-org/react";
import { Facebook, Twitter, Instagram, Github, ChevronRight } from 'lucide-react';
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
    <footer className="py-16 bg-gray-900 text-gray-300 border-t border-gray-800 relative overflow-hidden">
      {/* Animated background dots/circles */}
      <div className="absolute inset-0 opacity-5">
        {Array.from({ length: 20 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-orange-500 to-amber-600"
            style={{
              width: `${Math.random() * 8 + 2}rem`,
              height: `${Math.random() * 8 + 2}rem`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3 + 0.1,
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About Us Column */}
          <div>
            <h3 className="text-xl font-bold mb-4 text-white">About AlgoZ</h3>
            <p className="text-gray-400 mb-4">
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
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">MORE LINKS</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/community" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Community</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/youtube" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Youtube Channel</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/indicator-request" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Indicator Request</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/resources" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Resources</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* PAGES Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">PAGES</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/privacy-policy" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/disclaimer" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Disclaimer Policy</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/terms" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
              <li>
                <Link 
                  href="/cookies" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Cookies Policy</span>
                </Link>
              </li>
            </ul>
          </div>
          
          {/* CONNECT WITH US Column */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-white">CONNECT WITH US</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-gray-400 mb-1">Channel:</p>
                <Link 
                  href="/channel" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>AlgoZ Channel</span>
                </Link>
              </li>
              <li>
                <p className="text-gray-400 mb-1">Telegram Chat:</p>
                <Link 
                  href="/chat" 
                  className="text-gray-400 hover:text-white transition-colors flex items-center"
                >
                  <ChevronRight size={16} className="mr-1 text-orange-500" />
                  <span>Chat Now</span>
                </Link>
              </li>
              
              {/* Social Media Icons */}
              <li className="pt-4">
                <p className="text-gray-400 mb-2">Follow us:</p>
                <div className="flex space-x-3">
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    <Facebook size={20} />
                  </Link>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    <Twitter size={20} />
                  </Link>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    <Instagram size={20} />
                  </Link>
                  <Link href="/" className="text-gray-400 hover:text-white transition-colors">
                    <Github size={20} />
                  </Link>
                </div>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Disclaimer Section */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <p className="text-sm text-gray-400 text-center leading-relaxed max-w-4xl mx-auto">
            <span className="font-bold text-gray-500">Disclaimer:</span> Futures, stocks, and options trading carry a significant risk of loss and may not be suitable for all investors. At algoz.com, we 
            solely provide automation trading tools and a strategy marketplace; we do not offer trading buy or sell signals, recommendations, or any form of 
            investment advisory services. The use of our trading strategies is at your own risk, and algoz.com cannot be held responsible for any losses incurred 
            during their implementation. We advise users to exercise caution and perform their due diligence before engaging in any trading activities.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="mb-10">
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
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} AlgoZ. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/privacy-policy" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms
            </Link>
            <Link href="/cookies" className="text-gray-400 hover:text-white text-sm transition-colors">
              Cookies
            </Link>
            <Link href="/sitemap" className="text-gray-400 hover:text-white text-sm transition-colors">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
