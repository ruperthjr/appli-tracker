import axios from "axios";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

const Newreview = ({ onSuccess, onCancel }) => {
  const { user, token } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    company: "",
    review: "",
    rating: null,
    salary: "",
    rounds: [],
    role: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) setError("");
  };

  const handleRatingChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      rating: value === "" ? null : Number(value),
    }));
  };

  const handleRoundChange = (index, value) => {
    setFormData((prev) => {
      const rounds = [...prev.rounds];
      rounds[index] = value;
      return { ...prev, rounds };
    });
  };

  const addRoundAt = (index) => {
    setFormData((prev) => {
      const rounds = [...prev.rounds];
      rounds.splice(index + 1, 0, "");
      return { ...prev, rounds };
    });
  };

  const addRoundEnd = () => {
    setFormData((prev) => ({ ...prev, rounds: [...prev.rounds, ""] }));
  };

  const removeRound = (index) => {
    setFormData((prev) => {
      const rounds = [...prev.rounds];
      rounds.splice(index, 1);
      return { ...prev, rounds };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/reviews`,
        {
          userId: user.id,
          company: formData.company,
          review: formData.review,
          rating: formData.rating,
          salary: formData.salary,
          rounds: formData.rounds,
          role: formData.role,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 201) {
        onSuccess();
      } else {
        console.log(response);
        setError("Failed to submit review. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to submit review. Please try again.", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-track-slate-800/20 scrollbar-thumb-slate-600/30 hover:scrollbar-thumb-slate-600/50">
      <form onSubmit={handleSubmit} className="space-y-6 text-slate-100">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">
            Share Your Experience
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Help others by writing a clear, honest review of the interview
            process.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="company"
              className="text-sm font-medium text-slate-200/85"
            >
              Company Name
            </label>
            <input
              id="company"
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
              className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
              placeholder="Enter company name"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="role"
              className="text-sm font-medium text-slate-200/85"
            >
              Role
            </label>
            <input
              id="role"
              type="text"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
              placeholder="Enter role/position"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="review"
            className="text-sm font-medium text-slate-200/85"
          >
            Review
          </label>
          <textarea
            id="review"
            name="review"
            value={formData.review}
            onChange={handleChange}
            rows={5}
            className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition resize-y"
            placeholder="Share your interview experience..."
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label
              htmlFor="rating"
              className="text-sm font-medium text-slate-200/85"
            >
              Rating (1-5)
            </label>
            <input
              id="rating"
              type="number"
              min="1"
              max="5"
              placeholder="e.g. 4"
              value={formData.rating ?? ""}
              onChange={handleRatingChange}
              className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
            />
            <p className="text-xs text-slate-400 mt-1">
              Rate overall interview experience (1 = poor, 5 = excellent)
            </p>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="salary"
              className="text-sm font-medium text-slate-200/85"
            >
              Salary
            </label>
            <input
              id="salary"
              type="text"
              name="salary"
              value={formData.salary}
              onChange={handleChange}
              className="w-full rounded-lg bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent transition"
              placeholder="e.g. 12 LPA / ₹1,00,000 per month"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-200/85">
              Interview Rounds
            </label>
          </div>

          {formData.rounds.length === 0 ? (
            <div className="rounded-lg bg-slate-800/50 border border-slate-700 p-4 text-center">
              <p className="text-slate-400 mb-3">No rounds added yet.</p>
              <button
                type="button"
                onClick={addRoundEnd}
                className="inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm text-slate-900 font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <PlusIcon className="w-4 h-4" />
                Add Round
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {formData.rounds.map((round, index) => (
                <div
                  key={index}
                  className="rounded-lg bg-slate-800/50 border border-slate-700 p-3 grid grid-cols-1 sm:grid-cols-6 gap-3 items-start"
                >
                  <div className="sm:col-span-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-slate-200/85">
                        Round {index + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => addRoundAt(index)}
                          title="Add round after this one"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-slate-700/40 hover:bg-slate-700/60 focus:outline-none"
                        >
                          <PlusIcon className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeRound(index)}
                          title="Remove this round"
                          className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-rose-600/80 hover:bg-rose-600 focus:outline-none"
                        >
                          <MinusIcon className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>

                    <input
                      type="text"
                      placeholder="e.g. HR Round, Technical Round, Coding Test"
                      value={round}
                      onChange={(e) => handleRoundChange(index, e.target.value)}
                      className="w-full rounded-md bg-slate-800/60 border border-slate-700 px-3 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500 transition"
                    />
                  </div>

                  <div className="sm:col-span-1 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => addRoundAt(index)}
                      title="Add after"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-slate-700/40 hover:bg-slate-700/60 focus:outline-none sm:hidden"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeRound(index)}
                      title="Remove"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-md bg-rose-600/80 hover:bg-rose-600 focus:outline-none sm:hidden"
                    >
                      <MinusIcon className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  onClick={addRoundEnd}
                  className="inline-flex items-center gap-2 rounded-md bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-sm text-slate-900 font-semibold transition focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <PlusIcon className="w-4 h-4" />
                  Add Another Round
                </button>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-md p-3 border border-rose-400/30 bg-rose-500/10 text-rose-200 text-sm"
          >
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t border-slate-700/30">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md px-6 py-2 bg-slate-700/40 hover:bg-slate-700/60 font-semibold transition text-sm"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md px-6 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2"
            aria-disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <span
                  className="inline-block w-4 h-4 rounded-full border-2 border-t-transparent text-slate-900 font-semibold border-slate-900 animate-spin"
                  aria-hidden="true"
                />
                Submitting...
              </span>
            ) : (
              "Submit Review"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Newreview;
