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
import MarqueeDemo from "./ReviewCard";
import { MdCurrencyRupee } from "react-icons/md";

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
    <main className="flex min-h-screen flex-col bg-gray-950">
      {/* Hero Section */}
      <MotionSection
        className="relative py-28 md:py-36 overflow-hidden"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950 to-gray-900 z-0"></div>
        
        {/* Animated grid pattern overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 107, 0, 0.3) 1px, transparent 1px)', 
            backgroundSize: '30px 30px' 
          }}></div>
        </div>
        
        {/* Animated Background Shapes */}
        <MotionDiv
          className="absolute top-20 left-10 w-64 h-64 bg-[#FF6B00] rounded-full mix-blend-multiply filter blur-xl opacity-15 z-0"
          animate={{
            x: [0, 30, 0],
            y: [0, 40, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <MotionDiv
          className="absolute bottom-10 right-10 w-72 h-72 bg-[#FF6B00] rounded-full mix-blend-multiply filter blur-xl opacity-15 z-0"
          animate={{
            x: [0, -40, 0],
            y: [0, 30, 0],
            scale: [1, 1.15, 1]
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        <MotionDiv
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-[#FF6B00] rounded-full mix-blend-multiply filter blur-xl opacity-15 z-0"
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />

        {/* Content */}
        <div className="container mx-auto px-6 relative z-10 text-center">
          <MotionDiv
            className="inline-block mb-5 px-5 py-2 rounded-full bg-gray-900/70 backdrop-blur-sm border border-gray-800/50 shadow-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent font-semibold">Revolutionizing Algorithmic Trading</span>
          </MotionDiv>

          <MotionH1
            className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Algorithmic Trading <br /> Made <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">Simple</span>
          </MotionH1>

          <MotionP
            className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Leverage advanced trading algorithms and copy successful strategies with our automated trading platform.
            Start maximizing your returns today.
          </MotionP>

          <MotionDiv
            className="flex flex-wrap justify-center gap-6 mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
          >
            <Button
              className="bg-gradient-to-r from-orange-500 to-amber-600 hover:opacity-90 text-white font-medium px-8 py-6 rounded-xl shadow-lg hover:shadow-orange-600/20 transform transition-all hover:-translate-y-1"
              endContent={<ArrowRight size={18} />}
            >
              Start Trading Now
            </Button>
            <Button
              className="bg-gray-800/80 text-white font-medium px-8 py-6 rounded-xl border border-gray-700/50 backdrop-blur-sm shadow-sm hover:shadow-md transform transition-all hover:-translate-y-1 hover:bg-gray-700/80"
            >
              Try Demo
            </Button>
          </MotionDiv>

          <MotionDiv
            className="flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.8 }}
          >
            <p className="text-sm text-gray-400 font-medium mb-6 tracking-wider">TRUSTED BY LEADING TRADING FIRMS</p>
            <div className="flex flex-wrap justify-center gap-8 opacity-60">
              <MotionDiv whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <img src="https://placehold.co/120x40/gray/white?text=TradeFirm" alt="Trading Firm" className="h-8" />
              </MotionDiv>
              <MotionDiv whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <img src="https://placehold.co/120x40/gray/white?text=QuantCap" alt="Quant Capital" className="h-8" />
              </MotionDiv>
              <MotionDiv whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <img src="https://placehold.co/120x40/gray/white?text=AlgoTrade" alt="Algo Trade" className="h-8" />
              </MotionDiv>
              <MotionDiv whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <img src="https://placehold.co/120x40/gray/white?text=TechTrade" alt="Tech Trade" className="h-8" />
              </MotionDiv>
            </div>
          </MotionDiv>
        </div>

        {/* Animated corner decorations */}
        <div className="absolute top-0 right-0 w-64 h-64 overflow-hidden opacity-30">
          <div className="absolute -top-32 -right-32 w-64 h-64 border-8 border-orange-500/20 rounded-full"></div>
        </div>
        <div className="absolute bottom-0 left-0 w-64 h-64 overflow-hidden opacity-30">
          <div className="absolute -bottom-32 -left-32 w-64 h-64 border-8 border-orange-500/20 rounded-full"></div>
        </div>

        {/* Bottom Wave */}
        <div className="absolute bottom-0 left-0 right-0 h-16 z-10">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-full">
            <path fill="#111827" fillOpacity="1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,208C1248,192,1344,192,1392,192L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </MotionSection>

      {/* Stats Section */}
      <MotionSection
        className="py-24 bg-gradient-to-b from-gray-900 to-gray-950 relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={staggerContainer}
      >
        {/* Animated grid pattern overlay */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 107, 0, 0.4) 1px, transparent 1px)', 
            backgroundSize: '50px 50px' 
          }}></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <MotionDiv
              className="inline-block mb-3 px-4 py-1.5 rounded-full bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">PROVEN PERFORMANCE</span>
            </MotionDiv>
            <MotionH2
              className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Our Platform by the Numbers
            </MotionH2>
            <MotionP
              className="max-w-2xl mx-auto text-gray-400"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              We've built a robust trading infrastructure that delivers exceptional performance metrics
            </MotionP>
          </div>

          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-3 gap-10"
            variants={staggerContainer}
          >
            {/* Stat 1 */}
            <MotionDiv
              className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl p-8 shadow-lg border border-gray-700/50 backdrop-blur-sm hover:shadow-orange-600/10 transition-all duration-300"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(211, 84, 0, 0.3)" }}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mr-5 shadow-lg transform -rotate-3">
                  <Zap className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">Fast Execution</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Our algorithms execute trades at lightning speed, ensuring you never miss a profitable opportunity.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-transparent bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text font-bold text-2xl">
                  &lt; 0.01s
                </p>
                <p className="text-sm text-gray-400">Average execution time</p>
              </div>
            </MotionDiv>

            {/* Stat 2 */}
            <MotionDiv
              className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl p-8 shadow-lg border border-gray-700/50 backdrop-blur-sm hover:shadow-orange-600/10 transition-all duration-300"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(211, 84, 0, 0.3)" }}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mr-5 shadow-lg transform rotate-3">
                  <BarChart2 className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">99.9% Uptime</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Our robust infrastructure ensures your algorithms run without interruption, 24/7/365.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-transparent bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text font-bold text-2xl">
                  99.9%
                </p>
                <p className="text-sm text-gray-400">Guaranteed uptime</p>
              </div>
            </MotionDiv>

            {/* Stat 3 */}
            <MotionDiv
              className="bg-gradient-to-br from-gray-800 to-gray-850 rounded-2xl p-8 shadow-lg border border-gray-700/50 backdrop-blur-sm hover:shadow-orange-600/10 transition-all duration-300"
              variants={itemFadeIn}
              whileHover={{ y: -5, boxShadow: "0 25px 50px -12px rgba(211, 84, 0, 0.3)" }}
            >
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-amber-600 flex items-center justify-center mr-5 shadow-lg transform -rotate-3">
                  <MousePointer className="text-white" size={24} />
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">One-Click Deploy</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Deploy your strategies with a single click, no complex setup or technical knowledge required.
              </p>
              <div className="mt-4 pt-4 border-t border-gray-700/50">
                <p className="text-transparent bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text font-bold text-2xl">
                  3 minutes
                </p>
                <p className="text-sm text-gray-400">Average setup time</p>
              </div>
            </MotionDiv>
          </MotionDiv>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500/20 to-transparent"></div>
      </MotionSection>

      {/* Features Section */}
      <MotionSection
        className="py-24 relative overflow-hidden bg-gray-950"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gray-950 z-0"></div>
        
        {/* Subtle dot grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ 
            backgroundImage: 'radial-gradient(rgba(255, 107, 0, 0.4) 1px, transparent 1px)', 
            backgroundSize: '40px 40px' 
          }}></div>
        </div>
        
        <div className="absolute top-20 right-0 w-96 h-96 bg-[#FF6B00] rounded-full mix-blend-multiply filter blur-3xl opacity-10 z-0"></div>
        <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#FF6B00] rounded-full mix-blend-multiply filter blur-3xl opacity-10 z-0"></div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <MotionDiv
              className="inline-block mb-4 px-4 py-1.5 rounded-full bg-gray-800/70 backdrop-blur-sm border border-gray-700/50 shadow-lg"
              initial={{ opacity: 0, y: -10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <span className="bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent font-semibold">PLATFORM FEATURES</span>
            </MotionDiv>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Powerful Tools for Modern Traders
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Our platform combines cutting-edge technology with intuitive design to give you everything you need for successful algorithmic trading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Feature 1 */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(211, 84, 0, 0.15)" }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Advanced Backtesting</h3>
              <p className="text-gray-400 mb-6">
                Test your strategies against historical data with precision. Our backtesting engine processes years of market data in seconds.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Custom date ranges</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Detailed performance metrics</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Risk analysis tools</span>
                </li>
              </ul>
            </MotionDiv>

            {/* Feature 2 */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(211, 84, 0, 0.15)" }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">AI-Powered Insights</h3>
              <p className="text-gray-400 mb-6">
                Leverage machine learning algorithms to identify patterns and opportunities that human traders might miss.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Sentiment analysis</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Predictive analytics</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Anomaly detection</span>
                </li>
              </ul>
            </MotionDiv>

            {/* Feature 3 */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl p-8 shadow-lg border border-gray-700/50 backdrop-blur-sm hover:shadow-xl transition-all"
              whileHover={{ y: -5, boxShadow: "0 15px 30px rgba(211, 84, 0, 0.15)" }}
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-6 shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-white">Real-time Monitoring</h3>
              <p className="text-gray-400 mb-6">
                Keep track of your trading performance in real-time with comprehensive dashboards and alerts.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Custom alerts</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Mobile notifications</span>
                </li>
                <li className="flex items-center">
                  <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center mr-3">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-400">Performance analytics</span>
                </li>
              </ul>
            </MotionDiv>
          </div>

          <div className="mt-20 text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="px-10 py-4 rounded-lg bg-[#FF6B00] hover:bg-[#D35400] text-white font-medium hover:shadow-xl transition-all transform hover:-translate-y-1">
                Explore All Features
              </button>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      {/* How It Works Section */}
      <MotionSection
        className="py-24 bg-gray-900 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-gray-900 to-gray-900 z-10"></div>
        
        <div className="container mx-auto px-6 relative z-20">
          <div className="text-center mb-20">
            <span className="inline-block px-5 py-2 rounded-full bg-gray-800 shadow-sm text-sm font-medium text-gray-400 mb-4">
              SIMPLE PROCESS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              How It Works
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Get started with algorithmic trading in just a few simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {/* Step 1 */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#FFA559] flex items-center justify-center mb-4 shadow-md">
                <span className="text-[#FF6B00] font-bold text-xl">1</span>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 text-center w-full backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2 text-white">Create Account</h3>
                <p className="text-gray-400">
                  Sign up for an account in minutes. All you need is an email address to get started.
                </p>
              </div>
            </MotionDiv>

            {/* Step 2 */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#FFA559] flex items-center justify-center mb-4 shadow-md">
                <span className="text-[#FF6B00] font-bold text-xl">2</span>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 text-center w-full backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2 text-white">Choose Strategy</h3>
                <p className="text-gray-400">
                  Select from our marketplace of proven trading strategies or create your own.
                </p>
              </div>
            </MotionDiv>

            {/* Step 3 */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col items-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#FFA559] flex items-center justify-center mb-4 shadow-md">
                <span className="text-[#FF6B00] font-bold text-xl">3</span>
              </div>
              <div className="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700 text-center w-full backdrop-blur-sm">
                <h3 className="text-xl font-semibold mb-2 text-white">Start Trading</h3>
                <p className="text-gray-400">
                  Connect your brokerage account and let the algorithm handle your trades automatically.
                </p>
              </div>
            </MotionDiv>
          </div>

          <div className="mt-20 text-center">
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <button className="px-10 py-4 rounded-lg bg-[#FF6B00] hover:bg-[#D35400] text-white font-medium hover:shadow-xl transition-all transform hover:-translate-y-1">
                Start Your Journey
              </button>
            </MotionDiv>
          </div>
        </div>
      </MotionSection>

      {/* Testimonials Section */}
      <MotionSection
        className="py-24 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gray-900 z-0"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
            <span className="inline-block px-5 py-2 rounded-full bg-gray-800 shadow-sm text-sm font-medium text-gray-400 mb-4">
              TESTIMONIALS
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              What Our Users Say
            </h2>
            <p className="max-w-2xl mx-auto text-gray-400 mb-10">
              Don't just take our word for it. Here's what traders like you have to say about our platform.
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <MarqueeDemo />
          </div>
        </div>
      </MotionSection>

      {/* CTA Section */}
      <MotionSection
        className="py-24 relative overflow-hidden"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        {/* Glass morphism card */}
        <div className="container mx-auto px-6">
          <MotionDiv
            className="max-w-5xl mx-auto rounded-2xl p-12 relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FF6B00] to-[#D35400] z-0 opacity-90 rounded-2xl"></div>
            
            {/* Glass overlay */}
            <div className="absolute inset-0 bg-white opacity-10 z-10 backdrop-blur-md rounded-2xl"></div>
            
            {/* Content */}
            <div className="relative z-20 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                Ready to Transform Your Trading?
              </h2>
              <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-10">
                Join thousands of traders who are already leveraging our platform to achieve better returns with less effort.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button
                  className="bg-white text-[#FF6B00] font-medium px-10 py-5 rounded-xl shadow-lg hover:shadow-xl transform transition-all hover:-translate-y-1"
                  endContent={<ArrowRight size={18} />}
                >
                  Get Started for Free
                </Button>
                <Button
                  className="bg-transparent text-white border border-white font-medium px-10 py-5 rounded-xl shadow-md hover:shadow-lg transform transition-all hover:-translate-y-1"
                >
                  Schedule a Demo
                </Button>
              </div>
            </div>
          </MotionDiv>
        </div>
      </MotionSection>
    </main>
  )
}
