import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { useAuthStore } from "./useAuthStore";

export const useLynkStore = create((set, get) => ({
  lynkRequest: [],
  lynkSent: [],
  myLynk: [],

  getLynkRequests: async () => {
    try {
      const res = await axiosInstance.get("/request/incoming");
      set({ lynkRequest: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch Lynk requests"
      );
      return [];
    }
  },

  getSentLynkRequests: async () => {
    try {
      const res = await axiosInstance.get("/request/outgoing");
      set({ lynkSent: res.data });
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch sent Lynk requests"
      );
      return [];
    }
  },

  acceptLynkRequest: async (senderID) => {
    try {
      await axiosInstance.put("/request/accept", { senderID });
      const { authUser } = useAuthStore.getState();
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      toast.success("Lynk request accepted");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to accept Lynk request"
      );
    }
  },

  rejectLynkRequest: async (senderID) => {
    try {
      await axiosInstance.put("/request/reject", { senderID });
      toast.success("Lynk request rejected");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to reject Lynk request"
      );
    }
  },

  cancelLynkRequest: async (receiverID) => {
    try {
      await axiosInstance.put("/request/cancel", { receiverID });
      toast.success("Lynk request canceled");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to cancel Lynk request"
      );
    }
  },

  removeLynk: async (lynkId) => {
    try {
      await axiosInstance.put("/request/remove-lynk", { lynkId });
      const { authUser } = useAuthStore.getState();
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      toast.success("Lynk removed successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to remove Lynk");
    }
  },

  getLynks: async () => {
    try {
      const res = await axiosInstance.get("/request/my-lynks");
      set({ myLynk: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch Lynks");
      return [];
    }
  },

  sendLynkRequest: async (receiverID) => {
    try {
      await axiosInstance.post("/request/send", { receiverID });
      toast.success("Lynk request sent");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send Lynk request"
      );
    }
  },
}));
