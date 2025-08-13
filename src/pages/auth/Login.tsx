import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../../api/axiosInstance";
import useAuthStore from "../../store/authStore";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import Spinner from "../../components/common/Spinner";

const Login: React.FC = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { token, role, setAuth } = useAuthStore();

  // Redirect if user is already authenticated and check for unauthorized redirects
  useEffect(() => {
    // Check if the URL contains the unauthorized parameter
    const urlParams = new URLSearchParams(window.location.search);
    const unauthorized = urlParams.get("unauthorized");

    if (unauthorized === "true") {
      toast.error("Your session has expired. Please login again.");
      // Clean up the URL
      window.history.replaceState({}, document.title, "/login");
    }

    if (token && role) {
      if (role === "SUPERADMIN") {
        navigate("/superadmin/dashboard");
      } else if (role === "SHOPADMIN") {
        navigate("/shopadmin/dashboard");
      }
    }
  }, [token, role, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.login({ phone, password });
      const { access_token, user } = response.data;

      // Store token, role, and user info
      if (user.role === "SUPERADMIN") {
        setAuth(access_token, user.role, null, user);
        toast.success(`Welcome, ${user.name}!`);
        navigate("/superadmin/dashboard");
      } else if (user.role === "SHOPADMIN") {
        // Handle the nested shopId object from the API response
        const shopId =
          typeof user.shopId === "object" ? user.shopId._id : user.shopId;

        if (!shopId) {
          toast.error("No shop associated with this account");
          setLoading(false);
          return;
        }

        // Store the shop details if they came nested in the response
        const userWithShop = { ...user };

        // Save auth state
        setAuth(access_token, user.role, shopId, userWithShop);
        toast.success(
          `Welcome to ${
            typeof user.shopId === "object" ? user.shopId.name : "your shop"
          }!`
        );
        navigate("/shopadmin/dashboard");
      } else {
        toast.error("Unknown user role");
        setLoading(false);
      }
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(
        error.response?.data?.message ||
          "Failed to login. Please check your credentials."
      );
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-blue-600 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-white"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 005 10a6 6 0 0012 0c0-1.146-.32-2.217-.868-3.084A5 5 0 0010 7z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sign in to access your Order Manager dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-5">
            <Input
              id="phone"
              name="phone"
              label="Phone Number"
              type="tel"
              placeholder="e.g., 9765482996"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              helpText="Enter your 10-digit phone number"
              className="focus:ring-blue-500 focus:border-blue-500"
            />

            <Input
              id="password"
              name="password"
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full flex justify-center py-2.5 px-4 text-md"
            disabled={loading}
          >
            {loading ? <Spinner /> : "Sign In"}
          </Button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Super Admin: 9765482996 / superadmin@pca <br />
              Shop Admin: 9987654321 / shopadminpass
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
