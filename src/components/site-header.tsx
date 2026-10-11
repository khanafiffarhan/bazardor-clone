
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { UserRound, LogOut } from "lucide-react";
import toast from "react-hot-toast";

import {
  getCategories,
  getProducts,
  money,
  productEmoji,
} from "@/lib/bazardor-api";

import { authClient } from "@/lib/auth-client";

type Category = {
  slug: string;
  name: string;
};

type Product = {
  id?: number | string;
  slug?: string;
  name?: string;
  nameBn?: string;
  unit?: string;
  price?: number;
  averagePrice?: number;
  minPrice?: number;
  today?: number;
  category?: string;
};

export function SiteHeader() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [signingOut, setSigningOut] = useState(false);

  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    let active = true;

    Promise.all([
      getCategories().catch(() => []),
      getProducts().catch(() => []),
    ]).then(([categoryData, productData]) => {
      if (!active) return;

      setCategories(categoryData as Category[]);
      setProducts(productData as Product[]);
    });

    return () => {
      active = false;
    };
  }, []);

  const ticker = products.slice(0, 12).map((product) => {
    const unit = (product.unit ?? "একক").replace("প্রতি ", "");
    const price =
      product.today ??
      product.price ??
      product.averagePrice ??
      product.minPrice;

    const name = product.nameBn ?? product.name ?? "পণ্য";

    return `${productEmoji(product)} ${name} ${
      price != null ? money(price) : "দাম নেই"
    }/${unit} •`;
  });

  const repeatedTicker = ticker.length
    ? [...ticker, ...ticker]
    : ["🛒 বাজার দর — পণ্যের দাম জানুন এক নজরে"];

  async function handleSignOut() {
    if (signingOut) return;

    setSigningOut(true);

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
    } finally {
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-emerald-100 bg-white/95 shadow-sm backdrop-blur-md">
      {/* Topbar */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-2 px-3 py-2.5 sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
        {/* Logo and brand */}
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 sm:gap-3"
          aria-label="বাজার দর হোম"
        >
          <span className="relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-emerald-700 shadow-sm sm:size-11">
            <Image
              src="/logo-icon.png"
              alt="বাজার দর"
              width={32}
              height={32}
              priority
              className="size-7 object-contain sm:size-8"
            />
          </span>

          <span className="flex min-w-0 flex-col">
            <strong className="whitespace-nowrap text-lg font-extrabold leading-tight tracking-tight text-emerald-950 sm:text-2xl">
              বাজার দর
            </strong>

            <small className="hidden text-xs text-gray-500 sm:block">
              বাংলাদেশের বাজারদর এক নজরে
            </small>
          </span>
        </Link>

        {/* Authentication */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {isPending ? (
            <div className="size-9 animate-pulse rounded-full bg-gray-200 sm:size-10" />
          ) : session?.user ? (
            <>
              <Link
                href="/profile"
                aria-label="আমার প্রোফাইল"
                title={session.user.name || "আমার প্রোফাইল"}
                className="flex max-w-36 items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 p-1 transition hover:border-emerald-300 hover:bg-emerald-100 sm:max-w-56 sm:gap-2 sm:py-1.5 sm:pl-1.5 sm:pr-3"
              >
                <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-emerald-700 text-white sm:size-9">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt=""
                      className="size-full object-cover"
                    />
                  ) : (
                    <UserRound size={19} />
                  )}
                </span>

                <span className="hidden truncate text-sm font-semibold text-emerald-950 sm:block">
                  {session.user.name || "আমার প্রোফাইল"}
                </span>
              </Link>

              <button
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
                aria-label="সাইন আউট"
                title="সাইন আউট"
                className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-600 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 sm:size-10"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            <>
              <Link
                href="/signin"
                className="whitespace-nowrap rounded-lg px-2.5 py-2 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 sm:px-4 sm:text-sm"
              >
                সাইন ইন
              </Link>

              <Link
                href="/signup"
                className="whitespace-nowrap rounded-lg bg-emerald-700 px-2.5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-800 sm:px-5 sm:text-sm"
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
        <div className="scrollbar-hide mx-auto flex w-full max-w-7xl items-center gap-1.5 overflow-x-auto px-3 py-2 sm:gap-2 sm:px-6 lg:px-8">
          <Link
            href="/#সব-পণ্য"
            className="shrink-0 rounded-full bg-emerald-700 px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-emerald-800 sm:px-4 sm:text-sm"
          >
            সব পণ্য
          </Link>

          {categories.map((category) => (
            <Link
              href={`/category/${encodeURIComponent(category.slug)}`}
              key={category.slug}
              className="shrink-0 rounded-full px-3.5 py-2 text-xs font-medium text-gray-600 transition hover:bg-emerald-50 hover:text-emerald-800 sm:px-4 sm:text-sm"
            >
              {category.name}
            </Link>
          ))}
        </div>
      </nav>

      {/* Price ticker */}
      <div
        className="w-full overflow-hidden border-t border-emerald-100 bg-emerald-50 py-2"
        aria-label="পণ্যের বাজারদর"
      >
        <div className="ticker-track flex w-max items-center gap-5 whitespace-nowrap sm:gap-8">
          {repeatedTicker.map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="text-xs font-medium text-emerald-950 sm:text-sm"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </header>
  );
}


