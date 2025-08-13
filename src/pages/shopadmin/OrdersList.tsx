import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import { Order } from "../../types/shopadmin";
import useAuthStore from "../../store/authStore";
import useOrderStore from "../../store/orderStore";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import OrdersTable from "../../components/common/OrdersTable";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const OrdersList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalOrders, setTotalOrders] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { shopId } = useAuthStore();
  const PAGE_SIZE = 10;

  // Fetch all orders from the API
  const fetchOrders = async () => {
    if (!shopId) {
      toast.error("Shop ID not found");
      return;
    }

    setLoading(true);
    try {
      // Get all orders without pagination
      const response = await api.getShopOrders(shopId);
      const allOrders = response.data;

      // Store all orders in the orderStore for reuse
      useOrderStore.getState().setOrders(allOrders);
      setOrders(allOrders);

      // Apply filtering and pagination
      applyFiltering(allOrders, searchQuery);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      toast.error("Failed to fetch orders.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filtering and pagination to orders
  const applyFiltering = (allOrders: Order[], search: string) => {
    // Filter orders if search query is provided
    let result = allOrders;
    if (search) {
      const searchLower = search.toLowerCase();
      result = allOrders.filter((order) =>
        order.customerName.toLowerCase().includes(searchLower)
      );
    }

    // Set total values for pagination
    const totalItems = result.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);

    setFilteredOrders(result);
    setTotalOrders(totalItems);
    setTotalPages(totalPages);

    // Apply pagination
    applyPagination(result, currentPage);
  };

  // Apply pagination to filtered orders
  const applyPagination = (filteredList: Order[], page: number) => {
    const startIndex = (page - 1) * PAGE_SIZE;
    const paginatedOrders = filteredList.slice(
      startIndex,
      startIndex + PAGE_SIZE
    );
    setFilteredOrders(paginatedOrders);
    setCurrentPage(page);
  };

  // Initial data fetch
  useEffect(() => {
    fetchOrders();
  }, [shopId]);

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyFiltering(orders, searchQuery);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    applyPagination(filteredOrders, page);
  };

  // Handle deleting an order
  const handleDelete = async (orderId: string) => {
    if (!shopId) return;

    if (
      window.confirm(
        "Are you sure you want to delete this order? This action cannot be undone."
      )
    ) {
      try {
        await api.deleteOrder(shopId, orderId);

        // Also update the store to remove the deleted order
        const currentOrders = useOrderStore.getState().orders;
        const updatedOrders = currentOrders.filter(
          (order) => order._id !== orderId
        );
        useOrderStore.getState().setOrders(updatedOrders);

        // Re-fetch orders to update the list
        toast.success("Order deleted successfully!");
        fetchOrders();
      } catch (error) {
        toast.error("Failed to delete order.");
      }
    }
  };

  return (
    <div className="p-3 md:p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Orders Management</h1>
        <Link to="/shopadmin/orders/create">
          <Button>Create New Order</Button>
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form onSubmit={handleSearchSubmit} className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-l-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Search by customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="p-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <MagnifyingGlassIcon className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No orders found</p>
          <Link to="/shopadmin/orders/create">
            <Button>Create Your First Order</Button>
          </Link>
        </div>
      ) : (
        <>
          <OrdersTable
            orders={filteredOrders}
            onDelete={handleDelete}
            showActions={true}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 mt-4 rounded-lg shadow-md">
              <div className="text-xs sm:text-sm text-gray-700 mb-4 sm:mb-0">
                <p>
                  Showing{" "}
                  <span className="font-medium">
                    {(currentPage - 1) * PAGE_SIZE + 1}
                  </span>{" "}
                  to{" "}
                  <span className="font-medium">
                    {Math.min(currentPage * PAGE_SIZE, totalOrders)}
                  </span>{" "}
                  of <span className="font-medium">{totalOrders}</span> orders
                </p>
              </div>
              <div className="flex justify-center w-full sm:w-auto">
                <nav
                  className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    &larr;
                  </button>

                  {/* Show limited page numbers on mobile */}
                  {totalPages <= 5 ? (
                    // If 5 or fewer pages, show all
                    [...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))
                  ) : (
                    // If more than 5 pages, show current, previous, next, first, last
                    <>
                      {/* First page */}
                      <button
                        onClick={() => handlePageChange(1)}
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                          currentPage === 1
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        1
                      </button>

                      {/* Ellipsis or page 2 */}
                      {currentPage > 3 && (
                        <span className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-gray-700">
                          ...
                        </span>
                      )}

                      {/* Current page and neighbors */}
                      {currentPage > 2 && currentPage < totalPages && (
                        <button
                          onClick={() => handlePageChange(currentPage - 1)}
                          className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          {currentPage - 1}
                        </button>
                      )}

                      {currentPage > 1 && currentPage < totalPages && (
                        <button className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-blue-500 bg-blue-50 text-xs sm:text-sm font-medium text-blue-600 z-10">
                          {currentPage}
                        </button>
                      )}

                      {currentPage < totalPages - 1 && (
                        <button
                          onClick={() => handlePageChange(currentPage + 1)}
                          className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                          {currentPage + 1}
                        </button>
                      )}

                      {/* Ellipsis or second last page */}
                      {currentPage < totalPages - 2 && (
                        <span className="relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-gray-700">
                          ...
                        </span>
                      )}

                      {/* Last page */}
                      <button
                        onClick={() => handlePageChange(totalPages)}
                        className={`relative inline-flex items-center px-3 sm:px-4 py-2 border border-gray-300 bg-white text-xs sm:text-sm font-medium ${
                          currentPage === totalPages
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {totalPages}
                      </button>
                    </>
                  )}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    &rarr;
                  </button>
                </nav>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OrdersList;
