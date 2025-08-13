export type OrderStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface OrderItem {
  name: string;
  quantity: number;
  price?: number;
}

export interface Order {
  _id: string;
  customerName: string;
  items: OrderItem[];
  amount: number;
  status: OrderStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  shopId: string;
}

export interface CreateOrderDto {
  customerName: string;
  items: OrderItem[];
  amount: number;
  dueDate: string;
}

export interface UpdateOrderDto {
  customerName?: string;
  items?: OrderItem[];
  amount?: number;
  status?: OrderStatus;
  dueDate?: string;
}

export interface OrdersListResponse {
  orders: Order[];
  totalCount: number;
  page: number;
  totalPages: number;
}

export interface OrdersStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  inProgressOrders: number;
  cancelledOrders: number;
  totalRevenue: number;
}
