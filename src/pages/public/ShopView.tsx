import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import Spinner from "../../components/common/Spinner";
import {
  CreditCardIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";

interface ShopData {
  _id: string;
  name: string;
  slug: string;
  address: string;
  upiId: string;
  qrCodeImageUrl: string;
}

const ShopView: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shop, setShop] = useState<ShopData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShop = async () => {
      if (!shopId) return;
      setLoading(true);
      try {
        const response = await api.getShopPublicData(shopId);
        setShop(response.data);
      } catch (error) {
        toast.error("Failed to fetch shop data.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchShop();
  }, [shopId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  if (!shop) {
    return (
      <div className="text-center text-red-500 mt-10">Shop not found.</div>
    );
  }

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
          {shop.name}
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Easy and Secure Online Payments
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Payment Details Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
            <CreditCardIcon className="h-8 w-8 mr-3 text-blue-600" />
            Payment Details
          </h2>
          <div className="flex flex-col items-center text-center">
            <p className="text-gray-600 mb-4">
              Scan the QR code below to pay with any UPI app.
            </p>
            <div className="p-4 border-4 border-gray-200 rounded-lg inline-block">
              <img
                src={shop.qrCodeImageUrl}
                alt="UPI QR Code"
                className="w-48 h-48 md:w-64 md:h-64 object-contain"
              />
            </div>
            <p className="mt-4 text-gray-600">Or pay using UPI ID:</p>
            <p className="text-lg font-semibold text-gray-800 bg-gray-100 px-4 py-2 rounded-full mt-2">
              {shop.upiId}
            </p>
          </div>
        </div>

        {/* About Us Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center mb-4">
            <InformationCircleIcon className="h-8 w-8 mr-3 text-blue-600" />
            About Us
          </h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold">Shop Name:</h3>
              <p>{shop.name}</p>
            </div>
            <div>
              <h3 className="font-semibold">Address:</h3>
              <p>{shop.address}</p>
            </div>
            <div>
              <h3 className="font-semibold">Instructions:</h3>
              <p>
                After making the payment, please make sure to confirm with the
                shop owner and mention your order details.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopView;
