import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import useAuthStore from "../../store/authStore";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

const ShopAdminLogin: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.login({ phone, password });
      const { access_token, user } = response.data;

      if (user.role !== "SHOPADMIN") {
        toast.error("You do not have shop admin privileges");
        setLoading(false);
        return;
      }

      // Store the token, role, shopId, and user object
      setAuth(access_token, user.role, user.shopId, user);

      toast.success("Logged in successfully!");
      navigate("/shopadmin/dashboard");
    } catch (error) {
      toast.error("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          Shop Admin Login
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <Input
              id="phone"
              label="Phone Number"
              type="text"
              placeholder="e.g., 9765482996"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              helpText="Enter your 10-digit phone number"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mt-6">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? <Spinner /> : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ShopAdminLogin;
