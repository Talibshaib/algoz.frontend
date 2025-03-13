"use client"

import { useState } from "react"
import type React from "react"
import "../../app/globals.css"
import Link from "next/link"
import { Button } from "@nextui-org/react"
import { Menu } from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import MobileNav from "./MobileNav"
import { MotionDiv } from "@/components/ui/motion"

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen)
  }

  return (
    <header className="border-b border-gray-100 bg-white shadow-sm sticky top-0 z-50">
      <div className="container flex h-16 sm:h-18 items-center mx-auto justify-between px-4">
        <Link href="/" className="text-xl sm:text-2xl font-bold relative group">
          <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">AlgoZ</span>
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-black transition-all duration-300 group-hover:w-full"></span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          onClick={toggleMobileNav}
          aria-label="Toggle mobile menu"
        >
          <Menu size={24} />
        </button>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium hover:bg-gray-50">Products</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-white rounded-xl shadow-lg">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">TradingView Integration</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Seamlessly connect your TradingView charts and execute trades directly from the platform.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Pine Script Strategies</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Access a library of pre-built trading strategies or create your own using Pine Script.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">MQL Solutions</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Professional MetaTrader integration with custom MQL4/5 expert advisors and indicators.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium hover:bg-gray-50">Resources</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-white rounded-xl shadow-lg">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Documentation</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Comprehensive guides and API documentation for developers.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Blog</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Latest news, updates, and trading insights from our experts.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Community</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Join our community of traders and developers.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-sm font-medium hover:bg-gray-50">Company</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-white rounded-xl shadow-lg">
                  <NavigationMenuLink asChild>
                    <Link
                      href="/about"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">About Us</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Learn about our mission and team.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/careers"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Careers</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Join our team and help shape the future of algorithmic trading.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                  <NavigationMenuLink asChild>
                    <Link
                      href="/contact"
                      className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-gray-50 hover:text-black focus:bg-accent focus:text-accent-foreground"
                    >
                      <div className="text-sm font-medium leading-none">Contact</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground mt-1">
                        Get in touch with our support team.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login">
            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="light" className="text-sm font-medium py-2 px-4 h-10">Log In</Button>
            </MotionDiv>
          </Link>
          <Link href="/signup">
            <MotionDiv whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-black hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 h-10 shadow-sm">Sign Up</Button>
            </MotionDiv>
          </Link>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  )
}

