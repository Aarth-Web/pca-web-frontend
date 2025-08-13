import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import Spinner from "../../components/common/Spinner";

interface PaymentTabProps {
  shopId: string;
}

const PaymentTab: React.FC<PaymentTabProps> = ({ shopId }) => {
  const [details, setDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await api.getPaymentDetails(shopId);
        // @ts-ignore
        setDetails(response.data);
      } catch (error) {
        toast.error("Failed to fetch payment details.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [shopId]);

  if (loading) return <Spinner />;

  return (
    <div>
      <h2 className="text-xl font-semibold">Payment Information</h2>
      {details ? (
        <div>
          <p>
            <strong>Account Name:</strong> {details.accountName}
          </p>
          <p>
            <strong>Account Number:</strong> {details.accountNumber}
          </p>
          <p>
            <strong>Bank:</strong> {details.bank}
          </p>
        </div>
      ) : (
        <p>No payment details available.</p>
      )}
    </div>
  );
};

export default PaymentTab;
