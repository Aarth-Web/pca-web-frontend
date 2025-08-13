import axios from "axios";
import useAuthStore from "../store/authStore";
import { Shop } from "../types/superadmin";
import { CreateOrderDto, UpdateOrderDto } from "../types/shopadmin";

const axiosInstance = axios.create({
  baseURL: "https://pca-backend-r66w.onrender.com", // Replace with your actual API base URL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle unauthorized errors globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Check if the error is an unauthorized error (401)
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized access detected. Logging out...");

      // Clear auth state
      useAuthStore.getState().clearAuth();

      // Redirect to login page
      // Use a timeout to ensure this happens after the current call stack is cleared
      setTimeout(() => {
        window.location.href = "/login?unauthorized=true";
      }, 0);
    }
    return Promise.reject(error);
  }
);

// API endpoints
export const api = {
  // Auth endpoints
  login: (data: { phone: string; password: string }) => {
    return axiosInstance.post("/auth/login", data);
  },
  superadminLogin: (data: { phone: string; password: string }) => {
    return axiosInstance.post("/auth/login", data); // Same endpoint for backward compatibility
  },
  shopadminLogin: (data: { phone: string; password: string }) => {
    return axiosInstance.post("/auth/login", data); // Same endpoint for backward compatibility
  },

  // Superadmin shop management endpoints
  getShops: (params?: { search?: string; page?: number; limit?: number }) => {
    return axiosInstance.get("/shops", { params });
  },
  getShopDetails: (id: string) => {
    return axiosInstance.get(`/shops/${id}`);
  },
  createShop: (data: {
    name: string;
    address: string;
    ownerPhone: string;
    ownerPassword: string;
    ownerEmail: string;
    upiId: string;
    qrCodeImageUrl?: string;
  }) => {
    return axiosInstance.post("/shops", data);
  },
  updateShop: (
    id: string,
    data: {
      name?: string;
      address?: string;
      upiId?: string;
      qrCodeImageUrl?: string;
      isActive?: boolean;
    }
  ) => {
    return axiosInstance.patch(`/shops/${id}`, data);
  },
  deleteShop: (id: string) => {
    return axiosInstance.delete(`/shops/${id}`);
  },
  // Shop Admin Order endpoints
  getShopOrders: (
    shopId: string,
    params?: {
      status?: string;
      customerName?: string;
      page?: number;
      limit?: number;
    }
  ) => {
    return axiosInstance.get(`/orders/shops/${shopId}/orders`, { params });
  },

  // Calculate shop stats from the shops list response
  calculateShopStats: (shops: Shop[]) => {
    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const totalShops = shops.length;
    const activeShops = shops.filter((shop) => shop.isActive).length;
    const inactiveShops = totalShops - activeShops;
    const newShopsThisMonth = shops.filter(
      (shop) => new Date(shop.createdAt) > oneMonthAgo
    ).length;

    // Simple calculation for growth rate
    const shopGrowthRate =
      totalShops > 0 ? (newShopsThisMonth / totalShops) * 100 : 0;

    return {
      totalShops,
      activeShops,
      inactiveShops,
      newShopsThisMonth,
      shopGrowthRate: Math.round(shopGrowthRate),
    };
  },
  createOrder: (shopId: string, data: CreateOrderDto) => {
    return axiosInstance.post(`/orders/shops/${shopId}/orders`, data);
  },
  updateOrder: (shopId: string, orderId: string, data: UpdateOrderDto) => {
    return axiosInstance.patch(
      `/orders/shops/${shopId}/orders/${orderId}`,
      data
    );
  },
  deleteOrder: (shopId: string, orderId: string) => {
    return axiosInstance.delete(`/orders/shops/${shopId}/orders/${orderId}`);
  },
  getPaymentDetails: (shopId: string) => {
    // In a real app, this would be an API call
    // For now, we're using a mock response
    console.log("getPaymentDetails for shopId", shopId);
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            data: {
              accountName: "Shop Owner",
              accountNumber: "1234567890",
              bank: "Dummy Bank",
              upiId: "shopowner@upi",
              qrCodeImageUrl:
                "https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg",
            },
          }),
        500
      )
    );
  },
  getShopPublicData: (shopId: string) => {
    return axiosInstance.get(`/public/${shopId}`);
  },
  getPublicOrders: (shopId: string, search?: string) => {
    return axiosInstance.get(`/public/${shopId}/orders`, {
      params: { search },
    });
  },
};

export default axiosInstance;
