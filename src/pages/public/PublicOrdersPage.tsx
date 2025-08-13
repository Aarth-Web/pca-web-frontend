import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import { Order, OrderStatus } from "../../types/order";
import Spinner from "../../components/common/Spinner";
import PublicOrdersTable from "../../components/public/PublicOrdersTable";
// import { SearchIcon } from "@heroicons/react/24/solid";

// Status color logic moved to PublicOrdersTable component

const PublicOrdersPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!shopId) return;
      setLoading(true);
      try {
        const response = await api.getPublicOrders(shopId, search);
        // @ts-ignore
        setOrders(response.data);
      } catch (error) {
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchOrders();
    }, 500);

    return () => clearTimeout(debounce);
  }, [shopId, search]);

  const paginatedOrders = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    return orders.slice(startIndex, startIndex + rowsPerPage);
  }, [orders, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(orders.length / rowsPerPage);

  return (
    <div className="bg-gray-50 min-h-screen">
      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
            <div className="relative w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search by customer name..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" /> */}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Rows per page:</span>
              <select
                value={rowsPerPage}
                onChange={(e) => {
                  setRowsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>

          {loading ? (
            <Spinner />
          ) : (
            <PublicOrdersTable orders={paginatedOrders} />
          )}

          <div className="flex justify-between items-center mt-6">
            <span className="text-sm text-gray-600">
              Showing{" "}
              {Math.min(orders.length, (currentPage - 1) * rowsPerPage + 1)} to{" "}
              {Math.min(orders.length, currentPage * rowsPerPage)} of{" "}
              {orders.length} results
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        <div id="payment" className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Online Payment Procedure</h2>
          <p className="text-gray-600">
            To pay online, please use the following details and mention your
            Order ID in the payment reference. After payment, please send a
            screenshot to our WhatsApp number.
          </p>
        </div>
      </main>
    </div>
  );
};

export default PublicOrdersPage;
