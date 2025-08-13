import React from "react";
import { Link } from "react-router-dom";
import { Order } from "../../types/shopadmin";
import OrderStatusBadge from "../shopadmin/OrderStatusBadge";

interface OrdersTableProps {
  orders: Order[];
  onDelete?: (id: string) => void;
  showActions?: boolean;
  compact?: boolean; // For dashboard view
}

/**
 * A responsive table specifically designed for displaying orders
 */
const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onDelete,
  showActions = true,
  compact = false,
}) => {
  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-4 text-center">
        <p className="text-gray-500 text-sm">No orders found</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile view (card-based UI) */}
      <div className="sm:hidden space-y-2">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Card header with customer name and amount */}
            <div className="px-3 py-2 bg-gray-50 flex justify-between items-center border-b border-gray-100">
              <div className="font-medium text-sm truncate">
                {order.customerName}
              </div>
              <div className="text-sm font-semibold">
                ₹{order.amount.toFixed(2)}
              </div>
            </div>

            {/* Card body with other details */}
            <div className="p-3 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <div className="text-gray-500">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </div>
                <OrderStatusBadge status={order.status} small />
              </div>

              <div className="flex justify-between items-center text-xs">
                <div className="text-gray-500">
                  Due: {new Date(order.dueDate).toLocaleDateString()}
                </div>
                <div className="text-gray-500">
                  Created: {new Date(order.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Actions */}
              {showActions && (
                <div className="flex justify-between pt-1 mt-1 border-t border-gray-100">
                  <Link
                    to={`/shopadmin/orders/edit/${order._id}`}
                    state={{ order }}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium px-3 py-1.5 bg-blue-50 rounded-md mr-3"
                  >
                    Edit
                  </Link>
                  {onDelete && (
                    <button
                      onClick={() => onDelete(order._id)}
                      className="text-red-600 hover:text-red-900 text-xs font-medium px-3 py-1.5 bg-red-50 rounded-md"
                    >
                      Delete
                    </button>
                  )}
                </div>
              )}

              {/* View button for dashboard */}
              {compact && (
                <div className="flex justify-between pt-1 mt-1 border-t border-gray-100">
                  <Link
                    to={`/shopadmin/orders/edit/${order._id}`}
                    state={{ order }}
                    className="text-blue-600 hover:text-blue-900 text-xs font-medium px-3 py-1.5 bg-blue-50 rounded-md"
                  >
                    View Details
                  </Link>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop view (table) */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              {(showActions || compact) && (
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="font-medium text-gray-900 text-sm">
                    {order.customerName}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ₹{order.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap">
                  <OrderStatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {new Date(order.dueDate).toLocaleDateString()}
                </td>
                {(showActions || compact) && (
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                    <div className="flex justify-end space-x-4">
                      {showActions ? (
                        <>
                          <Link
                            to={`/shopadmin/orders/edit/${order._id}`}
                            state={{ order }}
                            className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 rounded-md"
                          >
                            Edit
                          </Link>
                          {onDelete && (
                            <button
                              onClick={() => onDelete(order._id)}
                              className="text-red-600 hover:text-red-900 px-3 py-1 bg-red-50 rounded-md"
                            >
                              Delete
                            </button>
                          )}
                        </>
                      ) : compact ? (
                        <Link
                          to={`/shopadmin/orders/edit/${order._id}`}
                          state={{ order }}
                          className="text-blue-600 hover:text-blue-900 px-3 py-1 bg-blue-50 rounded-md"
                        >
                          View Details
                        </Link>
                      ) : null}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrdersTable;
