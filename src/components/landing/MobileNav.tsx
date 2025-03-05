"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@nextui-org/react"
import { X } from "lucide-react"

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent scrolling when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Mobile navigation drawer */}
      <div 
        className={`fixed top-0 right-0 h-full w-[80%] max-w-[350px] bg-white z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:hidden flex flex-col`}
      >
        {/* Header with close button */}
        <div className="flex justify-between items-center p-4 border-b">
          <Link href="/" className="text-lg font-bold" onClick={onClose}>
            AlgoZ
          </Link>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="px-4 py-2">
            <h3 className="text-sm font-semibold mb-2">Products</h3>
            <ul className="space-y-2 pl-2">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  TradingView Integration
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  Pine Script Strategies
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  MQL Solutions
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="px-4 py-2 border-t">
            <h3 className="text-sm font-semibold mb-2 mt-2">Resources</h3>
            <ul className="space-y-2 pl-2">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  Community
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="px-4 py-2 border-t">
            <h3 className="text-sm font-semibold mb-2 mt-2">Company</h3>
            <ul className="space-y-2 pl-2">
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link 
                  href="/" 
                  className="block py-2 text-gray-600 hover:text-black"
                  onClick={onClose}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Authentication buttons fixed at bottom */}
        <div className="border-t p-4 space-y-2">
          <Link href="/login" className="block">
            <Button variant="ghost" className="w-full justify-center" onClick={onClose}>
              Log In
            </Button>
          </Link>
          <Link href="/signup" className="block">
            <Button className="bg-black hover:bg-gray-800 text-white w-full justify-center" onClick={onClose}>
              Sign Up
            </Button>
          </Link>
        </div>
      </div>
    </>
  )
}