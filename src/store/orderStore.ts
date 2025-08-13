import { create } from "zustand";
import { Order } from "../types/shopadmin";

interface OrderState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  getOrderById: (id: string) => Order | undefined;
  clearOrders: () => void;
}

const useOrderStore = create<OrderState>()((set, get) => ({
  orders: [],
  setOrders: (orders) => set({ orders }),
  getOrderById: (id) => get().orders.find((order) => order._id === id),
  clearOrders: () => set({ orders: [] }),
}));

export default useOrderStore;
