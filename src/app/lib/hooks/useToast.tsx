import { toast, ToastOptions } from "react-toastify";

export type ToastType = "success" | "error" | "info" | "warning";

const defaultOptions: ToastOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: false,
  draggable: false,
  theme: "colored",
};

export const useCustomToast = () => {
  const success = (message: string, options?: ToastOptions) => {
    toast.success(message, { ...defaultOptions, ...options });
  };
  const info = (message: string, options?: ToastOptions) => {
    toast.info(message, { ...defaultOptions, ...options });
  };
  const error = (message: string, options?: ToastOptions) => {
    toast.error(message, { ...defaultOptions, ...options });
  };
  const warning = (message: string, options?: ToastOptions) => {
    toast.warning(message, { ...defaultOptions, ...options });
  };
  return {
    addToast: {
      success,
      info,
      error,
      warning,
    },
  };
};
