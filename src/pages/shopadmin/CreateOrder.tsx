import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import useAuthStore from "../../store/authStore";
import useOrderStore from "../../store/orderStore";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";
import { CreateOrderDto, OrderItem } from "../../types/shopadmin";
import { TrashIcon, PlusIcon } from "@heroicons/react/24/outline";

const CreateOrder: React.FC = () => {
  const [customerName, setCustomerName] = useState("");
  const [amount, setAmount] = useState("");
  const [items, setItems] = useState<OrderItem[]>([{ name: "", quantity: 1 }]);
  const [dueDate, setDueDate] = useState<string>(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { shopId } = useAuthStore();

  const handleAddItem = () => {
    setItems([...items, { name: "", quantity: 1 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (
    index: number,
    field: keyof OrderItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = {
      ...newItems[index],
      [field]: field === "quantity" ? Number(value) : value,
    };
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId) {
      toast.error("Shop ID not found");
      return;
    }

    if (items.some((item) => !item.name)) {
      toast.error("All items must have a name");
      return;
    }

    setLoading(true);
    try {
      const orderData: CreateOrderDto = {
        customerName,
        amount: parseFloat(amount),
        items,
        dueDate: new Date(dueDate).toISOString(),
      };

      const response = await api.createOrder(shopId, orderData);

      // Add the new order to the store
      const newOrder = response.data;
      const currentOrders = useOrderStore.getState().orders;
      useOrderStore.getState().setOrders([newOrder, ...currentOrders]);

      toast.success("Order created successfully!");
      navigate("/shopadmin/orders");
    } catch (error) {
      console.error("Create order error:", error);
      toast.error("Failed to create order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 md:p-4">
      <h1 className="text-2xl font-bold mb-4">Create New Order</h1>
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Customer Information
            </h2>
            <div className="border-t border-gray-200 pt-3">
              <Input
                id="customerName"
                label="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                required
                className="mb-4"
              />
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Order Items
            </h2>
            <div className="border-t border-gray-200 pt-3">
              {items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-wrap md:flex-nowrap items-end gap-2 mb-3"
                >
                  <div className="w-full md:w-3/5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div className="w-1/2 md:w-1/5">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quantity
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        handleItemChange(index, "quantity", e.target.value)
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div className="w-1/2 md:w-auto md:flex-grow">
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                      className={`px-3 py-2 rounded-md w-full ${
                        items.length === 1
                          ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-red-100 text-red-600 hover:bg-red-200"
                      }`}
                    >
                      <TrashIcon className="h-5 w-5 mx-auto" />
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddItem}
                className="mt-2 flex items-center justify-center w-full py-2 px-4 border border-dashed border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:border-gray-400 hover:bg-gray-50"
              >
                <PlusIcon className="h-5 w-5 mr-1" /> Add Item
              </button>
            </div>
          </div>

          {/* Order Details */}
          <div>
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Order Details
            </h2>
            <div className="border-t border-gray-200 pt-3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  id="amount"
                  label="Total Amount (₹)"
                  type="number"
                  min="0"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  required
                />
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200 flex justify-end space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => navigate("/shopadmin/orders")}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner /> : "Create Order"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateOrder;
