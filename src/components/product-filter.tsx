
"use client";

import { useMemo, useState } from "react";
import { ArrowDownWideNarrow } from "lucide-react";
import { ProductGrid } from "@/components/product-card";
import type { Product } from "@/lib/bazardor-api";

type SortOption = "default" | "price-asc" | "price-desc";

export function ProductFilter({
  products,
}: {
  products: Product[];
}) {
  const [sortBy, setSortBy] = useState<SortOption>("default");

  const sortedProducts = useMemo(() => {
    const result = [...products];

    if (sortBy === "price-asc") {
      return result.sort(
        (a, b) => Number(a.today ?? Infinity) - Number(b.today ?? Infinity),
      );
    }

    if (sortBy === "price-desc") {
      return result.sort(
        (a, b) => Number(b.today ?? -Infinity) - Number(a.today ?? -Infinity),
      );
    }

    return result;
  }, [products, sortBy]);

  return (
    <div className="w-full space-y-5">
      {/* Responsive filter */}
      <div className="flex flex-col gap-3 rounded-xl border border-emerald-100 bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
            <ArrowDownWideNarrow size={19} />
          </span>

          <div>
            <p className="text-sm font-semibold text-gray-800">
              পণ্য সাজান
            </p>
            <p className="text-xs text-gray-500">
              আপনার পছন্দ অনুযায়ী দাম দেখুন
            </p>
          </div>
        </div>

        <label className="flex w-full items-center gap-2 sm:w-auto">
          <span className="shrink-0 text-sm text-gray-600">
            সাজান :
          </span>

          <select
            value={sortBy}
            onChange={(event) =>
              setSortBy(event.target.value as SortOption)
            }
            className="min-w-0 flex-1 cursor-pointer rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 sm:min-w-52 sm:flex-none"
            aria-label="পণ্যের দাম অনুযায়ী সাজান"
          >
            <option value="default">ডিফল্ট</option>
            <option value="price-asc">দাম : কম থেকে বেশি</option>
            <option value="price-desc">দাম : বেশি থেকে কম</option>
          </select>
        </label>
      </div>

      <ProductGrid products={sortedProducts} />
    </div>
  );
}
