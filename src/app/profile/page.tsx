
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { UserRound, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

export default function ProfilePage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (session?.user) {
      setName(session.user.name ?? "");
      setImage(session.user.image ?? "");
    }
  }, [session]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/signin");
    }
  }, [isPending, session, router]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!name.trim()) {
      toast.error("আপনার নাম লিখুন");
      return;
    }

    setSaving(true);

    try {
      const { error } = await authClient.updateUser({
        name: name.trim(),
        image: image.trim() || null,
      });

      if (error) {
        toast.error(error.message || "তথ্য আপডেট করা যায়নি");
        return;
      }

      toast.success("প্রোফাইল আপডেট হয়েছে!");
      router.refresh();
    } catch {
      toast.error("কিছু একটা সমস্যা হয়েছে");
    } finally {
      setSaving(false);
    }
  }

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-2xl">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700"
        >
          <ArrowLeft size={18} />
          হোম পেজে ফিরে যান
        </Link>

        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="bg-green-700 px-6 py-8 text-white sm:px-8">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full border-2 border-white/40 bg-white text-green-700">
                {image.trim() ? (
                  <img
                    src={image}
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={32} />
                )}
              </div>

              <div>
                <h1 className="text-2xl font-bold">
                  আমার প্রোফাইল
                </h1>
                <p className="mt-1 text-sm text-green-100">
                  আপনার তথ্য আপডেট করুন
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                আপনার নাম
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="আপনার নাম লিখুন"
                required
                maxLength={100}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                ইমেইল
              </label>
              <input
                id="email"
                type="email"
                value={session.user.email}
                readOnly
                className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-4 py-3 text-gray-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                ইমেইল পরিবর্তন করতে আলাদা email-change flow লাগবে।
              </p>
            </div>

            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                প্রোফাইল ছবির URL
              </label>
              <input
                id="image"
                type="url"
                value={image}
                onChange={(event) => setImage(event.target.value)}
                placeholder="https://example.com/photo.jpg"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
              <p className="mt-1 text-xs text-gray-500">
                একটি ছবির সরাসরি URL দিন। এটি ফাইল আপলোড নয়।
              </p>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <Save size={18} />
              {saving ? "আপডেট হচ্ছে..." : "তথ্য আপডেট করুন"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
