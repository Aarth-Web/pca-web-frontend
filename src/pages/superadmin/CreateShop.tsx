import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import { ShopFormData } from "../../types/superadmin";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

const CreateShop: React.FC = () => {
  const [formData, setFormData] = useState<ShopFormData>({
    name: "",
    address: "",
    ownerPhone: "",
    ownerPassword: "",
    ownerEmail: "",
    upiId: "",
    qrCodeImageUrl: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox separately for boolean values
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // In a real app, you would upload this to your server or cloud storage
    // Here we're simulating with a mock upload function
    setUploadingImage(true);
    try {
      // Simulate file upload delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create a data URL for the image (in a real app, you'd get a URL from your server)
      const reader = new FileReader();
      reader.onload = () => {
        setFormData((prev) => ({
          ...prev,
          qrCodeImageUrl: reader.result as string,
        }));
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("Failed to upload image.");
      setUploadingImage(false);
    }
  };

  // Handle name change
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData((prev) => ({
      ...prev,
      name,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure ownerPassword is provided
      if (!formData.ownerPassword) {
        toast.error("Owner password is required");
        setLoading(false);
        return;
      }

      // Validate phone number
      if (!formData.ownerPhone || !/^\d{10}$/.test(formData.ownerPhone)) {
        toast.error("Please enter a valid 10-digit phone number");
        setLoading(false);
        return;
      }

      await api.createShop({
        name: formData.name,
        address: formData.address,
        ownerPhone: formData.ownerPhone,
        ownerPassword: formData.ownerPassword,
        ownerEmail: formData.ownerEmail,
        upiId: formData.upiId,
        qrCodeImageUrl: formData.qrCodeImageUrl,
      });
      toast.success("Shop created successfully!");
      navigate("/superadmin/shops");
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to create shop.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Create New Shop</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Shop Information */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Shop Information
              </h2>
              <div className="border-t border-gray-200 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      id="name"
                      name="name"
                      label="Shop Name"
                      value={formData.name}
                      onChange={handleNameChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      id="ownerPhone"
                      name="ownerPhone"
                      label="Owner Phone"
                      type="tel"
                      value={formData.ownerPhone}
                      onChange={handleChange}
                      required
                      helpText="10-digit phone number (for login)"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label
                      htmlFor="address"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Address
                    </label>
                    <textarea
                      id="address"
                      name="address"
                      rows={3}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                      placeholder="Enter shop address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Owner Information */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Shop Owner Information
              </h2>
              <div className="border-t border-gray-200 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      id="ownerEmail"
                      name="ownerEmail"
                      label="Owner Email"
                      type="email"
                      value={formData.ownerEmail}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      id="ownerPassword"
                      name="ownerPassword"
                      label="Owner Password"
                      type="password"
                      value={formData.ownerPassword}
                      onChange={handleChange}
                      required
                      helpText="Must be at least 8 characters"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Payment Information
              </h2>
              <div className="border-t border-gray-200 pt-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Input
                      id="upiId"
                      name="upiId"
                      label="UPI ID"
                      value={formData.upiId}
                      onChange={handleChange}
                      required
                      helpText="e.g., username@bankname"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      QR Code Image
                    </label>
                    <div className="mt-1 flex items-center">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      />
                      {uploadingImage && <Spinner />}
                    </div>
                    {formData.qrCodeImageUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.qrCodeImageUrl}
                          alt="QR Code Preview"
                          className="h-32 w-32 object-contain border rounded"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Shop Status */}
            <div className="col-span-1 md:col-span-2">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                Shop Status
              </h2>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center">
                  <input
                    id="isActive"
                    name="isActive"
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        isActive: e.target.checked,
                      }))
                    }
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-900"
                  >
                    Shop is active and visible to customers
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/superadmin/shops")}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading || uploadingImage}>
                {loading ? <Spinner /> : "Create Shop"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateShop;
