// Simple toast implementation that doesn't rely on hooks
// This is a simplified version that will be replaced by the actual toast component when rendered

let toastHandler: {
  showToast?: (message: string, type: 'success' | 'error' | 'info') => void
} = {};

// Register the toast handler
export const registerToastHandler = (handler: {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void
}) => {
  toastHandler = handler;
};

export const toast = {
  success: (message: string) => {
    if (toastHandler.showToast) {
      toastHandler.showToast(message, 'success');
    } else {
      console.log('Success:', message);
      // Fallback to alert in development
      if (process.env.NODE_ENV === 'development') {
        alert(`Success: ${message}`);
      }
    }
  },
  error: (message: string) => {
    if (toastHandler.showToast) {
      toastHandler.showToast(message, 'error');
    } else {
      console.error('Error:', message);
      // Fallback to alert in development
      if (process.env.NODE_ENV === 'development') {
        alert(`Error: ${message}`);
      }
    }
  },
  info: (message: string) => {
    if (toastHandler.showToast) {
      toastHandler.showToast(message, 'info');
    } else {
      console.info('Info:', message);
      // Fallback to alert in development
      if (process.env.NODE_ENV === 'development') {
        alert(`Info: ${message}`);
      }
    }
  }
}; 