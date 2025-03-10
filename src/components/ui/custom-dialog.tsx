"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface CustomDialogProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
  preventOutsideClose?: boolean
}

const CustomDialogOverlay: React.FC<{
  onClick?: (e: React.MouseEvent) => void
  className?: string
}> = ({ onClick, className }) => (
  <div
    className={cn(
      "fixed inset-0 z-50 bg-black/80 animate-in fade-in-0",
      className
    )}
    onClick={onClick}
    aria-hidden="true"
  />
)

const CustomDialogContent: React.FC<{
  children: React.ReactNode
  className?: string
  onClose?: () => void
  preventOutsideClose?: boolean
}> = ({ children, className, onClose, preventOutsideClose }) => {
  // Prevent clicks inside the dialog from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    // Ensure the event doesn't propagate to parent elements
    e.preventDefault();
    e.stopPropagation();
  }

  // Prevent keyboard events from propagating
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Stop propagation for all keyboard events
    e.stopPropagation();
    
    // Only prevent default for Tab and arrow keys to allow typing
    if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      // Don't prevent default for Tab as we want to allow tabbing between fields
      if (e.key !== 'Tab') {
        e.preventDefault();
      }
    }
  }

  // Create a ref for the dialog content
  const contentRef = React.useRef<HTMLDivElement>(null);

  // Add event listeners to all input elements to prevent event bubbling
  React.useEffect(() => {
    const preventBubbling = (e: Event) => {
      e.stopPropagation();
    };

    if (contentRef.current) {
      const inputElements = contentRef.current.querySelectorAll('input, textarea, select');
      
      inputElements.forEach(input => {
        input.addEventListener('click', preventBubbling, true);
        input.addEventListener('focus', preventBubbling, true);
        input.addEventListener('keydown', preventBubbling, true);
        input.addEventListener('keyup', preventBubbling, true);
        input.addEventListener('input', preventBubbling, true);
      });
      
      return () => {
        inputElements.forEach(input => {
          input.removeEventListener('click', preventBubbling, true);
          input.removeEventListener('focus', preventBubbling, true);
          input.removeEventListener('keydown', preventBubbling, true);
          input.removeEventListener('keyup', preventBubbling, true);
          input.removeEventListener('input', preventBubbling, true);
        });
      };
    }
  }, []);

  return (
    <div
      ref={contentRef}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg animate-in fade-in-0 zoom-in-95 slide-in-from-left-1/2 slide-in-from-top-[48%] sm:rounded-lg",
        className
      )}
      onClick={handleContentClick}
      onKeyDown={handleKeyDown}
      onKeyPress={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      style={{ isolation: 'isolate' }} // Create a new stacking context
    >
      {children}
      {onClose && (
        <button
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          type="button"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>
      )}
    </div>
  )
}

const CustomDialog: React.FC<CustomDialogProps> = ({
  isOpen,
  onClose,
  children,
  className,
  preventOutsideClose = false,
}) => {
  // Handle ESC key press
  React.useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      // Check if an input field is focused
      const activeElement = document.activeElement;
      if (activeElement) {
        const tagName = activeElement.tagName.toLowerCase();
        
        // Don't close if an input field is focused
        if (tagName === 'input' || 
            tagName === 'textarea' || 
            tagName === 'select' || 
            (activeElement as HTMLElement).isContentEditable) {
          return;
        }
      }
      
      if (e.key === "Escape" && !preventOutsideClose) {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey, true)
      // Prevent scrolling when dialog is open
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey, true)
      document.body.style.overflow = "auto"
    }
  }, [isOpen, onClose, preventOutsideClose])

  // Handle overlay click
  const handleOverlayClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!preventOutsideClose) {
      onClose();
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ isolation: 'isolate' }}>
      <CustomDialogOverlay onClick={handleOverlayClick} />
      <CustomDialogContent 
        className={className}
        preventOutsideClose={preventOutsideClose}
        onClose={!preventOutsideClose ? onClose : undefined}
      >
        {children}
      </CustomDialogContent>
    </div>
  )
}

const CustomDialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
)

const CustomDialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
)

const CustomDialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
)

const CustomDialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
)

export {
  CustomDialog,
  CustomDialogHeader,
  CustomDialogFooter,
  CustomDialogTitle,
  CustomDialogDescription,
}