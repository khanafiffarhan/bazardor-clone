import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Minus } from "lucide-react";
import { bnNumber, money, numericPrice, productEmoji, type Product } from "@/lib/bazardor-api";

export function ProductCard({ product }: { product: Product }) {
  const change = Number(String(product.change ?? 0).replace(/[^\d.-]/g, "")) || 0;
  const href = `/product/${encodeURIComponent(String(product.id))}`;
  return <Link href={href} className="product-card">
    <div className="product-card-top"><span className="product-emoji">{productEmoji(product)}</span><span className={`change-badge ${change > 0 ? "change-up" : change < 0 ? "change-down" : "change-flat"}`}>{change > 0 ? <ArrowUpRight size={13}/> : change < 0 ? <ArrowDownRight size={13}/> : <Minus size={13}/>} {bnNumber(Math.abs(change))}%</span></div>
    <h3>{product.name}</h3><p className="product-unit">{product.unit}</p>
    <div className="product-price"><span>আজকের দাম</span><strong>{money(product.price ?? product.averagePrice ?? product.minPrice)}</strong></div>
  </Link>;
}

export function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) return <div className="api-empty"><span>🧺</span><strong>এখনো কোনো পণ্য পাওয়া যায়নি</strong><p>API-তে এই মুহূর্তে পণ্যের তথ্য নেই। কিছুক্ষণ পর আবার চেষ্টা করুন।</p></div>;
  return <div className="product-grid">{products.map((product, index) => <ProductCard key={`${product.id}-${index}`} product={product}/>)}</div>;
}
