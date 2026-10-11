
'use client'

import Link from "next/link";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Mail,
  LockKeyhole,
  ArrowRight,
} from "lucide-react";

export default function SigninPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await authClient.signIn.email({
        email,
        password,
      });

      if (result.error) {
        toast.error(
          result.error.message || "সাইন ইন করা যায়নি"
        );
        return;
      }

      toast.success("সফলভাবে সাইন ইন হয়েছে");
      window.location.href = "/";
    } catch {
      toast.error("সাইন ইন করা যায়নি। পরে চেষ্টা করুন।");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <SiteHeader />

      <main className="signin-main">
        <Link href="/" className="back-link">
          <ArrowLeft size={16} />
          হোম পেজে ফিরে যান
        </Link>

        <section className="signup-card signin-card">
          <div className="card-heading">
            <div className="eyebrow">
              <span className="eyebrow-dot" />
              আবার স্বাগতম
            </div>

            <h1>সাইন ইন করুন</h1>

            <p>
              আপনার অ্যাকাউন্টে প্রবেশ করে বিস্তারিত দাম দেখুন।
            </p>
          </div>

          <form className="signup-fields" onSubmit={submit}>
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
                type="password"
                autoComplete="current-password"
                placeholder="আপনার পাসওয়ার্ড"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "সাইন ইন হচ্ছে..." : "সাইন ইন করুন"}

              <ArrowRight size={18} />
            </button>
          </form>

          <p className="login-prompt">
            নতুন এখানে?{" "}
            <Link href="/signup">
              অ্যাকাউন্ট তৈরি করুন
            </Link>
          </p>
        </section>
      </main>
    </>
  );
}
