import axios from "axios";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  StarIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  UserCircleIcon,
} from "@heroicons/react/24/solid";
import { BuildingOfficeIcon, TrashIcon } from "@heroicons/react/24/outline";

const ratingColorMap = {
  high: "text-[#0a66c2]",
  medium: "text-amber-300",
  low: "text-rose-300",
};

const Review = ({ data, onDeleteRequest }) => {
  const [user, setUser] = useState(null);
  const userId = data.userId;

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/users/${userId}`
      );
      if (response.status === 200) setUser(response.data.user);
    } catch (error) {
      console.log("fetchUser error:", error);
    }
  };

  useEffect(() => {
    if (userId) fetchUser(userId);
  }, [userId]);

  const getRatingVariant = (rating) => {
    if (!rating) return "low";
    if (rating >= 4) return "high";
    if (rating >= 3) return "medium";
    return "low";
  };

  const formatSalary = (salary) => (salary ? salary : "Not disclosed");

  const ratingVariant = getRatingVariant(data.rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="p-6 rounded-2xl border border-white/6 shadow-md bg-[#0f172a] flex flex-col"
      role="article"
      aria-label={`Review for ${data.company || "company"}`}
    >
      <div className="flex items-start justify-between mb-5 gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white/12 bg-slate-800/40">
            <UserCircleIcon className="w-6 h-6 text-slate-100" />
          </div>

          <div className="leading-tight min-w-0">
            <p className="text-sm font-semibold text-slate-100 truncate">
              {user?.firstName ?? "Anonymous"} {user?.lastName ?? ""}
            </p>
            <p className="text-xs text-slate-300/70 truncate">
              Reviewed this position
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {typeof data.rating === "number" && (
            <div className="flex items-center gap-2 rounded-full bg-white/4 px-3 py-1 border border-white/8">
              <StarIcon
                className={`w-4 h-4 ${ratingColorMap[ratingVariant]}`}
              />
              <span
                className={`text-sm font-semibold ${ratingColorMap[ratingVariant]}`}
              >
                {data.rating}/5
              </span>
            </div>
          )}

          {typeof onDeleteRequest === "function" && (
            <button
              onClick={() => onDeleteRequest(data)}
              className="ml-1 p-2 rounded-lg hover:bg-rose-500/10 transition focus:outline-none focus:ring-2 focus:ring-rose-400/20"
              title="Delete"
              aria-label="Delete review"
            >
              <TrashIcon className="w-5 h-5 text-rose-400" />
            </button>
          )}
        </div>
      </div>

      <div className="mb-5 space-y-3">
        <div className="flex items-center gap-3">
          <BuildingOfficeIcon className="w-5 h-5 text-slate-300/70" />
          <h2 className="text-lg font-semibold text-slate-100 tracking-tight truncate">
            {data.company || "Unknown Company"}
          </h2>
        </div>

        {data.role && (
          <div className="flex items-center gap-2 text-slate-200/80">
            <BriefcaseIcon className="w-4 h-4 text-slate-300/80" />
            <span className="text-sm truncate">{data.role}</span>
          </div>
        )}
      </div>

      {data.review && (
        <div className="mb-5 space-y-2">
          <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-400">
            Review
          </h3>
          <div className="rounded-lg bg-white/6 border border-white/6 p-4">
            <p className="text-slate-200/85 whitespace-pre-wrap leading-relaxed">
              {data.review}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-lg bg-white/6 border border-white/6 p-4">
          <div className="flex items-start gap-3">
            <CurrencyDollarIcon className="w-4 h-4 text-slate-300/80" />
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                Salary
              </p>
              <p className="text-sm font-medium text-slate-100">
                {formatSalary(data.salary)}
              </p>
            </div>
          </div>
        </div>

        {data.rounds && data.rounds.length > 0 ? (
          <div className="rounded-lg bg-white/6 border border-white/6 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400 mb-2">
              Interview Rounds
            </p>
            <div className="flex flex-wrap gap-2">
              {data.rounds.map((round, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 text-sm px-3 py-1 rounded-full bg-slate-800/60 border border-white/6 text-slate-100"
                >
                  {round}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-white/6 border border-white/6 p-4 flex items-center text-slate-400 text-sm">
            No rounds provided
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Review;
