"use client";

import { Button } from "@nextui-org/react"
import { Zap, BarChart2, MousePointer, ArrowRight } from "lucide-react"
import { 
  MotionDiv, 
  MotionSection, 
  MotionH1, 
  MotionH2, 
  MotionH3, 
  MotionP
} from "@/components/ui/motion"

export default function Home() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  const itemFadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5 }
    }
  }

  const scaleOnHover = {
    hover: { scale: 1.05, transition: { duration: 0.3 } }
  }

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <MotionSection 
        className="relative py-24 md:py-32 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 z-0"></div>
        
        {/* Animated Background Shapes */}
        <MotionDiv 
          className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 z-0"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 40, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <MotionDiv 
          className="absolute bottom-10 right-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 z-0"
          animate={{ 
            x: [0, -40, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 18, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <MotionDiv 
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 z-0"
          animate={{ 
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Content */}
        <div className="container mx-auto px-4 text-center relative z-10">
          <MotionDiv
            className="inline-block mb-3 px-4 py-1 rounded-full bg-black bg-opacity-5 backdrop-blur-sm border border-gray-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="text-sm font-medium text-gray-800">Revolutionizing Algorithmic Trading</span>
          </MotionDiv>
          
          <MotionH1 
            className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-900 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Algorithmic Trading <br /> Made Simple
          </MotionH1>
          
          <MotionP 
            className="text-gray-700 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Leverage advanced trading algorithms and copy successful strategies with our automated trading platform.
            Start maximizing your returns today.
          </MotionP>
          
          <MotionDiv 
            className="flex flex-col sm:flex-row gap-5 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <MotionDiv 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-6 h-12 text-base shadow-sm"
                endContent={<ArrowRight className="h-4 w-4 ml-1" />}
              >
                Start Copy Trading
              </Button>
            </MotionDiv>
            <MotionDiv 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} 
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="bordered" 
                className="border-gray-300 hover:bg-gray-50 font-medium px-8 py-6 h-12 text-base"
              >
                Browse Strategies
              </Button>
            </MotionDiv>
          </MotionDiv>
          
          {/* Trusted By Section */}
          <MotionDiv
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <p className="text-sm text-gray-500 mb-4">TRUSTED BY LEADING TRADING FIRMS</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-70">
              <img src="https://placehold.co/120x40/gray/white?text=TradeFirm" alt="Trading Firm" className="h-8" />
              <img src="https://placehold.co/120x40/gray/white?text=QuantCap" alt="Quant Capital" className="h-8" />
              <img src="https://placehold.co/120x40/gray/white?text=AlgoTrade" alt="Algo Trade" className="h-8" />
              <img src="https://placehold.co/120x40/gray/white?text=TechTrade" alt="Tech Trade" className="h-8" />
            </div>
          </MotionDiv>
        </div>
        
        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </MotionSection>

      {/* Stats Section */}
      <MotionSection 
        className="py-24 bg-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-white opacity-70"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-100 via-purple-100 to-blue-50"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <MotionDiv 
            className="text-center max-w-3xl mx-auto mb-16"
            variants={itemFadeIn}
          >
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-black bg-opacity-5 border border-gray-200">
              <span className="text-sm font-medium text-gray-800">OUR IMPACT</span>
            </div>
            <MotionH2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              variants={itemFadeIn}
            >
              Trading at Scale
            </MotionH2>
            <MotionP 
              className="text-gray-600 text-lg"
              variants={itemFadeIn}
            >
              Join thousands of traders who trust our platform for reliable, high-performance trading
            </MotionP>
          </MotionDiv>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <MotionH2 
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                $2.5B+
              </MotionH2>
              <p className="text-gray-700 font-medium">Trading Volume</p>
              <p className="text-sm text-gray-500 mt-1">Processed monthly</p>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <MotionH2 
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                50K+
              </MotionH2>
              <p className="text-gray-700 font-medium">Active Traders</p>
              <p className="text-sm text-gray-500 mt-1">From 30+ countries</p>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <MotionH2 
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                99.9%
              </MotionH2>
              <p className="text-gray-700 font-medium">Platform Uptime</p>
              <p className="text-sm text-gray-500 mt-1">Enterprise-grade reliability</p>
            </MotionDiv>
          </div>
          
          <MotionDiv 
            className="text-center mt-16"
            variants={itemFadeIn}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <MotionDiv 
              className="inline-flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-300 group"
              whileHover={{ x: 5 }}
            >
              <span className="mr-2 font-medium">View our performance metrics</span>
              <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Trading Solutions Section */}
      <MotionSection 
        className="py-20 bg-white relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        {/* Background Elements */}
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-purple-50 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <MotionDiv 
            className="text-center max-w-3xl mx-auto mb-16"
            variants={itemFadeIn}
          >
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-black bg-opacity-5 border border-gray-200">
              <span className="text-sm font-medium text-gray-800">PRICING PLANS</span>
            </div>
            <MotionH2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              variants={itemFadeIn}
            >
              Our Trading Solutions
            </MotionH2>
            <MotionP 
              className="text-gray-600 text-lg"
              variants={itemFadeIn}
            >
              Choose from our range of professional trading tools and services
            </MotionP>
          </MotionDiv>

          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* TradingView Integration */}
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col"
              variants={itemFadeIn}
              whileHover={{ y: -10, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">TradingView Integration</h3>
                <p className="text-gray-600 mb-4">
                  Seamlessly connect your TradingView charts and execute trades directly from the platform.
                </p>
              </div>
              
              <div className="text-3xl font-bold mb-6 text-blue-600">
                $49 <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Real-time data sync</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Custom indicators</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Automated trading</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">24/7 support</span>
                </li>
              </ul>
              
              <MotionDiv 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.97 }}
                className="mt-auto"
              >
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-6 h-12">
                  Get Started
                </Button>
              </MotionDiv>
            </MotionDiv>

            {/* Pine Script Strategies */}
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col relative"
              variants={itemFadeIn}
              whileHover={{ y: -10, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute top-0 right-0 mt-8 mr-8">
                <span className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">Popular</span>
              </div>
              
              <div className="mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Pine Script Strategies</h3>
                <p className="text-gray-600 mb-4">
                  Create a library of custom trading strategies or create your own using Pine Script.
                </p>
              </div>
              
              <div className="text-3xl font-bold mb-6 text-green-600">
                $79 <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Strategy library</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Backtesting tools</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Custom script editor</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Strategy optimization</span>
                </li>
              </ul>
              
              <MotionDiv 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.97 }}
                className="mt-auto"
              >
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-6 h-12">
                  Get Started
                </Button>
              </MotionDiv>
            </MotionDiv>

            {/* MQL Solutions */}
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-md border border-gray-100 flex flex-col"
              variants={itemFadeIn}
              whileHover={{ y: -10, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="mb-6">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">MQL Solutions</h3>
                <p className="text-gray-600 mb-4">
                  Professional MetaTrader integration with custom MQL4/5 expert advisors and indicators.
                </p>
              </div>
              
              <div className="text-3xl font-bold mb-6 text-purple-600">
                $99 <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              
              <ul className="space-y-3 mb-8 flex-grow">
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">MT4/MT5 Integration</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Custom EA development</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Indicator library</span>
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-5 h-5 mr-3 text-purple-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span className="text-gray-700">Priority support</span>
                </li>
              </ul>
              
              <MotionDiv 
                whileHover={{ scale: 1.03 }} 
                whileTap={{ scale: 0.97 }}
                className="mt-auto"
              >
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-6 h-12">
                  Get Started
                </Button>
              </MotionDiv>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Features Section */}
      <MotionSection 
        className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <MotionDiv 
            className="text-center max-w-3xl mx-auto mb-16"
            variants={itemFadeIn}
          >
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-black bg-opacity-5 border border-gray-200">
              <span className="text-sm font-medium text-gray-800">POWERFUL CAPABILITIES</span>
            </div>
            <MotionH2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              variants={itemFadeIn}
            >
              Powerful Trading Features
            </MotionH2>
            <MotionP 
              className="text-gray-600 text-lg"
              variants={itemFadeIn}
            >
              Experience the next generation of algorithmic trading with our cutting-edge features
            </MotionP>
          </MotionDiv>

          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={staggerContainer}
          >
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              variants={itemFadeIn}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <MotionDiv 
                className="flex justify-center mb-6"
                whileHover={{ rotate: 5 }}
              >
                <div className="p-4 rounded-full bg-blue-50 inline-block">
                  <MousePointer className="h-8 w-8 text-blue-600" />
                </div>
              </MotionDiv>
              <h3 className="text-xl font-bold mb-3 text-center">One-Click Trading</h3>
              <p className="text-gray-600 text-center">
                Execute trades instantly with our streamlined one-click trading interface. No more complex order forms.
              </p>
            </MotionDiv>

            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              variants={itemFadeIn}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <MotionDiv 
                className="flex justify-center mb-6"
                whileHover={{ rotate: 5 }}
              >
                <div className="p-4 rounded-full bg-green-50 inline-block">
                  <BarChart2 className="h-8 w-8 text-green-600" />
                </div>
              </MotionDiv>
              <h3 className="text-xl font-bold mb-3 text-center">Real-Time Metrics</h3>
              <p className="text-gray-600 text-center">
                Monitor your trading performance with live updates on key metrics, P&L, and portfolio analytics.
              </p>
            </MotionDiv>

            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              variants={itemFadeIn}
              whileHover={{ y: -8, boxShadow: "0 20px 40px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <MotionDiv 
                className="flex justify-center mb-6"
                whileHover={{ rotate: 5 }}
              >
                <div className="p-4 rounded-full bg-purple-50 inline-block">
                  <Zap className="h-8 w-8 text-purple-600" />
                </div>
              </MotionDiv>
              <h3 className="text-xl font-bold mb-3 text-center">Lightning Fast Execution</h3>
              <p className="text-gray-600 text-center">
                Experience ultra-low latency trade execution with our optimized trading infrastructure.
              </p>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv 
            className="text-center mt-14"
            variants={itemFadeIn}
          >
            <MotionDiv 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} 
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button 
                className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-6 h-12 text-base shadow-sm"
                endContent={<ArrowRight className="h-4 w-4 ml-1" />}
              >
                Explore All Features
              </Button>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Trusted Section */}
      <MotionSection 
        className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '20px 20px'
          }}></div>
        </div>
        
        {/* Decorative Elements */}
        <MotionDiv 
          className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ 
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <MotionDiv 
          className="absolute bottom-10 right-10 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
          animate={{ 
            x: [0, -30, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        
        <div className="container mx-auto px-4 relative z-10">
          <MotionDiv 
            className="text-center max-w-3xl mx-auto mb-16"
            variants={itemFadeIn}
          >
            <div className="inline-block mb-3 px-4 py-1 rounded-full bg-black bg-opacity-5 border border-gray-200">
              <span className="text-sm font-medium text-gray-800">TESTIMONIALS</span>
            </div>
            <MotionH2 
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent"
              variants={itemFadeIn}
            >
              Trusted by Traders Worldwide
            </MotionH2>
            <MotionP 
              className="text-gray-600 text-lg"
              variants={itemFadeIn}
            >
              Join thousands of successful traders who have transformed their trading experience with AlgoZ
            </MotionP>
          </MotionDiv>

          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
            variants={staggerContainer}
          >
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <MotionH3 
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                $2.5B+
              </MotionH3>
              <p className="text-gray-700 font-medium">Total Trading Volume</p>
              <p className="text-sm text-gray-500 mt-1">Processed in 2023</p>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <MotionH3 
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                50,000+
              </MotionH3>
              <p className="text-gray-700 font-medium">Active Traders</p>
              <p className="text-sm text-gray-500 mt-1">Worldwide</p>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
              </div>
              <MotionH3 
                className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                94%
              </MotionH3>
              <p className="text-gray-700 font-medium">Success Rate</p>
              <p className="text-sm text-gray-500 mt-1">Profitable strategies</p>
            </MotionDiv>
          </MotionDiv>

          {/* Testimonials */}
          <MotionH3 
            className="text-2xl font-bold text-center mb-10"
            variants={itemFadeIn}
          >
            What Our Traders Say
          </MotionH3>
          
          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto"
            variants={staggerContainer}
          >
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              variants={itemFadeIn}
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold text-xl">SC</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Portfolio Manager at Quantum Capital</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-700 mb-4 italic">
                "AlgoZ has transformed our trading strategy. The automation tools are incredibly powerful and reliable. We've seen a 40% increase in portfolio performance since implementation."
              </p>
              
              <div className="flex items-center">
                <div className="h-0.5 w-10 bg-blue-100 mr-3"></div>
                <p className="text-sm text-blue-600 font-medium">Verified Customer</p>
              </div>
            </MotionDiv>

            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              variants={itemFadeIn}
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-600 font-bold text-xl">MR</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-500">Independent Trader</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-700 mb-4 italic">
                "The platform's ease of use and advanced features make it my go-to choice for algorithmic trading. The customer support team is always responsive and helpful."
              </p>
              
              <div className="flex items-center">
                <div className="h-0.5 w-10 bg-red-100 mr-3"></div>
                <p className="text-sm text-red-600 font-medium">Verified Customer</p>
              </div>
            </MotionDiv>
            
            <MotionDiv 
              className="bg-white rounded-xl p-8 shadow-sm border border-gray-100"
              variants={itemFadeIn}
              whileHover={{ 
                y: -5,
                boxShadow: "0 15px 30px -5px rgba(0, 0, 0, 0.1)"
              }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold text-xl">DP</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold">David Patel</h4>
                  <p className="text-sm text-gray-500">Retail Investor</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
                <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                </svg>
              </div>
              
              <p className="text-gray-700 mb-4 italic">
                "As a beginner, I found the platform intuitive and the educational resources extremely helpful. I've learned so much in just a few months."
              </p>
              
              <div className="flex items-center">
                <div className="h-0.5 w-10 bg-purple-100 mr-3"></div>
                <p className="text-sm text-purple-600 font-medium">Verified Customer</p>
              </div>
            </MotionDiv>
          </MotionDiv>
          
          <MotionDiv 
            className="text-center mt-16"
            variants={itemFadeIn}
          >
            <MotionDiv 
              whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }} 
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button 
                className="bg-black hover:bg-gray-800 text-white font-medium px-8 py-6 h-12 text-base shadow-sm"
                endContent={<ArrowRight className="h-4 w-4 ml-1" />}
              >
                Read More Success Stories
              </Button>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Add a floating animation element for visual interest */}
      <MotionDiv
        className="fixed bottom-10 right-10 w-16 h-16 bg-black rounded-full flex items-center justify-center z-50 cursor-pointer"
        animate={{ 
          y: [0, -10, 0],
          boxShadow: [
            "0 0 0 rgba(0, 0, 0, 0.2)",
            "0 10px 20px rgba(0, 0, 0, 0.2)",
            "0 0 0 rgba(0, 0, 0, 0.2)"
          ]
        }}
        transition={{ 
          duration: 2, 
          repeat: Infinity,
          repeatType: "reverse"
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Zap className="h-8 w-8 text-white" />
      </MotionDiv>
    </main>
  )
}

