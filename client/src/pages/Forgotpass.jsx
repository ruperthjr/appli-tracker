import { useState } from "react";
import { motion } from "framer-motion";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Forgotpass = () => {
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpRequested, setOtpRequested] = useState(false);
  const [otpValidated, setOtpValidated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleGenerateOTP = async () => {
    if (resendTimer > 0) return;
    setIsGenerating(true);
    setError("");
    const email = formData.email;
    if (!email) {
      setError("Please enter your email.");
      setIsGenerating(false);
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/generate-otp`, {
        email,
      });
      setOtpRequested(true);
      setIsGenerating(false);
      setResendTimer(60);
      const interval = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      console.log(err);
      setError("Failed to send OTP.");
      setIsGenerating(false);
    }
  };

  const handleValidateOTP = async () => {
    setIsValidating(true);
    setError("");
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/users/validate-otp`, {
        email: formData.email,
        otp: formData.otp,
      });
      setOtpValidated(true);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "OTP validation failed.");
    } finally {
      setIsValidating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!otpValidated) {
      setError("Please validate OTP before submitting.");
      setIsLoading(false);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_URL}/users/reset-password`,
        {
          email: formData.email,
          newPassword: formData.password,
        }
      );
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Password reset failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-8 space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-100">
              Forgot Password
            </h1>
            <p className="text-slate-400 mt-2">
              Enter your email to reset your password.
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

          <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                placeholder="you@example.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleGenerateOTP}
                disabled={isGenerating || resendTimer > 0}
                className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-emerald-500 text-slate-900 font-medium hover:bg-emerald-400 disabled:opacity-60"
              >
                {isGenerating ? "Sending..." : "Generate OTP"}
              </button>

              {otpRequested && (
                <button
                  type="button"
                  onClick={handleGenerateOTP}
                  disabled={resendTimer > 0 || isGenerating}
                  className="text-sm underline text-slate-300"
                >
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend"}
                </button>
              )}
            </div>

            {otpRequested && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Enter OTP
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  placeholder="6-digit code"
                />
                <button
                  type="button"
                  onClick={handleValidateOTP}
                  disabled={isValidating || otpValidated}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 bg-blue-600 text-white font-medium hover:bg-blue-500 disabled:opacity-60"
                >
                  {isValidating
                    ? "Validating..."
                    : otpValidated
                    ? "Validated"
                    : "Validate OTP"}
                </button>
              </div>
            )}

            {otpValidated && (
              <>
                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-slate-300">
                    Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors pr-10"
                    placeholder="Enter password"
                  />
                  <span
                    className="absolute right-3 top-[38px] cursor-pointer text-slate-400"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </span>
                </div>

                <div className="space-y-2 relative">
                  <label className="text-sm font-medium text-slate-300">
                    Confirm Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors pr-10"
                    placeholder="Confirm password"
                  />
                  <span
                    className="absolute right-3 top-[38px] cursor-pointer text-slate-400"
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </span>
                </div>
              </>
            )}

            <div>
              <button
                type="submit"
                className="w-full rounded-md px-4 py-2 bg-emerald-600 text-white font-medium hover:bg-emerald-500 disabled:opacity-60"
                disabled={!otpValidated || isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>

          <p className="text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Forgotpass;