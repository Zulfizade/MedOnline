import axios from "../redux/axiosInstance";
import { toast } from "react-toastify";

export async function useLimit(type) {
  try {
    const res = await axios.post("/api/user/use-limit", { type });
    if (res.data.left === 0) {
      toast.info("Limitiniz bitdi! Yeni plan seçin.");
    }
    return res.data.success;
  } catch {
    toast.error("Limitiniz bitib! Yeni plan seçin.");
    return false;
  }
}
