"use client";

import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { Button } from "@nextui-org/react";
import { Mail } from "lucide-react";
import { 
  MotionDiv, 
  MotionH1, 
  MotionP 
} from "@/components/ui/motion";

export default function CareersPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow flex items-center justify-center bg-gray-50">
        <div className="container mx-auto px-4 py-24 text-center">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto"
          >
            <MotionH1 
              className="text-5xl md:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
            >
              Careers at AlgoZ
            </MotionH1>
            
            <MotionDiv
              className="relative mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.5 }}
            >
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gray-50 px-4 text-lg text-gray-500">Coming Soon</span>
              </div>
            </MotionDiv>
            
            <MotionP 
              className="text-xl text-gray-600 mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.7 }}
            >
              We're building our careers page and will be posting exciting opportunities soon. 
              Join our talented team in revolutionizing the world of algorithmic trading.
            </MotionP>
            
            <MotionDiv
              className="bg-white p-8 rounded-lg shadow-md mb-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.9 }}
            >
              <h2 className="text-2xl font-bold mb-4">Get Notified About Job Openings</h2>
              <p className="text-gray-600 mb-6">
                Leave your email and we'll let you know when we start hiring for positions that match your skills and interests.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    className="bg-black text-white"
                    endContent={<Mail className="h-4 w-4" />}
                  >
                    Notify Me
                  </Button>
                </MotionDiv>
              </div>
            </MotionDiv>
            
            <MotionDiv
              className="text-gray-500 text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 1.1 }}
            >
              <p>
                In the meantime, follow us on social media to stay updated on company news and announcements.
              </p>
            </MotionDiv>
          </MotionDiv>
        </div>
      </main>
      
      {/* Animated background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <MotionDiv 
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-100 rounded-full opacity-20"
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <MotionDiv 
          className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-purple-100 rounded-full opacity-20"
          animate={{ 
            x: [0, -70, 0],
            y: [0, 50, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <MotionDiv 
          className="absolute top-2/3 right-1/3 w-48 h-48 bg-green-100 rounded-full opacity-20"
          animate={{ 
            x: [0, 60, 0],
            y: [0, -40, 0],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>
      
      <Footer />
    </div>
  );
} 