import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Mail } from "lucide-react";
import { ContourField } from "@/components/dashboard/contour-field";

const TITLE = "Sign In — Grow Beyond Limits Analytics";
const DESCRIPTION =
  "Sign in to the Market Conference 2026 analytics dashboard with your JTI email.";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: SignIn,
});

/** The committee signs in with the address the invitation went to. */
const JTI_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function SignIn() {
  const navigate = useNavigate();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!JTI_EMAIL.test(email.trim())) {
      setError("That does not look like an email address.");
      return;
    }
    void navigate({ to: "/" });
  };

  return (
    <main className="relative grid min-h-screen place-items-center overflow-x-clip px-5 py-16">
      <ContourField />
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduce ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[26rem]"
      >
        <JtiLogo className="h-8 w-auto text-foreground" />
        {/* The card is 416px wide, so the masthead's display size would break
            the title across three lines here. One rung down keeps it on one. */}
        <h1 className="display mt-7 text-metric font-extrabold uppercase">
          <span className="text-gradient">Grow Beyond</span> Limits
        </h1>
        <p className="mt-2.5 text-body text-muted-foreground">
          Market Conference 2026 · Live Analytics.
          <br />
          Sign in to pick the dashboard back up.
        </p>

        {/* noValidate, so the message under the field is ours and reads in the
            dashboard's own voice rather than the browser's bubble. The input
            stays type=email for the phone keyboard and for autofill. */}
        <form onSubmit={submit} noValidate className="glass-card mt-8 p-5 sm:p-6">
          <label
            htmlFor="email"
            className="block text-[10px] font-semibold tracking-[0.1em] text-muted-foreground uppercase"
          >
            Email
          </label>
          <div className="relative mt-2 flex items-center">
            <Mail className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
            <input
              id="email"
              type="email"
              value={email}
              autoComplete="email"
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
              }}
              placeholder="Enter your JTI email.."
              className="h-12 w-full rounded-xl border border-border bg-surface/70 pr-3.5 pl-9 text-body outline-none transition-colors duration-200 focus:border-primary/50"
            />
          </div>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduce ? 0 : 0.25 }}
              role="alert"
              className="mt-2.5 text-label text-muted-foreground"
            >
              {error}
            </motion.p>
          )}
          <button
            type="submit"
            className="group mt-5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-primary to-accent text-body font-semibold text-primary-foreground transition-all duration-300 hover:shadow-[0_10px_28px_-12px_var(--color-primary)] active:scale-[0.98]"
          >
            Continue
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
          </button>
        </form>

        <p className="mt-5 text-label text-muted-foreground">
          The dashboard is for the Market Conference committee. If you cannot get in, ask the
          organiser who sent your invitation.
        </p>
      </motion.div>
    </main>
  );
}

/** The JTI mark from the client's final KV, drawn in the dashboard's navy ink. */
function JtiLogo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="JTI"
      viewBox="0 0 195.25 140.92"
      fill="currentColor"
      className={`aspect-[195.25/140.92] ${className ?? ""}`}
    >
      <path d="M22.32 27.05C19.47 27.05 17.15 24.73 17.15 21.88L17.15 21.85C17.15 19.08 19.35 16.79 22.10 16.70L71.32 16.70C73.75 16.70 75.15 15.26 75.67 13.48C75.99 12.32 77.94 9.79 81.86 9.79L157.70 9.79C160.15 9.79 160.72 8.79 160.72 4.81C160.72 2.07 163.23 0.00 166.00 0.00L189.64 0.00C192.74 0.00 195.25 2.52 195.25 5.61L195.25 76.92C195.25 80.05 193.79 82.36 190.86 84.30C190.86 84.30 170.69 97.68 168.19 99.43C167.09 100.11 164.56 100.76 162.37 99.11C160.86 97.94 160.68 95.42 160.68 94.58L160.68 20.17L137.96 20.17C135.46 20.17 133.29 22.01 133.29 24.56L133.29 93.17C133.29 96.30 131.83 98.62 128.89 100.55C128.89 100.55 108.73 113.93 106.22 115.68C105.11 116.43 102.64 117.25 100.45 115.70C98.84 114.53 98.72 111.81 98.72 111.81L98.72 25.72C98.72 21.44 96.22 20.17 93.17 20.17L83.28 20.17C80.10 20.17 79.04 21.85 78.48 23.71C78.14 24.87 76.63 27.05 72.49 27.05L69.44 27.05C67.49 27.05 65.87 28.60 65.87 30.67L65.87 100.52C65.87 100.52 65.98 106.26 62.82 110.84C60.90 113.73 54.45 117.95 54.45 117.95L30.43 134.12C30.43 134.12 20.62 140.92 9.56 136.84C1.29 133.73 0.00 128.17 0.86 123.19C1.74 118.24 7.61 115.33 11.31 115.50C15.75 115.70 19.36 117.25 21.52 122.61C23.27 126.99 24.67 128.46 26.95 128.65C29.23 128.74 31.31 125.71 31.31 120.19L31.31 30.67C31.31 28.70 29.66 27.05 27.72 27.05L22.32 27.05L22.32 27.05Z" />
    </svg>
  );
}
