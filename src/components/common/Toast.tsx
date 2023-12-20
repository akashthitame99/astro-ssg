import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toast = () => {
  return (
    <ToastContainer
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export const showToast = (
  message: string,
  type: "info" | "success" | "warning" | "error" = "info"
) => {
  toast[type](message);
};

export default Toast;
