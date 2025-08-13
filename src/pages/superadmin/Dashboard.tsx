import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import { SuperAdminDashboardStats } from "../../types/superadmin";
import Spinner from "../../components/common/Spinner";
import {
  BuildingStorefrontIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusCircleIcon,
  ArrowTrendingUpIcon,
} from "@heroicons/react/24/outline";

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<SuperAdminDashboardStats | null>(null);

  const fetchDashboardData = async () => {
    try {
      const response = await api.getShops();
      const shops = response.data;

      // Generate stats from the shops data
      const shopStats = api.calculateShopStats(shops);

      // Get the 5 most recent shops for the dashboard
      const recentShops = [...shops]
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .slice(0, 5);

      setStats({
        shopStats,
        recentShops,
      });
    } catch (error) {
      console.error("Dashboard error:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteShop = async (shopId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this shop? This action cannot be undone."
      )
    ) {
      try {
        await api.deleteShop(shopId);
        toast.success("Shop deleted successfully!");
        fetchDashboardData(); // Refresh dashboard data after deletion
      } catch (error) {
        toast.error("Failed to delete shop.");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold">Superadmin Dashboard</h1>
        <p className="text-red-500 mt-4">
          Failed to load dashboard data. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="p-1">
      <h1 className="text-3xl font-bold mb-6">Superadmin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatsCard
          title="Total Shops"
          value={stats.shopStats.totalShops}
          icon={<BuildingStorefrontIcon className="h-8 w-8" />}
          color="blue"
        />
        <StatsCard
          title="Active Shops"
          value={stats.shopStats.activeShops}
          icon={<CheckCircleIcon className="h-8 w-8" />}
          color="green"
        />
        <StatsCard
          title="Inactive Shops"
          value={stats.shopStats.inactiveShops}
          icon={<XCircleIcon className="h-8 w-8" />}
          color="red"
        />
        <StatsCard
          title="New Shops This Month"
          value={stats.shopStats.newShopsThisMonth}
          icon={<PlusCircleIcon className="h-8 w-8" />}
          color="purple"
          secondaryInfo={
            stats.shopStats.shopGrowthRate > 0
              ? `+${stats.shopStats.shopGrowthRate}% from last month`
              : `${stats.shopStats.shopGrowthRate}% from last month`
          }
          trend={stats.shopStats.shopGrowthRate > 0 ? "up" : "down"}
        />
      </div>

      {/* Recent Shops */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recent Shops</h2>
          <Link
            to="/superadmin/shops"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View All
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.recentShops.map((shop) => (
                <tr key={shop._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{shop.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-gray-500">{shop.ownerEmail}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        shop.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {shop.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(shop.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <Link
                        to={`/superadmin/shops/edit/${shop._id}`}
                        state={{ shop }}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/shop/${shop.slug}`}
                        className="text-green-600 hover:text-green-900"
                        target="_blank"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteShop(shop._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: "blue" | "green" | "red" | "purple" | "yellow";
  secondaryInfo?: string;
  trend?: "up" | "down";
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon,
  color,
  secondaryInfo,
  trend,
}) => {
  const colorClasses = {
    blue: "bg-blue-500 text-white",
    green: "bg-green-500 text-white",
    red: "bg-red-500 text-white",
    purple: "bg-purple-500 text-white",
    yellow: "bg-yellow-500 text-white",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className={`p-4 ${colorClasses[color]}`}>
        <div className="flex justify-between">
          <div>
            <p className="text-sm font-medium opacity-80">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {secondaryInfo && (
              <div className="flex items-center mt-1 text-xs">
                {trend === "up" ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1 rotate-0" />
                ) : trend === "down" ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 mr-1 rotate-180" />
                ) : null}
                <span>{secondaryInfo}</span>
              </div>
            )}
          </div>
          <div className="rounded-full bg-white/20 p-3">{icon}</div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
