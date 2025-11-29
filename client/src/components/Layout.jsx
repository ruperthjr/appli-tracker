import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { useModal } from "../context/ModalContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";

const Layout = () => {
  const { showDeleteModal, closeDeleteModal } = useModal();
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();

  const confirmDeleteAccount = async () => {
    closeDeleteModal();
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users`, {
        data: { userId: user?.id },
        headers: { Authorization: `Bearer ${token}` },
      });
      logout();
      navigate("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Error deleting account. Please try again later.");
    }
  };

  const cancelDeleteAccount = () => {
    closeDeleteModal();
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      <main className="flex-1 pt-16 overflow-y-auto">
        <Outlet />
      </main>

      {showDeleteModal && (
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          transition={{ duration: 0.16 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <div className="bg-[#0f172a] rounded-2xl shadow-lg p-6 w-full max-w-sm border border-white/10">
            <h3 className="text-lg font-semibold mb-2 bg-clip-text bg-gradient-to-r text-[#f1f5f9]">
              Delete Account
            </h3>
            <p className="text-[#94a3b8] mb-6">
              Are you sure you want to delete your account? This action cannot
              be undone and will remove all your data.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={cancelDeleteAccount}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#334155] hover:bg-[#475569] text-[#f1f5f9] transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteAccount}
                className="px-4 py-2 text-sm font-medium rounded-lg bg-[#ef4444] hover:bg-[#f87171] text-white transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Layout;
