"use client";

import React from "react";
import { Link } from "@nextui-org/react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Disclaimer Policy</h1>
          
          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Trading Risk Disclaimer</h2>
            <p className="mb-4">
              Futures, stocks, and options trading carry a significant risk of loss and may not be suitable for all investors. 
              At algoz.com, we solely provide automation trading tools and a strategy marketplace; we do not offer trading buy 
              or sell signals, recommendations, or any form of investment advisory services.
            </p>
            <p className="mb-4">
              The use of our trading strategies is at your own risk, and algoz.com cannot be held responsible for any losses 
              incurred during their implementation. We advise users to exercise caution and perform their due diligence before 
              engaging in any trading activities.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">No Investment Advice</h2>
            <p className="mb-4">
              The information provided on AlgoZ is for general informational purposes only and should not be construed as 
              investment advice. We do not provide personalized investment recommendations or act as a financial advisor.
            </p>
            <p className="mb-4">
              Any decisions you make regarding investments, trading strategies, or financial matters should be based on your 
              own research, judgment, and consultation with qualified financial professionals.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Third-Party Content</h2>
            <p className="mb-4">
              AlgoZ may include content, tools, or strategies created by third parties. We do not endorse, guarantee, or 
              assume responsibility for any third-party content available through our platform.
            </p>
            <p className="mb-4">
              Users should evaluate all information, opinions, and strategies critically before implementation.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm mb-8">
            <h2 className="text-xl font-semibold mb-4">Past Performance</h2>
            <p className="mb-4">
              Past performance of any trading strategy, algorithm, or system is not indicative of future results. 
              The financial markets are inherently unpredictable, and no trading system can guarantee profits.
            </p>
            <p className="mb-4">
              Any examples, demonstrations, or simulations of trading strategies shown on our platform represent 
              historical data and should not be interpreted as a promise or guarantee of future performance.
            </p>
          </div>

          <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">User Responsibility</h2>
            <p className="mb-4">
              By using AlgoZ, you acknowledge and agree that you are solely responsible for your trading decisions 
              and any resulting financial outcomes. You should only invest or risk money that you can afford to lose.
            </p>
            <p className="mb-4">
              We strongly recommend consulting with a qualified financial advisor before making any investment decisions, 
              especially if you are inexperienced in trading or unfamiliar with the financial markets.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
} 