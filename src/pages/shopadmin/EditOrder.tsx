import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import useAuthStore from "../../store/authStore";
import useOrderStore from "../../store/orderStore";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { UpdateOrderDto, OrderStatus } from "../../types/shopadmin";

const EditOrder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const orderFromRoute = location.state?.order;

  const [formData, setFormData] = useState<UpdateOrderDto>({
    customerName: "",
    items: [],
    amount: 0,
    status: "PENDING",
    dueDate: new Date().toISOString().split("T")[0],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const { shopId } = useAuthStore();

  const [itemName, setItemName] = useState("");
  const [itemQuantity, setItemQuantity] = useState(1);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    // First priority: use order data passed directly via route state
    if (orderFromRoute) {
      setFormData({
        customerName: orderFromRoute.customerName,
        items: orderFromRoute.items || [],
        amount: orderFromRoute.amount,
        status: orderFromRoute.status,
        dueDate:
          orderFromRoute.dueDate?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
      setLoading(false);
      return;
    }

    // Second priority: try to get from the store (for scenarios like page refresh)
    const orderFromStore = useOrderStore.getState().getOrderById(id);

    if (orderFromStore) {
      setFormData({
        customerName: orderFromStore.customerName,
        items: orderFromStore.items || [],
        amount: orderFromStore.amount,
        status: orderFromStore.status,
        dueDate:
          orderFromStore.dueDate?.split("T")[0] ||
          new Date().toISOString().split("T")[0],
      });
      setLoading(false);
      return;
    }

    // Last resort: Redirect back to orders list since we don't have the data
    // We no longer need to fetch from API since we're passing data directly
    toast.error("Order data not available. Redirecting to orders list.");
    navigate("/shopadmin/orders");
  }, [id, orderFromRoute, navigate]);

  const handleAddItem = () => {
    if (!itemName.trim()) {
      toast.error("Item name is required");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      items: [
        ...(prev.items || []),
        { name: itemName, quantity: itemQuantity },
      ],
    }));

    setItemName("");
    setItemQuantity(1);
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items?.filter((_, i) => i !== index) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId || !id) return;
    setSaving(true);
    try {
      const response = await api.updateOrder(shopId, id, formData);

      // Also update the order in the store to keep it in sync
      const updatedOrder = response.data;
      const currentOrders = useOrderStore.getState().orders;
      const updatedOrders = currentOrders.map((order) =>
        order._id === id ? updatedOrder : order
      );
      useOrderStore.getState().setOrders(updatedOrders);

      toast.success("Order updated successfully!");
      navigate("/shopadmin/orders");
    } catch (error) {
      toast.error("Failed to update order.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Order</h1>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spinner />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="space-y-4">
            <Input
              id="customerName"
              label="Customer Name"
              value={formData.customerName}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  customerName: e.target.value,
                }))
              }
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Items
              </label>
              <div className="space-y-2">
                {formData.items &&
                  formData.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex flex-wrap items-center justify-between p-2 border rounded"
                    >
                      <div className="w-full sm:w-auto sm:flex-grow flex flex-col sm:flex-row sm:items-center">
                        <span className="font-medium">{item.name}</span>
                        <span className="sm:ml-2 text-gray-500 text-xs sm:text-sm">
                          Quantity: {item.quantity}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="mt-2 sm:mt-0 w-full sm:w-auto inline-flex items-center justify-center p-1 border border-transparent rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                        onClick={() => handleRemoveItem(index)}
                      >
                        <svg
                          className="h-4 w-4 mr-1"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-xs">Remove</span>
                      </button>
                    </div>
                  ))}

                <div className="flex flex-wrap sm:flex-nowrap gap-2 mt-2">
                  <div className="w-full sm:flex-grow">
                    <Input
                      id="itemName"
                      label="Item Name"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                    />
                  </div>
                  <div className="w-1/3 sm:w-24">
                    <Input
                      id="itemQuantity"
                      label="Qty"
                      type="number"
                      value={itemQuantity}
                      min={1}
                      onChange={(e) =>
                        setItemQuantity(parseInt(e.target.value) || 1)
                      }
                    />
                  </div>
                  <div className="w-2/3 sm:w-auto sm:pb-1 flex items-end">
                    <Button
                      type="button"
                      onClick={handleAddItem}
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Add Item
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Input
              id="amount"
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  amount: parseFloat(e.target.value) || 0,
                }))
              }
              required
            />

            <Input
              id="dueDate"
              label="Due Date"
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
              }
              required
            />

            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    status: e.target.value as OrderStatus,
                  }))
                }
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
          </div>
          <div className="mt-6 flex space-x-3">
            <Button type="submit" disabled={saving}>
              {saving ? <Spinner /> : "Update Order"}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/shopadmin/orders")}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};

export default EditOrder;
