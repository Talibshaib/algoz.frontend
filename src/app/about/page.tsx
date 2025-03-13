"use client";

import React from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { Button } from "@nextui-org/react";
import { ArrowRight, Users, Target, Shield, Zap } from "lucide-react";
import { 
  MotionDiv, 
  MotionSection, 
  MotionH1, 
  MotionH2, 
  MotionP 
} from "@/components/ui/motion";

export default function AboutPage() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-grow">
        {/* Hero Section */}
        <MotionSection 
          className="py-16 md:py-24 bg-gray-50"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="container mx-auto px-4 text-center">
            <MotionH1 
              className="text-4xl md:text-5xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              About AlgoZ
            </MotionH1>
            <MotionP 
              className="text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              We're on a mission to democratize algorithmic trading and make it accessible to everyone.
            </MotionP>
          </div>
        </MotionSection>

        {/* Our Story Section */}
        <MotionSection 
          className="py-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <MotionH2 
                className="text-3xl font-bold mb-6 text-center"
                variants={itemFadeIn}
              >
                Our Story
              </MotionH2>
              <MotionDiv 
                className="space-y-4 text-gray-600"
                variants={itemFadeIn}
              >
                <p>
                  AlgoZ was founded in 2022 by a team of passionate traders and developers who believed that algorithmic trading shouldn't be limited to large financial institutions and hedge funds.
                </p>
                <p>
                  We recognized that while many traders had great strategies, they lacked the technical expertise to automate them. Similarly, many developers had the skills to build trading systems but lacked market knowledge.
                </p>
                <p>
                  Our platform bridges this gap by providing a user-friendly web-based application that operates through a unique Webhook system, enabling users to call and trigger various Public API methods without requiring deep technical knowledge.
                </p>
                <p>
                  Today, AlgoZ serves thousands of traders worldwide, from individual retail traders to professional fund managers, all using our platform to automate their trading strategies and improve their results.
                </p>
              </MotionDiv>
            </div>
          </div>
        </MotionSection>

        {/* Our Values Section */}
        <MotionSection 
          className="py-16 bg-gray-50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={staggerContainer}
        >
          <div className="container mx-auto px-4">
            <MotionH2 
              className="text-3xl font-bold mb-12 text-center"
              variants={itemFadeIn}
            >
              Our Values
            </MotionH2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <MotionDiv 
                className="bg-white p-6 rounded-lg shadow-sm"
                variants={itemFadeIn}
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Accessibility</h3>
                <p className="text-gray-600">
                  We believe trading tools should be accessible to everyone, regardless of technical background.
                </p>
              </MotionDiv>
              
              <MotionDiv 
                className="bg-white p-6 rounded-lg shadow-sm"
                variants={itemFadeIn}
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Transparency</h3>
                <p className="text-gray-600">
                  We're committed to clear, honest communication about our services, pricing, and performance.
                </p>
              </MotionDiv>
              
              <MotionDiv 
                className="bg-white p-6 rounded-lg shadow-sm"
                variants={itemFadeIn}
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Security</h3>
                <p className="text-gray-600">
                  We prioritize the security of your data and trading information with industry-leading practices.
                </p>
              </MotionDiv>
              
              <MotionDiv 
                className="bg-white p-6 rounded-lg shadow-sm"
                variants={itemFadeIn}
                whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              >
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We continuously improve our platform with cutting-edge technology and features.
                </p>
              </MotionDiv>
            </div>
          </div>
        </MotionSection>

        {/* CTA Section */}
        <MotionSection 
          className="py-16 bg-black text-white"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4 text-center">
            <MotionH2 
              className="text-3xl font-bold mb-4"
              variants={itemFadeIn}
            >
              Ready to transform your trading?
            </MotionH2>
            <MotionP 
              className="max-w-2xl mx-auto mb-8 text-gray-300"
              variants={itemFadeIn}
            >
              Join thousands of traders who are already using AlgoZ to automate their strategies and improve their results.
            </MotionP>
            <MotionDiv 
              variants={itemFadeIn}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="bg-white text-black hover:bg-gray-200"
                endContent={<ArrowRight className="h-4 w-4" />}
              >
                Get Started Today
              </Button>
            </MotionDiv>
          </div>
        </MotionSection>
      </main>
      <Footer />
    </div>
  );
} 