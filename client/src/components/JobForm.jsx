import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";

const JobForm = ({ onJobAdded }) => {
  const [userId, setUserId] = useState(null);
  const { token, user, storeJobs } = useAuth();
  const [roundInput, setRoundInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    userId: null,
    jobtitle: "",
    company: "",
    location: "Nairobi, Kenya",
    jobtype: "",
    salary: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    rounds: [],
  });

  useEffect(() => {
    if (!user) {
      alert("User not logged in. Please log in to add a job.");
      return;
    }
    setUserId(user?.id || null);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRoundAdd = () => {
    const trimmed = roundInput.trim();
    if (!trimmed) return;
    setFormData((prev) => ({ ...prev, rounds: [...prev.rounds, trimmed] }));
    setRoundInput("");
  };

  const handleRoundRemove = (index) => {
    const updated = formData.rounds.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, rounds: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userId) {
      alert("User ID not yet loaded. Please wait...");
      return;
    }

    setIsSubmitting(true);
    const payload = { ...formData, userId };
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/jobs`,
        payload,
        { headers }
      );
      if (response.status === 201) {
        setFormData({
          userId: null,
          jobtitle: "",
          company: "",
          location: "Nairobi, Kenya",
          jobtype: "",
          salary: "",
          description: "",
          date: new Date().toISOString().split("T")[0],
          rounds: [],
        });
        setRoundInput("");
        onJobAdded?.(response.data.job);
      }
    } catch (error) {
      console.error("Error creating job:", error);
      alert("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const jobTypes = [
    { value: "full-time", label: "Full time" },
    { value: "part-time", label: "Part time" },
    { value: "intern", label: "Intern" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-xs font-medium text-[#b0b8c1] mb-1">
          Job Title
        </label>
        <input
          type="text"
          name="jobtitle"
          value={formData.jobtitle}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm rounded-lg bg-[#1b1f23] border border-[#38434f] text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
          placeholder="e.g. Software Engineer"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#b0b8c1] mb-1">
          Company
        </label>
        <input
          type="text"
          name="company"
          value={formData.company}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm rounded-lg bg-[#1b1f23] border border-[#38434f] text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
          placeholder="e.g. Safaricom"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#b0b8c1] mb-1">
          Location
        </label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm rounded-lg bg-[#1b1f23] border border-[#38434f] text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
          placeholder="e.g. Nairobi, Kenya"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#b0b8c1] mb-1">
          Job Type
        </label>
        <div className="flex flex-wrap gap-2">
          {jobTypes.map(({ value, label }) => (
            <label
              key={value}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border border-[#38434f] bg-[#1b1f23] text-xs text-white transition-colors cursor-pointer ${
                formData.jobtype === value
                  ? "ring-2 ring-[#0a66c2] border-[#0a66c2]"
                  : "hover:border-[#4a5763]"
              }`}
            >
              <input
                type="radio"
                name="jobtype"
                value={value}
                onChange={handleChange}
                checked={formData.jobtype === value}
                className="text-[#0a66c2] focus:ring-[#0a66c2] bg-transparent border-[#38434f]"
                required
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#b0b8c1] mb-1">
          Salary
        </label>
        <input
          type="text"
          name="salary"
          value={formData.salary}
          onChange={handleChange}
          className="w-full px-3 py-2 text-sm rounded-lg bg-[#1b1f23] border border-[#38434f] text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
          placeholder="e.g. KSH 120,000"
          required
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-[#b0b8c1] mb-1">
          Interview Rounds
        </label>
        <div className="flex gap-1">
          <input
            type="text"
            value={roundInput}
            onChange={(e) => setRoundInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && (e.preventDefault(), handleRoundAdd())
            }
            placeholder="e.g. Technical Interview"
            className="flex-1 px-3 py-2 text-sm rounded-lg bg-[#1b1f23] border border-[#38434f] text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
          />
          <button
            type="button"
            onClick={handleRoundAdd}
            className="p-1 text-[#0a66c2] hover:text-[#378fe9] transition"
          >
            <PlusIcon className="w-5 h-5" />
          </button>
        </div>
        {formData.rounds.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {formData.rounds.map((round, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-[#38434f] text-white"
              >
                {round}
                <button
                  type="button"
                  onClick={() => handleRoundRemove(index)}
                  className="ml-1 text-[#b0b8c1] hover:text-white transition"
                >
                  <XMarkIcon className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#b0b8c1] mb-1">
            Date Applied
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[#1b1f23] border border-[#38434f] text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-[#b0b8c1] mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 text-sm rounded-lg bg-[#1b1f23] border border-[#38434f] text-white focus:outline-none focus:ring-2 focus:ring-[#0a66c2] focus:border-transparent resize-none"
            placeholder="Job description or notes..."
            required
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileTap={{ scale: 0.97 }}
        className="w-full h-10 text-sm font-semibold rounded-full bg-[#0a66c2] border border-[#0a66c2] text-white flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#004182] hover:border-[#004182] transition"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Adding Job...
          </span>
        ) : (
          "Add Job"
        )}
      </motion.button>
    </form>
  );
};

export default JobForm;