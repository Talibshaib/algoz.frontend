"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface BrokerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  broker: any;
  formData: Record<string, string>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

const BrokerAuthModal: React.FC<BrokerAuthModalProps> = ({
  isOpen,
  onClose,
  broker,
  formData,
  onInputChange,
  onSubmit,
  isLoading,
}) => {
  // Create a ref for the modal content
  const modalRef = React.useRef<HTMLDivElement>(null);
  
  // Create a state to track if the modal is mounted
  const [mounted, setMounted] = React.useState(false);

  // Mount effect
  React.useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Handle ESC key press
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isLoading) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey, true);
      // Prevent scrolling when modal is open
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey, true);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, isLoading]);

  // Handle clicks outside the modal with improved event handling
  React.useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      // Only process if modal is open and not loading
      if (!isOpen || isLoading) return;
      
      // Check if click is outside the modal
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        // Stop event propagation to prevent it from reaching other handlers
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };

    if (isOpen) {
      // Use capture phase to handle the event before it reaches other elements
      document.addEventListener("mousedown", handleOutsideClick, true);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick, true);
    };
  }, [isOpen, onClose, isLoading]);
  
  // Prevent any input events from bubbling up to parent components
  React.useEffect(() => {
    const preventBubbling = (e: Event) => {
      // Stop propagation for all input events
      e.stopPropagation();
    };
    
    // Get all input elements in the modal when it's open
    if (isOpen && modalRef.current) {
      const inputElements = modalRef.current.querySelectorAll('input');
      
      // Add event listeners to each input
      inputElements.forEach(input => {
        input.addEventListener('click', preventBubbling, true);
        input.addEventListener('focus', preventBubbling, true);
        input.addEventListener('keydown', preventBubbling, true);
        input.addEventListener('keyup', preventBubbling, true);
        input.addEventListener('input', preventBubbling, true);
      });
      
      return () => {
        // Clean up event listeners
        inputElements.forEach(input => {
          input.removeEventListener('click', preventBubbling, true);
          input.removeEventListener('focus', preventBubbling, true);
          input.removeEventListener('keydown', preventBubbling, true);
          input.removeEventListener('keyup', preventBubbling, true);
          input.removeEventListener('input', preventBubbling, true);
        });
      };
    }
  }, [isOpen, broker]);

  // Prevent any clicks inside the modal from propagating
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Don't render anything if the modal is not open or not mounted
  if (!isOpen || !broker || !mounted) return null;

  // Use createPortal to render the modal outside the normal DOM hierarchy
  return createPortal(
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50" 
      onClick={(e) => {
        // This prevents clicks on the backdrop from reaching elements underneath
        e.preventDefault();
        e.stopPropagation();
        if (!isLoading) {
          onClose();
        }
      }}
      style={{ isolation: 'isolate' }} // CSS isolation to create a new stacking context
    >
      <div 
        ref={modalRef}
        className="w-full max-w-md rounded-lg bg-white dark:bg-gray-800 p-6 shadow-lg animate-in fade-in-0 zoom-in-95"
        onClick={(e) => {
          // Stop propagation for any click inside the modal
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">Connect {broker.name}</h2>
            <p className="text-sm text-gray-500">
              Enter your {broker.name} API credentials to connect your account.
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (!isLoading) onClose();
            }}
            disabled={isLoading}
            className="rounded-full p-1 hover:bg-gray-100 transition-colors"
            type="button"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form 
          onSubmit={(e) => {
            // Ensure event doesn't propagate outside the form
            e.preventDefault();
            e.stopPropagation();
            onSubmit(e);
          }} 
          className="space-y-4"
          onClick={(e) => e.stopPropagation()}
        >
          {broker.fields.map((field: any) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>{field.label}</Label>
              <Input
                id={field.name}
                name={field.name}
                type={field.type}
                placeholder={field.label}
                value={formData[field.name] || ''}
                onChange={(e) => {
                  // Prevent event propagation
                  e.preventDefault();
                  e.stopPropagation();
                  onInputChange(e);
                }}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onFocus={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onKeyDown={(e) => e.stopPropagation()}
                onKeyUp={(e) => e.stopPropagation()}
                required
                autoComplete="off"
                className="w-full"
              />
            </div>
          ))}

          <div className="flex justify-end space-x-2 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isLoading) onClose();
              }}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
              onClick={(e) => e.stopPropagation()}
            >
              {isLoading ? (
                <>
                  <span className="mr-2">Connecting...</span>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                </>
              ) : (
                "Connect"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export { BrokerAuthModal };