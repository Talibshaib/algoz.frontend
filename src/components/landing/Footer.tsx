import React from "react";
import { Link } from "@nextui-org/react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="py-12 bg-black text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About Us Column */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">About Us AlgoZ</h3>
            <p className="text-gray-300 text-sm mb-4">
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
            <h3 className="text-xl font-bold mb-4">MORE LINK</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/community" className="text-gray-300 hover:text-white text-sm">
                  Community
                </Link>
              </li>
              <li>
                <Link href="/youtube" className="text-gray-300 hover:text-white text-sm">
                  Youtube Channel
                </Link>
              </li>
              <li>
                <Link href="/indicator-request" className="text-gray-300 hover:text-white text-sm">
                  Indicator Request
                </Link>
              </li>
              <li>
                <Link href="/resources" className="text-gray-300 hover:text-white text-sm">
                  Resource
                </Link>
              </li>
            </ul>
          </div>

          {/* PAGES Column */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">PAGES</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy-policy" className="text-gray-300 hover:text-white text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="text-gray-300 hover:text-white text-sm">
                  Disclaimer Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-300 hover:text-white text-sm">
                  Term Of condition
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-300 hover:text-white text-sm">
                  Cookies Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* MORE LINK (Second Column) */}
          <div className="col-span-1">
            <h3 className="text-xl font-bold mb-4">MORE LINK</h3>
            <ul className="space-y-2">
              <li>
                <p className="text-gray-300 text-sm mb-1">Group:</p>
                <Link href="/group" className="text-blue-400 hover:text-blue-300 text-sm">
                  AlgoZ Group
                </Link>
              </li>
              <li>
                <p className="text-gray-300 text-sm mb-1">Channel:</p>
                <Link href="/channel" className="text-blue-400 hover:text-blue-300 text-sm">
                  AlgoZ Channel
                </Link>
              </li>
              <li>
                <p className="text-gray-300 text-sm mb-1">Telegram Chat:</p>
                <Link href="/chat" className="text-blue-400 hover:text-blue-300 text-sm">
                  Chat Now
                </Link>
              </li>
              <li>
                <p className="text-gray-300 text-sm mb-1">Contact Us:</p>
                <Link href="/contact" className="text-blue-400 hover:text-blue-300 text-sm">
                  Visit Here
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer Section */}
        <div className="border-t border-gray-700 pt-6 mb-8">
          <p className="text-sm text-gray-300 text-center">
            <span className="font-bold">Disclaimer:</span> Futures, stocks, and options trading carry a significant risk of loss and may not be suitable for all investors. At algoz.com, we 
            solely provide automation trading tools and a strategy marketplace; we do not offer trading buy or sell signals, recommendations, or any form of 
            investment advisory services. The use of our trading strategies is at your own risk, and algoz.com cannot be held responsible for any losses incurred 
            during their implementation. We advise users to exercise caution and perform their due diligence before engaging in any trading activities.
          </p>
        </div>

        {/* Payment Methods */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4 mb-8">
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">VISA</span>
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">MasterCard</span>
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">PayPal</span>
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">RuPay</span>
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">G Pay</span>
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">Paytm</span>
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">PhonePe</span>
          </div>
          <div className="bg-white p-2 rounded flex items-center justify-center">
            <span className="text-black font-bold text-xs">BHIM</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-sm text-gray-400">© 2024 AlgoZ.com All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
