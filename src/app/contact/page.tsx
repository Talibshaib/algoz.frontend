"use client";

import React, { useState } from "react";
import NavBar from "@/components/landing/NavBar";
import Footer from "@/components/landing/Footer";
import { Button, Input, Textarea, Checkbox } from "@nextui-org/react";
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from "lucide-react";
import { 
  MotionDiv, 
  MotionSection, 
  MotionH1, 
  MotionH2, 
  MotionP,
  MotionA
} from "@/components/ui/motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    agreeToTerms: false
  });

  const [formStatus, setFormStatus] = useState({
    submitted: false,
    submitting: false,
    error: null
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus({ submitted: false, submitting: true, error: null });
    
    // Simulate form submission
    setTimeout(() => {
      setFormStatus({ submitted: true, submitting: false, error: null });
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        agreeToTerms: false
      });
    }, 1500);
  };

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
              Contact Us
            </MotionH1>
            <MotionP 
              className="text-gray-600 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              Have questions or need assistance? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </MotionP>
          </div>
        </MotionSection>

        {/* Contact Form and Info Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <MotionDiv
                className="bg-white p-8 rounded-lg shadow-md"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
              >
                <MotionH2 
                  className="text-2xl font-bold mb-6"
                  variants={itemFadeIn}
                >
                  Send Us a Message
                </MotionH2>
                
                {formStatus.submitted ? (
                  <MotionDiv 
                    className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-8 w-8 text-green-600" />
                      </div>
                    </div>
                    <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                    <p>Thank you for reaching out. We'll get back to you shortly.</p>
                  </MotionDiv>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="space-y-6">
                      <MotionDiv variants={itemFadeIn}>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Your Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="John Doe"
                          required
                          fullWidth
                        />
                      </MotionDiv>
                      
                      <MotionDiv variants={itemFadeIn}>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="john@example.com"
                          required
                          fullWidth
                        />
                      </MotionDiv>
                      
                      <MotionDiv variants={itemFadeIn}>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          placeholder="How can we help you?"
                          required
                          fullWidth
                        />
                      </MotionDiv>
                      
                      <MotionDiv variants={itemFadeIn}>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          placeholder="Your message here..."
                          required
                          minRows={4}
                          fullWidth
                        />
                      </MotionDiv>
                      
                      <MotionDiv variants={itemFadeIn} className="flex items-start">
                        <Checkbox
                          id="agreeToTerms"
                          name="agreeToTerms"
                          isSelected={formData.agreeToTerms}
                          onValueChange={(checked) => setFormData(prev => ({ ...prev, agreeToTerms: checked }))}
                        >
                          <span className="text-sm text-gray-600">
                            I agree to the processing of my personal data in accordance with the <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
                          </span>
                        </Checkbox>
                      </MotionDiv>
                      
                      <MotionDiv variants={itemFadeIn}>
                        <Button
                          type="submit"
                          className="bg-black text-white w-full"
                          disabled={formStatus.submitting || !formData.agreeToTerms}
                          endContent={<Send className="h-4 w-4" />}
                        >
                          {formStatus.submitting ? "Sending..." : "Send Message"}
                        </Button>
                      </MotionDiv>
                    </div>
                  </form>
                )}
              </MotionDiv>
              
              {/* Contact Information */}
              <MotionDiv
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={staggerContainer}
              >
                <MotionH2 
                  className="text-2xl font-bold mb-6"
                  variants={itemFadeIn}
                >
                  Get in Touch
                </MotionH2>
                
                <div className="space-y-8">
                  <MotionDiv 
                    className="flex items-start"
                    variants={itemFadeIn}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <MapPin className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Our Location</h3>
                      <p className="text-gray-600">
                        324, Sagar Plaza, Plot No-16, Sant Nagar, Rani Bagh, New Delhi-110034
                      </p>
                    </div>
                  </MotionDiv>
                  
                  <MotionDiv 
                    className="flex items-start"
                    variants={itemFadeIn}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <Mail className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Email Us</h3>
                      <p className="text-gray-600">
                        <a href="mailto:admin@algoz.tech" className="hover:underline">admin@algoz.tech</a>
                      </p>
                      <p className="text-gray-600">
                        <a href="mailto:support@algoz.tech" className="hover:underline">support@algoz.tech</a>
                      </p>
                    </div>
                  </MotionDiv>
                  
                  <MotionDiv 
                    className="flex items-start"
                    variants={itemFadeIn}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <Phone className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Call Us</h3>
                      <p className="text-gray-600">
                        <a href="tel:+919214740350" className="hover:underline">+91 9214740350</a>
                      </p>
                    </div>
                  </MotionDiv>
                  
                  <MotionDiv 
                    className="flex items-start"
                    variants={itemFadeIn}
                  >
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mr-4">
                      <Clock className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-1">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                      <p className="text-gray-600">Saturday: 10:00 AM - 2:00 PM IST</p>
                      <p className="text-gray-600">Sunday: Closed</p>
                    </div>
                  </MotionDiv>
                </div>
                
                <MotionDiv 
                  className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200"
                  variants={itemFadeIn}
                >
                  <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
                  <p className="text-gray-600 mb-4">
                    Follow us on social media for the latest updates, tips, and trading insights.
                  </p>
                  <div className="flex space-x-4">
                    <MotionA 
                      href="#" 
                      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                      whileHover={{ y: -5, backgroundColor: "#1DA1F2", color: "#ffffff" }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </MotionA>
                    <MotionA 
                      href="#" 
                      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                      whileHover={{ y: -5, backgroundColor: "#4267B2", color: "#ffffff" }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </MotionA>
                    <MotionA 
                      href="#" 
                      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                      whileHover={{ y: -5, backgroundColor: "#0A66C2", color: "#ffffff" }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </MotionA>
                    <MotionA 
                      href="#" 
                      className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center"
                      whileHover={{ y: -5, backgroundColor: "#FF0000", color: "#ffffff" }}
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </MotionA>
                  </div>
                </MotionDiv>
              </MotionDiv>
            </div>
          </div>
        </section>
        
        {/* Map Section */}
        <MotionSection 
          className="py-16 bg-gray-50"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeIn}
        >
          <div className="container mx-auto px-4">
            <MotionH2 
              className="text-2xl font-bold mb-8 text-center"
              variants={itemFadeIn}
            >
              Find Us
            </MotionH2>
            <MotionDiv 
              className="h-96 bg-gray-200 rounded-lg overflow-hidden"
              variants={itemFadeIn}
            >
              {/* Replace with actual map component or iframe */}
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <p className="text-gray-600">Map will be displayed here</p>
              </div>
            </MotionDiv>
          </div>
        </MotionSection>
      </main>
      <Footer />
    </div>
  );
} 