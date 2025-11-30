import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import JobCard from "../components/JobCard";
import JobForm from "../components/JobForm";
import JobInfo from "../components/JobInfo";
import ConfirmJobDelete from "../components/ConfirmJobDelete";
import {
  PlusIcon,
  BriefcaseIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteJob, setDeleteJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user, token, logout, jobs, storeJobs } = useAuth();

  const safeJobs = Array.isArray(jobs) ? jobs : [];

  useEffect(() => {
    if (!token || !user?.email) {
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchJobs = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/jobs`,
          {
            params: { email: user.email },
            headers,
            signal: controller.signal,
          }
        );

        const maybeJobsArray = response.data?.jobs;
        const maybeSingleJob = response.data?.job;

        if (Array.isArray(maybeJobsArray)) {
          storeJobs(maybeJobsArray);
        } else if (maybeSingleJob) {
          storeJobs((prev) => [
            ...(Array.isArray(prev) ? prev : []),
            maybeSingleJob,
          ]);
        } else {
          storeJobs((prev) => (Array.isArray(prev) ? prev : []));
        }
      } catch (error) {
        if (axios.isCancel(error)) return;
        console.error("Dashboard fetchJobs error:", error);
        if ([401, 403].includes(error.response?.status)) logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
    return () => controller.abort();
  }, [user?.email, token, storeJobs, logout]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    if (selectedJob) document.body.style.overflow = "hidden";
    else document.body.style.overflow = prev || "";
    return () => {
      document.body.style.overflow = prev || "";
    };
  }, [selectedJob]);

  const handleJobAdded = (newJob) => {
    storeJobs?.((prevJobs) => {
      const arr = Array.isArray(prevJobs) ? prevJobs : [];
      return [...arr, newJob];
    });
    setShowForm(false);
  };

  const handleJobDeleted = (deletedJobId) => {
    storeJobs((prev) =>
      Array.isArray(prev) ? prev.filter((j) => j.id !== deletedJobId) : []
    );
    if (selectedJob?.id === deletedJobId) {
      setSelectedJob(null);
    }
  };

  const handleJobSelect = (job) => setSelectedJob(job);
  const handleCloseJobDetail = () => setSelectedJob(null);

  const confirmDeleteJob = async () => {
    if (!deleteJob) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/jobs`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { jobId: deleteJob.id },
      });
      handleJobDeleted(deleteJob.id);
    } catch (error) {
      console.error("Failed to delete job:", error);
      alert("Failed to delete job. Please try again.");
    } finally {
      setDeleteJob(null);
    }
  };

  if (isLoading)
    return (
      <section className="flex flex-col min-h-[80vh] pt-8 items-center justify-center">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 flex items-center gap-2 text-sm">
          <span className="inline-block w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin" />
          Loading your applications…
        </div>
      </section>
    );

  return (
    <>
      <section className="flex flex-col min-h-[80vh] pt-8">
        <div className="max-w-[1120px] w-[92vw] mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="max-w-[1120px] w-[92vw] mx-auto relative space-y-6"
          >
            <div className="absolute top-0 right-0 pt-6 pr-6">
              <motion.button
                onClick={() => setShowForm((prev) => !prev)}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center justify-center rounded-full h-9 px-4 font-semibold text-sm border border-[#0a66c2] bg-[#0a66c2] text-slate-900 transition hover:bg-[#004182] hover:border-[#004182]"
              >
                {showForm ? (
                  <>
                    <XMarkIcon className="w-3.5 h-3.5 mr-2" />
                    Close
                  </>
                ) : (
                  <>
                    <PlusIcon className="w-3.5 h-3.5 mr-2" />
                    Add Job
                  </>
                )}
              </motion.button>
            </div>
            <div className="pt-2 space-y-2">
              <h1 className="text-3xl sm:text-4xl font-semibold text-slate-100 tracking-tight">
                Job Dashboard
              </h1>
              <p className="text-sm text-slate-300 max-w-md mt-1">
                Track your applications, interviews, and insights from one
                place.
              </p>
            </div>
          </motion.div>

          <div
            className={`grid gap-4 ${
              showForm
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]"
                : "lg:grid-cols-1"
            }`}
          >
            <AnimatePresence>
              {showForm && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 12 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-4 lg:sticky lg:top-20 h-fit"
                >
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-slate-100">
                      Add New Job
                    </h2>
                    <button
                      onClick={() => setShowForm(false)}
                      className="inline-flex items-center justify-center rounded-full p-2 bg-slate-700/40 hover:bg-slate-700/60 transition focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-300 hover:text-slate-100"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </div>
                  <JobForm
                    email={user?.email}
                    token={token}
                    onJobAdded={handleJobAdded}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.05 }}
              className="bg-slate-800 border border-slate-700 rounded-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="inline-flex items-center justify-center rounded-full p-2 bg-slate-700/40">
                    <BriefcaseIcon className="w-3.5 h-3.5" />
                  </div>
                  <h2 className="text-md font-semibold text-slate-100">
                    Your Applications ({safeJobs.length})
                  </h2>
                </div>
              </div>

              <div className="p-4 space-y-3">
                {safeJobs.length === 0 ? (
                  <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 text-center space-y-3">
                    <BriefcaseIcon className="w-10 h-10 mx-auto text-slate-300/60" />
                    <h3 className="text-md font-semibold text-slate-100">
                      No applications yet
                    </h3>
                    <p className="text-sm text-slate-300 max-w-xs mx-auto">
                      Add your first job to start tracking applications and
                      interviews.
                    </p>
                    <motion.button
                      onClick={() => setShowForm(true)}
                      whileTap={{ scale: 0.95 }}
                      className="inline-flex items-center justify-center rounded-full h-8 px-4 font-semibold text-sm border border-[#0a66c2] bg-[#0a66c2] text-slate-900 transition hover:bg-[#004182] hover:border-[#004182] mx-auto"
                    >
                      <PlusIcon className="w-3.5 h-3.5" /> Add Job
                    </motion.button>
                  </div>
                ) : (
                  safeJobs.map((job, index) => (
                    <motion.div
                      key={job.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                    >
                      <JobCard
                        job={job}
                        onJobDeleteClick={() => setDeleteJob(job)}
                        onJobSelect={handleJobSelect}
                      />
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {selectedJob && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div
                className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm"
                onClick={handleCloseJobDetail}
              />

              <motion.div
                initial={{ scale: 0.98, y: 10 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.98, y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="relative z-10 max-w-3xl w-full mx-auto bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/30 bg-slate-900/70 backdrop-blur-md flex-shrink-0">
                  <h2 className="text-lg font-semibold text-slate-50">
                    Job Details
                  </h2>
                  <button
                    onClick={handleCloseJobDetail}
                    className="inline-flex items-center justify-center rounded-full p-2 bg-slate-700/40 hover:bg-slate-700/60 transition focus:outline-none focus:ring-2 focus:ring-slate-500 text-slate-200 hover:text-slate-50"
                  >
                    <XMarkIcon className="w-4 h-4" />
                  </button>
                </div>

                <div className="overflow-y-auto p-4 min-h-0">
                  <JobInfo job={selectedJob} onClose={handleCloseJobDetail} />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {deleteJob && (
            <ConfirmJobDelete
              isOpen={!!deleteJob}
              jobTitle={deleteJob.position}
              onClose={() => setDeleteJob(null)}
              onConfirm={confirmDeleteJob}
            />
          )}
        </AnimatePresence>
      </section>
    </>
  );
};

export default Dashboard;