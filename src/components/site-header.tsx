
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBasket,
  UserRound,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";

import {
  getCategories,
  getProducts,
  money,
  productEmoji,
} from "@/lib/bazardor-api";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export function SiteHeader() {
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    let active = true;

    Promise.all([
      getCategories().catch(() => []),
      getProducts().catch(() => []),
    ]).then(([categoryData, productData]) => {
      if (active) {
        setCategories(categoryData);
        setProducts(productData);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  const ticker = products.slice(0, 12).map((product) => {
    const unit = (product.unit ?? "একক").replace("প্রতি ", "");
    const price =
      product.price ?? product.averagePrice ?? product.minPrice;

    return `${productEmoji(product)} ${product.name} ${money(price)}/${unit} •`;
  });

  const repeatedTicker = ticker.length
    ? [...ticker, ...ticker]
    : ["🛒 বাজারদর — পণ্যের দাম জানুন এক নজরে"];

  async function handleSignOut() {
    try {
      const result = await authClient.signOut();

      if (result.error) {
        toast.error("সাইন আউট করা যায়নি");
        return;
      }

      toast.success("সফলভাবে সাইন আউট হয়েছে");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("সাইন আউট করার সময় সমস্যা হয়েছে");
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur-md">
      {/* Topbar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex min-w-0 items-center gap-3"
        >
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-emerald-700 text-white shadow-sm">
            {/* <ShoppingBasket size={24} /> */}
            <Image width={24} height={24} src="/logo-icon.png" alt="বাজার দর" className="absolute" />
          </span>

          <span className="flex min-w-0 flex-col">
            <strong className="text-xl font-extrabold tracking-tight text-emerald-950 sm:text-2xl">
              বাজার দর
            </strong>
            <small className="hidden text-xs text-gray-500 sm:block">
              বাংলাদেশের বাজারদর এক নজরে
            </small>
          </span>
        </Link>

        {/* Authentication */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {isPending ? (
            <div className="size-10 animate-pulse rounded-full bg-gray-200" />
          ) : session?.user ? (
            <>
              <Link
                href="/profile"
                aria-label="আমার প্রোফাইল"
                title={session.user.name || "আমার প্রোফাইল"}
                className="group flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 p-1.5 pr-2 transition hover:border-emerald-300 hover:bg-emerald-100 sm:pr-4"
              >
                <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-700 text-white">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound size={20} />
                  )}
                </span>

                <span className="hidden max-w-32 truncate text-sm font-semibold text-emerald-950 sm:block">
                  {session.user.name || "আমার প্রোফাইল"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                aria-label="সাইন আউট"
                title="সাইন আউট"
                className="flex size-10 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="rounded-lg px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:px-4"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800 sm:px-5"
              >
                সাইন আপ <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Category navigation */}
      <nav
        aria-label="পণ্যের বিভাগ"
        className="border-t border-gray-100"
      >
        <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
          <Link
            href="/#সব-পণ্য"
            className="shrink-0 rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-800"
          >
            সব পণ্য
          </Link>

          {categories.map((category) => (
            <Link
              href={`/category/${encodeURIComponent(category.slug)}`}
              key={category.slug}
              className="shrink-0 rounded-full px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-800"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Price ticker */}
      <div
        className="overflow-hidden border-t border-emerald-100 bg-emerald-50 py-2"
        aria-label="পণ্যের বাজারদর"
      >
        <div className="ticker-track flex w-max items-center gap-8 whitespace-nowrap">
          {repeatedTicker.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="text-sm font-medium text-emerald-950"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}
