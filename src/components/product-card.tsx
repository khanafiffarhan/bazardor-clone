"use client";

import { useRouter } from "next/navigation";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  bnNumber,
  money,
  type Product,
  productEmoji,
} from "@/lib/bazardor-api";

export function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const change = Number(product.change?.pct ?? 0);
  const direction = product.change?.dir;

  const handleClick = () => {
    if (isPending) return;

    if (!session) {
      router.push("/signup");
      return;
    }

    router.push(`/product/${encodeURIComponent(String(product.id))}`);
  };

  return (
    <div
      onClick={handleClick}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
      role="link"
      tabIndex={0}
      aria-disabled={isPending}
      className="product-card"
      style={{ cursor: isPending ? "wait" : "pointer" }}
    >
      <div className="product-card-top">
        <span className="product-emoji">{productEmoji(product)}</span>

        <span
          className={`change-badge ${
            direction === "up"
              ? "change-up"
              : direction === "down"
                ? "change-down"
                : "change-flat"
          }`}
        >
          {direction === "up" ? (
            <ArrowUpRight size={13} />
          ) : direction === "down" ? (
            <ArrowDownRight size={13} />
          ) : (
            <Minus size={13} />
          )}

          {bnNumber(Math.abs(change))}%
        </span>
      </div>

      <h3>{product.name}</h3>

      <p className="product-unit">{product.unit}</p>

      <div className="product-price">
        <span>আজকের দাম</span>
        <strong>
          {money(product.price ?? product.averagePrice ?? product.minPrice)}
        </strong>
      </div>
    </div>
  );
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return (
      <div className="api-empty">
        <span>🧺</span>
        <strong>এখনো কোনো পণ্য পাওয়া যায়নি</strong>
        <p>
          API-তে এই মুহূর্তে পণ্যের তথ্য নেই। কিছুক্ষণ পর আবার চেষ্টা করুন।
        </p>
      </div>
    );
  }

  return (
    <div className="product-grid">
      {products.map((product, index) => (
        <ProductCard key={`${product.id}-${index}`} product={product} />
      ))}
    </div>
  );
}