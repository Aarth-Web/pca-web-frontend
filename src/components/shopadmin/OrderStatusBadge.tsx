import React from "react";
import { OrderStatus } from "../../types/shopadmin";

export interface OrderStatusBadgeProps {
  status: OrderStatus | string;
  small?: boolean; // Add small prop for more compact display
}

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({
  status,
  small = false,
}) => {
  const statusColors = {
    PENDING: "bg-yellow-100 text-yellow-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
  };

  const statusText = {
    PENDING: "Pending",
    IN_PROGRESS: "In Progress",
    COMPLETED: "Completed",
    CANCELLED: "Cancelled",
  };

  return (
    <span
      className={`${
        small ? "px-1.5 py-0.5" : "px-2 py-1"
      } inline-flex text-xs leading-none font-semibold rounded-full ${
        statusColors[status as keyof typeof statusColors] ||
        "bg-gray-100 text-gray-800"
      }`}
    >
      {statusText[status as keyof typeof statusText] || status}
    </span>
  );
};

export default OrderStatusBadge;
