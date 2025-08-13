import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import { Shop } from "../../types/superadmin";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { MagnifyingGlassIcon, FunnelIcon } from "@heroicons/react/24/outline";

const ShopsList: React.FC = () => {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalShops, setTotalShops] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterActive, setFilterActive] = useState<boolean | null>(null);
  const PAGE_SIZE = 10;

  const fetchShops = async (
    page = 1,
    search = searchQuery,
    activeFilter = filterActive
  ) => {
    setLoading(true);
    try {
      // Call the API without parameters since the backend doesn't support them yet
      const response = await api.getShops();

      // Get the array of shops from the response
      let shops = response.data;

      // Client-side filtering and search
      if (search) {
        const searchLower = search.toLowerCase();
        shops = shops.filter(
          (shop: Shop) =>
            shop.name.toLowerCase().includes(searchLower) ||
            shop.address.toLowerCase().includes(searchLower)
        );
      }

      if (activeFilter !== null) {
        shops = shops.filter((shop: Shop) => shop.isActive === activeFilter);
      }

      // Client-side pagination
      const totalItems = shops.length;
      const totalPages = Math.ceil(totalItems / PAGE_SIZE);
      const startIndex = (page - 1) * PAGE_SIZE;
      const paginatedShops = shops.slice(startIndex, startIndex + PAGE_SIZE);

      setShops(paginatedShops);
      setTotalShops(totalItems);
      setCurrentPage(page);
      setTotalPages(totalPages);
    } catch (error) {
      toast.error("Failed to fetch shops.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops(1);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchShops(1, searchQuery, filterActive);
  };

  const handlePageChange = (page: number) => {
    fetchShops(page, searchQuery, filterActive);
  };

  const handleFilterChange = (value: boolean | null) => {
    setFilterActive(value);
    fetchShops(1, searchQuery, value);
  };

  const handleDelete = async (shopId: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this shop? This action cannot be undone."
      )
    ) {
      try {
        await api.deleteShop(shopId);
        toast.success("Shop deleted successfully!");
        fetchShops(currentPage, searchQuery, filterActive);
      } catch (error) {
        toast.error("Failed to delete shop.");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold mb-4 sm:mb-0">Shops Management</h1>
        <Link to="/superadmin/shops/create">
          <Button>Create New Shop</Button>
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-col sm:flex-row gap-4"
        >
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              placeholder="Search by shop name, email or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center">
            <FunnelIcon className="h-5 w-5 text-gray-400 mr-2" />
            <span className="text-gray-700 mr-2">Filter:</span>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  filterActive === null
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleFilterChange(null)}
              >
                All
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  filterActive === true
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleFilterChange(true)}
              >
                Active
              </button>
              <button
                type="button"
                className={`px-3 py-1 text-sm rounded-md ${
                  filterActive === false
                    ? "bg-red-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => handleFilterChange(false)}
              >
                Inactive
              </button>
            </div>
          </div>

          <Button type="submit">Search</Button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : shops.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-500 mb-4">No shops found</p>
          <Link to="/superadmin/shops/create">
            <Button>Create Your First Shop</Button>
          </Link>
        </div>
      ) : (
        <>
          {/* Shops Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Shop Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Owner Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Address
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Created
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {shops.map((shop) => (
                    <tr key={shop._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {shop.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500">{shop.ownerEmail}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-500 max-w-xs truncate">
                          {shop.address}
                        </div>
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
                            onClick={() => handleDelete(shop._id)}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4 rounded-lg shadow-md">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">
                      {(currentPage - 1) * PAGE_SIZE + 1}
                    </span>{" "}
                    to{" "}
                    <span className="font-medium">
                      {Math.min(currentPage * PAGE_SIZE, totalShops)}
                    </span>{" "}
                    of <span className="font-medium">{totalShops}</span> results
                  </p>
                </div>
                <div>
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
                      Previous
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === i + 1
                            ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                            : "text-gray-500 hover:bg-gray-50"
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-gray-500 hover:bg-gray-50 cursor-pointer"
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ShopsList;
