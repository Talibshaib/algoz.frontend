"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveBrokerCredentials } from "@/services/brokerService";

interface DhanAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const DhanAuthModal: React.FC<DhanAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({
    partner_id: "",
    partner_secret: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  // Handle click outside modal
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node) && isOpen) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose]);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.partner_id || !formData.partner_secret) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      await saveBrokerCredentials("dhan", formData);
      toast.success("Dhan credentials saved successfully");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error("Error saving Dhan credentials:", error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to save Dhan credentials: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Connect to Dhan</h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Enter your Dhan Partner ID and Partner Secret to connect your account.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="partner_id">Partner ID</Label>
            <Input
              id="partner_id"
              name="partner_id"
              type="text"
              placeholder="Enter your Partner ID"
              value={formData.partner_id}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="partner_secret">Partner Secret</Label>
            <Input
              id="partner_secret"
              name="partner_secret"
              type="password"
              placeholder="Enter your Partner Secret"
              value={formData.partner_secret}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin h-4 w-4 mr-2 border-b-2 border-white rounded-full"></div>
                  Processing...
                </div>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};