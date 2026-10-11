"use client";
import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  UserRound,
  Mail,
  LockKeyhole,
  ArrowRight,
  Github,
} from "lucide-react";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে");
      return;
    }
    if (password !== confirm) {
      toast.error("দুটি পাসওয়ার্ড মিলছে না");
      return;
    }
    setLoading(true);
    try {
      const result = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (result.error) {
        toast.error(result.error.message || "অ্যাকাউন্ট তৈরি করা যায়নি");
        return;
      }
      toast.success("অ্যাকাউন্ট তৈরি হয়েছে! স্বাগতম বাজার দর-এ।");
      window.location.href = "/";
    } catch {
      toast.error("এই মুহূর্তে নিবন্ধন করা যাচ্ছে না। পরে আবার চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }
  async function social(provider: "google" | "github") {
    try {
      const result = await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
      if (result.error)
        toast.error(result.error.message || "সাইন ইন করা যায়নি");
    } catch {
      toast.error(
        `${provider === "google" ? "Google" : "GitHub"} লগইন সেটআপ করা নেই অথবা সংযোগ ব্যর্থ হয়েছে।`,
      );
    }
  }
  return (
    <section className="signup-card">
      <div className="card-heading">
        <div className="eyebrow">
          <span className="eyebrow-dot" /> আপনার যাত্রা শুরু হোক
        </div>
        <h1>অ্যাকাউন্ট তৈরি করুন</h1>
        <p>বিনা খরচে সাইন আপ করে সব বিস্তারিত দাম দেখুন।</p>
      </div>
      <form onSubmit={submit} className="signup-fields">
        <label className="field-label" htmlFor="name">
          আপনার নাম
        </label>
        <div className="input-wrap">
          <UserRound size={18} />
          <input
            id="name"
            autoComplete="name"
            placeholder="যেমন: রহিম উদ্দিন"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        </div>
        <label className="field-label" htmlFor="email">
          ইমেইল ঠিকানা
        </label>
        <div className="input-wrap">
          <Mail size={18} />
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <label className="field-label" htmlFor="password">
          পাসওয়ার্ড
        </label>
        <div className="input-wrap">
          <LockKeyhole size={18} />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            placeholder="কমপক্ষে ৮ অক্ষর"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
          />
          <button
            className="eye-button"
            type="button"
            aria-label="পাসওয়ার্ড দেখুন"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <label className="field-label" htmlFor="confirm">
          পাসওয়ার্ড নিশ্চিত করুন
        </label>
        <div className="input-wrap">
          <LockKeyhole size={18} />
          <input
            id="confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            placeholder="আবার লিখুন"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            className="eye-button"
            type="button"
            aria-label="নিশ্চিতকরণ পাসওয়ার্ড দেখুন"
            onClick={() => setShowConfirm((v) => !v)}
          >
            {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button className="submit-button" disabled={loading} type="submit">
          {loading ? "অ্যাকাউন্ট তৈরি হচ্ছে..." : "অ্যাকাউন্ট তৈরি করুন"}
          <ArrowRight size={18} />
        </button>
      </form>
      <div className="or-divider">
        <span />
        অথবা
        <span />
      </div>
      <div className="social-row">
        <button
          type="button"
          className="social-button"
          onClick={() => social("google")}
        >
          <span className="google-g">G</span> Google দিয়ে চালিয়ে যান
        </button>
        <button
          type="button"
          className="social-button"
          onClick={() => social("github")}
        >
          <Github size={18} /> GitHub দিয়ে চালিয়ে যান
        </button>
      </div>
      <p className="login-prompt">
        অ্যাকাউন্ট আছে? <Link href="/signin">সাইন ইন করুন</Link>
      </p>
      <p className="terms">
        চালিয়ে যাওয়ার মাধ্যমে আপনি আমাদের ব্যবহারের শর্তাবলিতে সম্মতি দিচ্ছেন।
      </p>
    </section>
  );
}
