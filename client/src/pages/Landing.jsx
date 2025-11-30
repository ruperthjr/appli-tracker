import { Link } from "react-router-dom";
import {
  ChartBarIcon,
  ClipboardDocumentListIcon,
  NewspaperIcon,
  LinkIcon,
} from "@heroicons/react/24/outline";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { useAuth } from "../context/AuthContext";

const Landing = () => {
  const { isAuthenticated } = useAuth();
  const features = [
    {
      icon: ClipboardDocumentListIcon,
      title: "Track Applications",
      description: "Keep all your job applications organized in one place.",
      accentBg: "bg-[#0a66c2]/20",
      accentColor: "text-[#0a66c2]",
    },
    {
      icon: ChartBarIcon,
      title: "Monitor Progress",
      description: "Track interview rounds and application status.",
      accentBg: "bg-sky-600/20",
      accentColor: "text-sky-300",
    },
    {
      icon: NewspaperIcon,
      title: "Company Reviews",
      description: "Read verified reviews to make informed decisions.",
      accentBg: "bg-amber-500/20",
      accentColor: "text-amber-300",
    },
  ];

  const socialLinks = [
    {
      href: "mailto:ruperthnyagesoa@gmail.com",
      label: "Email",
      icon: <HiOutlineMail className="w-5 h-5" />,
    },
    {
      href: "https://github.com/ruperthjr",
      label: "GitHub",
      icon: <FaGithub className="w-5 h-5" />,
    },
    {
      href: "https://www.linkedin.com/in/ruperth-nyagesoa",
      label: "LinkedIn",
      icon: <FaLinkedin className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-[80vh] text-[#ffffff] bg-[#000000]">
      <main className="relative z-10 pb-30 pt-25">
        <div className="max-w-[1120px] w-[92vw] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <section aria-labelledby="hero-heading" className="space-y-6">
              <h1
                id="hero-heading"
                className="text-3xl md:text-4xl font-bold leading-tight max-w-lg"
              >
                <span className="block text-[#0a66c2] text-4xl md:text-5xl">
                  Appli Tracker
                </span>
                <div className="h-1 w-24 bg-[#0a66c2] rounded mt-2 mb-4" />
                <div className="mt-1">
                  Your Professional Job Application Tracker
                </div>
              </h1>
              <p className="text-lg text-[#ffffff] max-w-xl">
                Streamline your job search with a dashboard to organize
                applications, monitor interview progress, and access company
                insights.
              </p>
              <div className="flex gap-3 flex-shrink-0">
                {isAuthenticated() ? (
                  <>
                    <Link
                      to="/dashboard"
                      className="rounded-lg border border-[#38434f] px-5 py-2 text-[#ffffff] hover:border-[#4a5763] transition-colors duration-150"
                    >
                      Dashboard
                    </Link>
                    <Link
                      to="/profile"
                      className="rounded-lg bg-[#0a66c2] px-5 py-2 font-semibold text-[#1b1f23] hover:bg-[#004182] transition-colors duration-150"
                    >
                      Profile
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/signup"
                      className="rounded-lg bg-[#0a66c2] px-5 py-2 font-semibold text-[#1b1f23] hover:bg-[#004182] transition-colors duration-150"
                    >
                      Get Started
                    </Link>
                    <Link
                      to="/login"
                      className="rounded-lg border border-[#38434f] px-5 py-2 text-[#ffffff] hover:border-[#4a5763] transition-colors duration-150"
                    >
                      Sign In
                    </Link>
                  </>
                )}
              </div>
            </section>

            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {features.map((feature, idx) => {
                const Icon = feature.icon;
                const isLast = idx === features.length - 1;
                return (
                  <article
                    key={feature.id || feature.title} // Prefer feature.id if available
                    className={`rounded-xl border border-[#38434f] bg-[#1b1f23] p-6 flex gap-4 items-start ${
                      isLast ? "sm:col-span-2" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-lg ${feature.accentBg} border border-[#38434f] flex items-center justify-center`}
                    >
                      <Icon className={`w-6 h-6 ${feature.accentColor}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-[#ffffff] tracking-tight">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-400 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </section>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-[#38434f] bg-[#000000]">
        <div className="max-w-[1120px] w-[92vw] mx-auto py-4">
          {" "}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left text-sm text-slate-400">
              <p className="mt-1">
                Developed by{" "}
                <a
                  href="https://ruperth.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-[#ffffff] hover:text-white transition-colors duration-150"
                >
                  Ruperth Nyagesoa <LinkIcon className="inline w-4 h-4 mb-0.5" />
                </a>
                .
              </p>
            </div>
            <div className="flex items-center gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="text-slate-400 hover:text-white transition-colors duration-150"
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;