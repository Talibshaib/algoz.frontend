import { Button } from "@nextui-org/react"
import { Zap, BarChart2, MousePointer } from "lucide-react"
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
        className="py-16 md:py-24"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="mx-auto px-4 text-center">
          <MotionH1 
            className="text-4xl md:text-5xl font-bold mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            Algorithmic Trading <br /> Made Simple
          </MotionH1>
          <MotionP 
            className="text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            Leverage advanced trading algorithms and copy successful strategies with our automated trading platform.
            Start maximizing your returns today.
          </MotionP>
          <MotionDiv 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-black hover:bg-gray-800 text-white">Start Copy Trading</Button>
            </MotionDiv>
            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="bordered">Browse Strategies</Button>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Stats Section */}
      <MotionSection 
        className="py-16 container mx-auto px-4"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={staggerContainer}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <MotionDiv variants={itemFadeIn}>
            <MotionH2 
              className="text-3xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              $2.5B+
            </MotionH2>
            <p className="text-gray-500">Trading Volume</p>
          </MotionDiv>
          <MotionDiv variants={itemFadeIn}>
            <MotionH2 
              className="text-3xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              50K+
            </MotionH2>
            <p className="text-gray-500">Active Traders</p>
          </MotionDiv>
          <MotionDiv variants={itemFadeIn}>
            <MotionH2 
              className="text-3xl font-bold"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              99.9%
            </MotionH2>
            <p className="text-gray-500">Uptime</p>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Trading Solutions Section */}
      <MotionSection 
        className="py-16 bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <MotionH2 
            className="text-3xl font-bold text-center mb-2"
            variants={itemFadeIn}
          >
            Our Trading Solutions
          </MotionH2>
          <MotionP 
            className="text-gray-600 text-center mb-12"
            variants={itemFadeIn}
          >
            Choose from our range of professional trading tools and services
          </MotionP>

          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {/* TradingView Integration */}
            <MotionDiv 
              className="border rounded-lg p-6 flex flex-col"
              variants={itemFadeIn}
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-2">TradingView Integration</h3>
              <p className="text-sm text-gray-600 mb-4">
                Seamlessly connect your TradingView charts and execute trades directly from the platform.
              </p>
              <div className="text-2xl font-bold mb-4">
                $49 <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Real-time data sync
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Custom indicators
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Automated trading
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  24/7 support
                </li>
              </ul>
              <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-black hover:bg-gray-800 text-white">Get Started</Button>
              </MotionDiv>
            </MotionDiv>

            {/* Pine Script Strategies */}
            <MotionDiv 
              className="border rounded-lg p-6 flex flex-col"
              variants={itemFadeIn}
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-2">Pine Script Strategies</h3>
              <p className="text-sm text-gray-600 mb-4">
                Create a library of custom trading strategies or create your own using Pine Script.
              </p>
              <div className="text-2xl font-bold mb-4">
                $79 <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Strategy library
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Backtesting tools
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Custom script editor
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Strategy optimization
                </li>
              </ul>
              <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-black hover:bg-gray-800 text-white">Get Started</Button>
              </MotionDiv>
            </MotionDiv>

            {/* MQL Solutions */}
            <MotionDiv 
              className="border rounded-lg p-6 flex flex-col"
              variants={itemFadeIn}
              whileHover={{ y: -10, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-bold mb-2">MQL Solutions</h3>
              <p className="text-sm text-gray-600 mb-4">
                Professional MetaTrader integration with custom MQL4/5 expert advisors and indicators.
              </p>
              <div className="text-2xl font-bold mb-4">
                $99 <span className="text-sm font-normal text-gray-500">/month</span>
              </div>
              <ul className="space-y-2 mb-8 flex-grow">
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  MT4/MT5 Integration
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Custom EA development
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Indicator library
                </li>
                <li className="flex items-center">
                  <svg
                    className="w-4 h-4 mr-2 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  Priority support
                </li>
              </ul>
              <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-black hover:bg-gray-800 text-white">Get Started</Button>
              </MotionDiv>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Features Section */}
      <MotionSection 
        className="py-16 bg-gray-100"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <MotionH2 
            className="text-3xl font-bold text-center mb-2"
            variants={itemFadeIn}
          >
            Powerful Trading Features
          </MotionH2>
          <MotionP 
            className="text-gray-600 text-center mb-12"
            variants={itemFadeIn}
          >
            Experience the next generation of algorithmic trading with our cutting-edge features
          </MotionP>

          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
          >
            <MotionDiv 
              className="text-center"
              variants={itemFadeIn}
              whileHover={{ scale: 1.05 }}
            >
              <MotionDiv 
                className="flex justify-center mb-4"
                whileHover={{ rotate: 5 }}
              >
                <div className="p-4 rounded-full bg-white inline-block">
                  <MousePointer className="h-8 w-8 text-black" />
                </div>
              </MotionDiv>
              <h3 className="text-xl font-bold mb-2">One-Click Trading</h3>
              <p className="text-gray-600">
                Execute trades instantly with our streamlined one-click trading interface. No more complex order forms.
              </p>
            </MotionDiv>

            <MotionDiv 
              className="text-center"
              variants={itemFadeIn}
              whileHover={{ scale: 1.05 }}
            >
              <MotionDiv 
                className="flex justify-center mb-4"
                whileHover={{ rotate: 5 }}
              >
                <div className="p-4 rounded-full bg-white inline-block">
                  <BarChart2 className="h-8 w-8 text-black" />
                </div>
              </MotionDiv>
              <h3 className="text-xl font-bold mb-2">Real-Time Metrics</h3>
              <p className="text-gray-600">
                Monitor your trading performance with live updates on key metrics, P&L, and portfolio analytics.
              </p>
            </MotionDiv>

            <MotionDiv 
              className="text-center"
              variants={itemFadeIn}
              whileHover={{ scale: 1.05 }}
            >
              <MotionDiv 
                className="flex justify-center mb-4"
                whileHover={{ rotate: 5 }}
              >
                <div className="p-4 rounded-full bg-white inline-block">
                  <Zap className="h-8 w-8 text-black" />
                </div>
              </MotionDiv>
              <h3 className="text-xl font-bold mb-2">Lightning Fast Execution</h3>
              <p className="text-gray-600">
                Experience ultra-low latency trade execution with our optimized trading infrastructure.
              </p>
            </MotionDiv>
          </MotionDiv>

          <MotionDiv 
            className="text-center mt-12"
            variants={itemFadeIn}
          >
            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-black hover:bg-gray-800 text-white">Explore All Features</Button>
            </MotionDiv>
          </MotionDiv>
        </div>
      </MotionSection>

      {/* Trusted Section */}
      <MotionSection 
        className="py-16"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
        variants={fadeIn}
      >
        <div className="container mx-auto px-4">
          <MotionH2 
            className="text-3xl font-bold text-center mb-2"
            variants={itemFadeIn}
          >
            Trusted by Traders Worldwide
          </MotionH2>
          <MotionP 
            className="text-gray-600 text-center mb-12"
            variants={itemFadeIn}
          >
            Join thousands of successful traders using AlgoZ
          </MotionP>

          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
            variants={staggerContainer}
          >
            <MotionDiv 
              className="text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5 }}
            >
              <MotionH3 
                className="text-3xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                $2.5B+
              </MotionH3>
              <p className="text-gray-500">Total Trading Volume</p>
              <p className="text-xs text-gray-400">Processed in 2023</p>
            </MotionDiv>
            <MotionDiv 
              className="text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5 }}
            >
              <MotionH3 
                className="text-3xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                50,000+
              </MotionH3>
              <p className="text-gray-500">Active Traders</p>
              <p className="text-xs text-gray-400">Worldwide</p>
            </MotionDiv>
            <MotionDiv 
              className="text-center"
              variants={itemFadeIn}
              whileHover={{ y: -5 }}
            >
              <MotionH3 
                className="text-3xl font-bold"
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
              >
                94%
              </MotionH3>
              <p className="text-gray-500">Success Rate</p>
              <p className="text-xs text-gray-400">Profitable strategies</p>
            </MotionDiv>
          </MotionDiv>

          {/* Testimonials */}
          <MotionDiv 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
            variants={staggerContainer}
          >
            <MotionDiv 
              className="border rounded-lg p-6"
              variants={itemFadeIn}
              whileHover={{ 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                y: -5
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-blue-500 font-bold">SC</span>
                </div>
                <div>
                  <h4 className="font-bold">Sarah Chen</h4>
                  <p className="text-sm text-gray-500">Portfolio Manager at Quantum Capital</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                AlgoZ has transformed our trading strategy. The automation tools are incredibly powerful and reliable.
              </p>
            </MotionDiv>

            <MotionDiv 
              className="border rounded-lg p-6"
              variants={itemFadeIn}
              whileHover={{ 
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                y: -5
              }}
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-red-500 font-bold">MR</span>
                </div>
                <div>
                  <h4 className="font-bold">Michael Rodriguez</h4>
                  <p className="text-sm text-gray-500">Independent Trader & Self-employed</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                  </svg>
                ))}
              </div>
              <p className="text-gray-600">
                The platform's ease of use and advanced features make it my go-to choice for algorithmic trading.
              </p>
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

