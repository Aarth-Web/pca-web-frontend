import React from "react";

interface OrdersTabProps {
  shopId: string;
}

const OrdersTab: React.FC<OrdersTabProps> = ({ shopId }) => {
  // In a real app, you might fetch and display orders for this shop
  return (
    <div>
      <h2 className="text-xl font-semibold">Place an Order</h2>
      <p>
        This is where customers can see products and place orders for shop{" "}
        {shopId}.
      </p>
      {/* Placeholder for order form or product list */}
    </div>
  );
};

export default OrdersTab;
