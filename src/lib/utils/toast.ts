import { toast } from 'react-toastify';

// Success toast
export const showSuccess = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

// Error toast
export const showError = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

// Warning toast
export const showWarning = (message: string) => {
    toast.warning(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

// Info toast
export const showInfo = (message: string) => {
    toast.info(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
    });
};

// Custom toast with options
export const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', options?: any) => {
    const defaultOptions = {
        position: "top-right" as const,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        ...options
    };

    switch (type) {
        case 'success':
            return toast.success(message, defaultOptions);
        case 'error':
            return toast.error(message, defaultOptions);
        case 'warning':
            return toast.warning(message, defaultOptions);
        case 'info':
        default:
            return toast.info(message, defaultOptions);
    }
};

// Dismiss all toasts
export const dismissAll = () => {
    toast.dismiss();
};

// Dismiss specific toast
export const dismissToast = (toastId: string | number) => {
    toast.dismiss(toastId);
};
