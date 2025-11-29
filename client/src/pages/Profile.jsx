import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import {
  UserCircleIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Review from "../components/Review";
import ConfirmReviewDelete from "../components/ConfirmReviewDelete";

const formatDate = (dateString) => {
  if (!dateString) return "Unknown";
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "long" });
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

const Profile = () => {
  const { user, token, jobs } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user?.email || !token) return;

    const controller = new AbortController();
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const reviewsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/reviews/${user.id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        setReviews(
          Array.isArray(reviewsResponse.data?.blogs)
            ? reviewsResponse.data.blogs
            : []
        );
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation({
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              country: data.address.country || "",
            });
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }
    setBio(user?.bio || "");
    fetchData();
    return () => controller.abort();
  }, [user?.email, token, user?.id, user?.bio]);

  const handleDeleteRequest = (review) => {
    setSelectedReview(review);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedReview) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/reviews/${selectedReview.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200 || response.status === 204) {
        setReviews((prev) => prev.filter((b) => b.id !== selectedReview.id));
      }
    } catch (error) {
      console.error("Error deleting review:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setSelectedReview(null);
    }
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/bio`,
        { userId: user.id, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setEditingBio(false);
    } catch (err) {
      console.error("Error updating bio:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setBio(user?.bio || "");
    setEditingBio(false);
  };

  const stats = [
    {
      icon: BriefcaseIcon,
      label: "Job Applications",
      value: jobs?.length ?? 0,
      accent: "from-emerald-400/20 to-emerald-500/10",
    },
    {
      icon: DocumentTextIcon,
      label: "Review Posts",
      value: reviews.length,
      accent: "from-violet-400/20 to-indigo-500/10",
    },
    {
      icon: CalendarDaysIcon,
      label: "Member Since",
      value: formatDate(user?.createdAt),
      accent: "from-sky-400/20 to-cyan-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="inline-block w-6 h-6 rounded-full border-4 border-t-transparent animate-spin border-slate-600/40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-[80vh] pt-8 bg-slate-950 text-slate-100">
      <div className="max-w-[1120px] w-[92vw] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 py-6">
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="rounded-xl border border-white/6 shadow-sm bg-slate-900/80 p-5"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-slate-800/40 border border-white/12 flex items-center justify-center">
                <UserCircleIcon className="w-8 h-8 text-emerald-200" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-xl font-semibold text-slate-100 truncate">
                  {user?.firstName || "User"} {user?.lastName || ""}
                </h1>
                <p className="text-sm text-slate-200/75 truncate">
                  {user?.email}
                </p>
                {location.city && (
                  <div className="flex items-center text-slate-300/70 gap-1 mt-1 text-sm">
                    <MapPinIcon className="w-3.5 h-3.5" />
                    <span>
                      {location.city}
                      {location.country ? `, ${location.country}` : ""}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-3"
          >
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  className="rounded-xl border border-white/6 bg-slate-900/80 p-3 flex items-center gap-3"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center border border-white/12 bg-gradient-to-br ${stat.accent}`}
                  >
                    <Icon className="w-4 h-4 text-slate-100" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-100">
                      {stat.value}
                    </p>
                    <p className="text-xs text-slate-200/80">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.1 }}
            className="rounded-xl border border-white/6 shadow-sm bg-slate-900/80 p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-100">About Me</h2>
              {!editingBio && (
                <motion.button
                  onClick={() => setEditingBio(true)}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 bg-slate-800/40 border border-white/6 text-xs text-slate-100 hover:bg-slate-800/60 transition"
                  aria-label="Edit bio"
                >
                  <PencilIcon className="w-3 h-3" />
                  Edit
                </motion.button>
              )}
            </div>

            {editingBio ? (
              <form onSubmit={handleBioSubmit} className="space-y-3">
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className="w-full rounded-md bg-slate-800/60 border border-slate-700 px-2 py-1 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-500 transition text-sm"
                  placeholder="Tell us about yourself..."
                />
                <div className="flex gap-2">
                  <motion.button
                    type="submit"
                    disabled={isSaving}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1 rounded-md px-3 py-1 bg-emerald-600 text-white text-sm font-medium hover:bg-emerald-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <CheckIcon className="w-3 h-3" />
                    {isSaving ? "Saving..." : "Save"}
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={handleCancelEdit}
                    disabled={isSaving}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-1 rounded-md px-3 py-1 bg-slate-800/40 border border-white/6 text-xs text-slate-100 hover:bg-slate-800/60 transition"
                  >
                    <XMarkIcon className="w-3 h-3" />
                    Cancel
                  </motion.button>
                </div>
              </form>
            ) : (
              <div className="min-h-[80px]">
                {bio ? (
                  <p className="text-slate-200/80 text-sm whitespace-pre-wrap leading-relaxed">
                    {bio}
                  </p>
                ) : (
                  <p className="text-slate-300/60 italic text-sm">
                    No bio added yet. Click "Edit" to add information about
                    yourself.
                  </p>
                )}
              </div>
            )}
          </motion.div>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="rounded-xl border border-white/6 bg-slate-900/60 p-4 text-slate-400/80 text-sm">
              No reviews yet
            </div>
          ) : (
            reviews.map((review) => (
              <Review
                key={review.id}
                data={review}
                onDeleteRequest={handleDeleteRequest}
              />
            ))
          )}
        </div>
      </div>

      <ConfirmReviewDelete
        isOpen={isDeleteOpen}
        reviewTitle={selectedReview?.company || selectedReview?.title || ""}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedReview(null);
        }}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default Profile;