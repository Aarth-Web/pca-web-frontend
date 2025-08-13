import React from "react";
import { Order, OrderStatus } from "../../types/order";

interface PublicOrdersTableProps {
  orders: Order[];
}

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case OrderStatus.IN_PROGRESS:
      return "bg-blue-100 text-blue-800";
    case OrderStatus.PREPARED:
      return "bg-indigo-100 text-indigo-800";
    case OrderStatus.PAYMENT_PENDING:
      return "bg-orange-100 text-orange-800";
    case OrderStatus.READY_FOR_PICKUP:
      return "bg-purple-100 text-purple-800";
    case OrderStatus.COMPLETED:
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

/**
 * A responsive table specifically designed for displaying public orders
 */
const PublicOrdersTable: React.FC<PublicOrdersTableProps> = ({ orders }) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-center">
        <p className="text-gray-500 text-sm">No orders found</p>
      </div>
    );
  }

  // Desktop view
  const desktopView = (
    <div className="hidden sm:block overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer Name
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Due Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order ID
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders.map((order) => (
            <tr key={order._id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                {order.customerName}
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                    order.status
                  )}`}
                >
                  {order.status.replace("_", " ")}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                ₹{order.amount.toFixed(2)}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                {new Date(order.dueDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                {order._id.slice(-6)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile view (card-based UI)
  const mobileView = (
    <div className="sm:hidden space-y-2">
      {orders.map((order) => (
        <div
          key={order._id}
          className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
        >
          {/* Card header with customer name */}
          <div className="px-3 py-2 bg-gray-50 flex justify-between items-center border-b border-gray-100">
            <div className="font-medium text-sm truncate">
              {order.customerName}
            </div>
            <div>
              <span
                className={`px-2 py-1 inline-flex text-xs leading-none font-semibold rounded-full ${getStatusColor(
                  order.status
                )}`}
              >
                {order.status.replace("_", " ")}
              </span>
            </div>
          </div>

          {/* Card body with other details */}
          <div className="p-3 space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">Amount:</div>
              <div className="text-sm font-semibold">
                ₹{order.amount.toFixed(2)}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-xs text-gray-500">Due Date:</div>
              <div className="text-xs">
                {new Date(order.dueDate).toLocaleDateString()}
              </div>
            </div>

            <div className="flex justify-between items-center pt-1 mt-1 border-t border-gray-100">
              <div className="text-xs text-gray-500">Order ID:</div>
              <div className="text-xs font-mono">{order._id.slice(-6)}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {mobileView}
      {desktopView}
    </>
  );
};

export default PublicOrdersTable;
