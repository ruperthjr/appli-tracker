import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    const { confirmPassword, ...dataToSend } = formData;

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/signup`,
        dataToSend
      );
      if (response.status === 201) {
        login(response.data.user, response.data.token);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      if (error.response?.status === 400) {
        setError("An account with this email already exists.");
      } else {
        setError(
          "An error occurred while creating your account. Please try again."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-[#000000] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 35 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-lg"
      >
        <div className="rounded-xl border border-[#38434f] bg-[#1b1f23] p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-[#ffffff]">
              Create an Account
            </h1>
            <p className="text-[#b0b8c1] mt-2">
              Start organizing your job search today.
            </p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 text-center text-sm text-rose-300"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#38434f] bg-[#1b1f23] px-4 py-2 text-[#ffffff] placeholder:text-[#b0b8c1] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition-colors"
                  placeholder="First Name"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#38434f] bg-[#1b1f23] px-4 py-2 text-[#ffffff] placeholder:text-[#b0b8c1] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition-colors"
                  placeholder="Last Name"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-[#38434f] bg-[#1b1f23] px-4 py-2 text-[#ffffff] placeholder:text-[#b0b8c1] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition-colors"
                placeholder="you@example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#38434f] bg-[#1b1f23] px-4 py-2 pr-10 text-[#ffffff] placeholder:text-[#b0b8c1] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#b0b8c1] hover:text-[#ffffff] transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-[#38434f] bg-[#1b1f23] px-4 py-2 pr-10 text-[#ffffff] placeholder:text-[#b0b8c1] focus:outline-none focus:ring-2 focus:ring-[#0a66c2] transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#b0b8c1] hover:text-[#ffffff] transition-colors"
                  aria-label={
                    showConfirmPassword ? "Hide password" : "Show password"
                  }
                >
                  <EyeIcon className="w-5 h-5" />
                </button>
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={isLoading}
              whileTap={{ scale: 0.98 }}
              className="w-full justify-center rounded-lg bg-[#0a66c2] px-5 py-2.5 font-semibold text-[#1b1f23] hover:bg-[#004182] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1b1f23] border-t-transparent" />
                  Creating Account...
                </span>
              ) : (
                "Create Account"
              )}
            </motion.button>
          </form>

          <p className="text-center text-sm text-[#b0b8c1]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-[#0a66c2] hover:text-[#004182] transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;