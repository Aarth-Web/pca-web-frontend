import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { api } from "../../api/axiosInstance";
import useAuthStore from "../../store/authStore";
import useOrderStore from "../../store/orderStore";
import { Order, OrdersStats } from "../../types/shopadmin";
import Spinner from "../../components/common/Spinner";
import StatsCard from "../../components/shopadmin/StatsCard";
import OrderStatusBadge from "../../components/shopadmin/OrderStatusBadge";
import OrdersTable from "../../components/common/OrdersTable";
import {
  ShoppingBagIcon,
  ClockIcon,
  CheckCircleIcon,
  CurrencyRupeeIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<OrdersStats>({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    inProgressOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const { shopId } = useAuthStore();

  const handleDelete = async (orderId: string) => {
    if (!shopId) return;

    if (
      window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      try {
        await api.deleteOrder(shopId, orderId);

        // Update the store to remove the deleted order
        const currentOrders = useOrderStore.getState().orders;
        const updatedOrders = currentOrders.filter(
          (order) => order._id !== orderId
        );
        useOrderStore.getState().setOrders(updatedOrders);

        // Update the recent orders list in the dashboard
        setRecentOrders((prev) =>
          prev.filter((order) => order._id !== orderId)
        );

        toast.success("Order deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete order.");
      }
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!shopId) {
        toast.error("Shop ID not found");
        return;
      }

      try {
        setLoading(true);
        // Get all orders to calculate stats on the client side
        const response = await api.getShopOrders(shopId);
        const orders = response.data;

        // Store all orders in the order store for reuse in other components
        // This will avoid additional API calls when viewing or editing orders
        useOrderStore.getState().setOrders(orders);

        // Calculate stats
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(
          (order: any) => order.status === "PENDING"
        ).length;
        const inProgressOrders = orders.filter(
          (order: any) => order.status === "IN_PROGRESS"
        ).length;
        const completedOrders = orders.filter(
          (order: any) => order.status === "COMPLETED"
        ).length;
        const cancelledOrders = orders.filter(
          (order: any) => order.status === "CANCELLED"
        ).length;
        const totalRevenue = orders.reduce(
          (sum: number, order: any) =>
            sum + (order.status === "COMPLETED" ? order.amount : 0),
          0
        );

        setStats({
          totalOrders,
          pendingOrders,
          inProgressOrders,
          completedOrders,
          cancelledOrders,
          totalRevenue,
        });

        // Get 5 most recent orders
        const sortedOrders = [...orders]
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )
          .slice(0, 5);

        setRecentOrders(sortedOrders);
      } catch (error) {
        console.error("Dashboard error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [shopId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-2 md:p-4">
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">
        Shop Dashboard
      </h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
        <StatsCard
          title="Total Orders"
          value={stats.totalOrders}
          icon={<ShoppingBagIcon className="h-7 w-7" />}
          color="blue"
        />
        <StatsCard
          title="Pending"
          value={stats.pendingOrders}
          icon={<ClockIcon className="h-7 w-7" />}
          color="yellow"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgressOrders}
          icon={<ClockIcon className="h-7 w-7" />}
          color="orange"
        />
        <StatsCard
          title="Completed"
          value={stats.completedOrders}
          icon={<CheckCircleIcon className="h-7 w-7" />}
          color="green"
        />
        <StatsCard
          title="Revenue"
          value={`₹${stats.totalRevenue.toFixed(2)}`}
          icon={<CurrencyRupeeIcon className="h-7 w-7" />}
          color="indigo"
          isMonetary
        />
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-lg md:text-xl font-semibold">Recent Orders</h2>
          <Link
            to="/shopadmin/orders"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium px-3 py-1.5 bg-blue-50 rounded-md"
          >
            View All Orders
          </Link>
        </div>
        <div className="overflow-x-auto">
          {recentOrders.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              No orders found. Create your first order!
            </div>
          ) : (
            <OrdersTable
              orders={recentOrders}
              onDelete={(id) => handleDelete(id)}
              showActions={true}
              compact={false}
            />
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6">
        <h2 className="text-lg md:text-xl font-semibold mb-3">Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Link
            to="/shopadmin/orders/create"
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center shadow-sm transition"
          >
            <div className="rounded-full bg-blue-100 p-2 mr-3">
              <ShoppingBagIcon className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Create New Order</h3>
              <p className="text-sm text-gray-500">Add a new customer order</p>
            </div>
          </Link>
          <Link
            to="/shopadmin/orders"
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center shadow-sm transition"
          >
            <div className="rounded-full bg-yellow-100 p-2 mr-3">
              <ClockIcon className="h-5 w-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Manage Orders</h3>
              <p className="text-sm text-gray-500">
                View and update all orders
              </p>
            </div>
          </Link>
          <Link
            to="/shopadmin/payment"
            className="bg-white hover:bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center shadow-sm transition"
          >
            <div className="rounded-full bg-green-100 p-2 mr-3">
              <CurrencyRupeeIcon className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Payment Details</h3>
              <p className="text-sm text-gray-500">
                View your payment information
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
