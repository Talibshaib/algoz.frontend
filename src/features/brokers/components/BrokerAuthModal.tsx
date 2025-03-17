"use client";

import * as React from "react";
import { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { saveBrokerCredentials } from "@/services/brokerService";

export interface BrokerField {
  name: string;
  label: string;
  type: string;
}

interface BrokerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  brokerId: string;
  brokerName: string;
  fields: BrokerField[];
  description?: string;
}

export const BrokerAuthModal: React.FC<BrokerAuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  brokerId,
  brokerName,
  fields,
  description
}) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Initialize form data based on fields
  useEffect(() => {
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field.name] = "";
    });
    setFormData(initialData);
  }, [fields]);

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
    
    // Validate all fields are filled
    const missingFields = fields.filter(field => !formData[field.name]);
    if (missingFields.length > 0) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    
    try {
      console.log(`Saving ${brokerName} credentials:`, formData);
      await saveBrokerCredentials(brokerId, formData);
      toast.success(`${brokerName} credentials saved successfully`);
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error(`Error saving ${brokerName} credentials:`, error);
      const errorMessage = error.response?.data?.message || error.message || "Unknown error";
      toast.error(`Failed to save ${brokerName} credentials: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" suppressHydrationWarning>
      <div
        ref={modalRef}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Connect to {brokerName}</h2>
          <button
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {description || `Enter your ${brokerName} credentials to connect your account.`}
        </p>

        <form onSubmit={handleSubmit} className="space-y-6" suppressHydrationWarning>
          {fields.map((field) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={`Enter your ${field.label.toLowerCase()}`}
                value={formData[field.name] || ""}
                onChange={handleInputChange}
                required
                suppressHydrationWarning
              />
            </div>
          ))}

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