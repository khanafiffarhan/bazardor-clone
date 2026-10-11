import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ProductGrid } from "@/components/product-card";
import { getCategories, getCategory, getProductsByCategory } from "@/lib/bazardor-api";

export const revalidate = 300;
export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products, categories] = await Promise.all([
    getCategory(slug), getProductsByCategory(slug).catch(() => []), getCategories().catch(() => []),
  ]);
  const knownCategory = category ?? categories.find((item) => item.slug === slug) ?? null;
  if (!knownCategory && products.length === 0) notFound();
  return <><SiteHeader/><main className="shell category-page"><Link href="/" className="back-link">← হোম পেজে ফিরুন</Link><div className="category-page-heading"><span className="category-large-emoji">🧺</span><div><span className="eyebrow">ক্যাটাগরি</span><h1>{knownCategory?.name ?? slug}</h1><p>{knownCategory?.description || "এই ক্যাটাগরির পণ্যের বাজারদর দেখুন।"}</p></div></div><div className="section-heading"><div><h2>এই ক্যাটাগরির পণ্য</h2><p>ক্যাটাগরি ফিল্টার API থেকে পাওয়া তথ্য</p></div><span className="result-count">{products.length.toLocaleString("bn-BD")}টি পণ্য</span></div><ProductGrid products={products}/></main><footer className="site-footer"><div className="shell footer-inner"><p><strong>বাজার দর</strong> — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p><p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p></div></footer></>;
}
