"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/landing/NavBar";
import Home from "@/components/landing/Home";
import Footer from "@/components/landing/Footer";
import { MotionDiv } from "@/components/ui/motion";
import { ArrowUp } from "lucide-react";

export default function Hero() {
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    // Simulate loading for a smoother experience
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    // Scroll to top button visibility
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <MotionDiv
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ 
            opacity: 1, 
            scale: [0.8, 1.2, 1],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop"
          }}
          className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent"
        >
          AlgoZ
        </MotionDiv>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <Home />
      <Footer />
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <MotionDiv
          className="fixed bottom-8 right-8 w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-full flex items-center justify-center z-50 cursor-pointer shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          whileHover={{ scale: 1.1, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
        >
          <ArrowUp className="h-5 w-5 text-white" />
        </MotionDiv>
      )}
    </>
  );
}
