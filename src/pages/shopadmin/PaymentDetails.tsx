import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import useAuthStore from "../../store/authStore";
import Spinner from "../../components/common/Spinner";
import {
  BanknotesIcon,
  QrCodeIcon,
  UserCircleIcon,
  BuildingLibraryIcon,
} from "@heroicons/react/24/outline";

interface PaymentDetail {
  accountName: string;
  accountNumber: string;
  bank: string;
  upiId?: string;
  qrCodeImageUrl?: string;
}

const PaymentDetails: React.FC = () => {
  const [details, setDetails] = useState<PaymentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const { shopId } = useAuthStore();

  useEffect(() => {
    const fetchPaymentDetails = async () => {
      if (!shopId) {
        toast.error("Shop ID not found");
        return;
      }

      try {
        const response = (await api.getPaymentDetails(shopId)) as {
          data: PaymentDetail;
        };
        setDetails(response.data);
      } catch (error) {
        toast.error("Failed to load payment details.");
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentDetails();
  }, [shopId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Payment Details</h1>
      {details ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Bank Account Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details for receiving payments from customers.
            </p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserCircleIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Account Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {details.accountName}
                </dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BanknotesIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Account Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {details.accountNumber}
                </dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <BuildingLibraryIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Bank Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {details.bank}
                </dd>
              </div>
              {details.upiId && (
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500 flex items-center">
                    <QrCodeIcon className="h-5 w-5 mr-2 text-gray-400" />
                    UPI ID
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {details.upiId}
                  </dd>
                </div>
              )}
            </dl>
          </div>
          {details.qrCodeImageUrl && (
            <div className="px-4 py-5 sm:px-6">
              <h4 className="text-md font-medium text-gray-900 mb-3">
                Payment QR Code
              </h4>
              <div className="flex justify-center">
                <img
                  src={details.qrCodeImageUrl}
                  alt="Payment QR Code"
                  className="w-full max-w-[240px] border rounded-md"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <p className="text-gray-500">
            No payment details found for this shop.
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentDetails;
