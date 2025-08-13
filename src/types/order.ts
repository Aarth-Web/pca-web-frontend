export enum OrderStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  PREPARED = "PREPARED",
  PAYMENT_PENDING = "PAYMENT_PENDING",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  COMPLETED = "COMPLETED",
}

export interface Order {
  _id: string;
  shopId: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
  }[];
  amount: number;
  status: OrderStatus;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}
