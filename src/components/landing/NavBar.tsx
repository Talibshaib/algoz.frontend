"use client"

import { useState } from "react"
import type React from "react"
import "../../app/globals.css"
import Link from "next/link"
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Badge } from "@nextui-org/react"
import { Menu, ChevronDown } from "lucide-react"
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
import { ShinyButton } from "../magicui/shiny-button"

export default function Navbar() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  const toggleMobileNav = () => {
    setMobileNavOpen(!mobileNavOpen)
  }

  return (
    <header className="border-b border-gray-100 bg-gradient-to-br from-gray-50 to-white shadow-sm sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 sm:h-18 items-center justify-between">
          {/* Left section - Logo */}
          <div className="flex-shrink-0 w-1/4">
            <Link href="/" className="text-xl sm:text-2xl font-bold relative group">
              <MotionDiv
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <span className="bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">AlgoZ</span>
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 group-hover:w-full"></span>
              </MotionDiv>
            </Link>
          </div>
          
          {/* Center section - Navigation */}
          <div className="hidden md:flex flex-grow justify-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-2">
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm font-medium hover:bg-gray-50 transition-all duration-200">Products</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-white rounded-xl shadow-lg border border-gray-100">
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
                  <NavigationMenuTrigger className="text-sm font-medium hover:bg-gray-50 transition-all duration-200">Resources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-white rounded-xl shadow-lg border border-gray-100">
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
                  <NavigationMenuTrigger className="text-sm font-medium hover:bg-gray-50 transition-all duration-200">Company</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] bg-white rounded-xl shadow-lg border border-gray-100">
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
          </div>
          
          {/* Right section - Mobile menu button and Get Started */}
          <div className="flex items-center justify-end flex-shrink-0 w-1/4">
            {/* Mobile menu button */}
            <button 
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              onClick={toggleMobileNav}
              aria-label="Toggle mobile menu"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center gap-4">
              <MotionDiv 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* <Badge content="New" color="primary" placement="top-right" classNames={{
                  badge: "font-semibold text-[10px]"
                }}> */}
                  <Dropdown>
                    <DropdownTrigger>
                      <ShinyButton className="relative"> 
                        Get Started
                      </ShinyButton>  
                    </DropdownTrigger>
                    <DropdownMenu aria-label="Get Started Options" className="bg-white rounded-lg p-2">
                      <DropdownItem key="login" className="py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <Link href="/login" className="w-full block">
                          <div className="text-sm font-medium">Log In</div>
                          <p className="text-xs text-gray-500 mt-1">Access your account</p>
                        </Link>
                      </DropdownItem>
                      <DropdownItem key="signup" className="py-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                        <Link href="/signup" className="w-full block">
                          <div className="text-sm font-medium">Sign Up</div>
                          <p className="text-xs text-gray-500 mt-1">Create a new account</p>
                        </Link>
                      </DropdownItem>
                    </DropdownMenu>
                  </Dropdown>
                {/* </Badge> */}
              </MotionDiv>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
    </header>
  )
}

