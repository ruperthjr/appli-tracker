import { motion } from "framer-motion";
import { TrashIcon } from "@heroicons/react/24/outline";

const JobCard = ({ job, onJobDeleteClick, onJobSelect }) => {
  const handleCardClick = () => onJobSelect(job);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getJobTypeClass = (type) => {
    const base = "px-2 py-0.5 text-xs font-medium rounded-full border";
    if (!type)
      return `${base} bg-slate-400/20 text-slate-300 border-slate-400/30`;
    switch (type.toLowerCase()) {
      case "full time":
      case "full-time":
        return `${base} bg-emerald-400/20 text-emerald-300 border-emerald-400/30`;
      case "part time":
      case "part-time":
        return `${base} bg-blue-400/20 text-blue-300 border-blue-400/30`;
      case "contract":
        return `${base} bg-amber-400/20 text-amber-300 border-amber-400/30`;
      case "internship":
        return `${base} bg-purple-400/20 text-purple-300 border-purple-400/30`;
      default:
        return `${base} bg-slate-400/20 text-slate-300 border-slate-400/30`;
    }
  };

  return (
    <motion.div
      onClick={handleCardClick}
      className="p-3 sm:p-4 cursor-pointer rounded-2xl bg-[#0f172a] border border-white/6 shadow-md flex flex-col transition"
    >
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-[#f1f5f9] truncate">
              {job.position}
            </h3>
            {job.jobType && (
              <div className={getJobTypeClass(job.jobType)}>{job.jobType}</div>
            )}
          </div>

          <h4 className="text-sm sm:text-base font-medium text-[#94a3b8] mb-2 truncate">
            {job.company}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 gap-x-4 text-xs text-[#94a3b8]">
            <div>
              <span className="font-medium text-[#94a3b8]">Location:</span>{" "}
              <span>{job.location || "N/A"}</span>
            </div>
            <div>
              <span className="font-medium text-[#94a3b8]">Salary:</span>{" "}
              <span>{job.salary || "N/A"}</span>
            </div>
            <div>
              <span className="font-medium text-[#94a3b8]">Applied on:</span>{" "}
              <span>{formatDate(job.date)}</span>
            </div>
            <div>
              <span className="font-medium text-[#94a3b8]">Status:</span>{" "}
              <span>{job.status || "Applied"}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:ml-2">
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onJobDeleteClick?.(job);
            }}
            whileTap={{ scale: 0.95 }}
            className="ml-1 p-2 rounded-lg hover:bg-rose-500/10 transition focus:outline-none focus:ring-2 focus:ring-rose-400/20"
            title="Delete job"
          >
            <TrashIcon className="w-5 h-5 text-rose-400" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;
