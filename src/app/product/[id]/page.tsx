import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getProduct, money, productEmoji } from "@/lib/bazardor-api";

export const revalidate = 300;
export default async function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  if (!product) notFound();
  const categoryName = typeof product.category === "string" ? product.category : product.category?.name;
  return <><SiteHeader/><main className="shell product-detail-page"><Link href="/" className="back-link">← সব পণ্যে ফিরে যান</Link><article className="product-detail-card"><div className="detail-art">{productEmoji(product)}</div><div className="detail-content"><span className="eyebrow">পণ্যের বিস্তারিত</span><h1>{product.name}</h1><p className="detail-description">{product.description || "এই পণ্যের বাজারদর এবং মূল্যসংক্রান্ত তথ্য API থেকে সংগ্রহ করা হয়েছে।"}</p><div className="detail-tags"><span>{categoryName || "বাজার পণ্য"}</span><span>{product.unit}</span></div><div className="detail-price-grid"><div><small>আজকের দাম</small><strong>{money(product.price ?? product.averagePrice ?? product.minPrice)}</strong></div><div><small>সর্বনিম্ন দাম</small><strong>{money(product.minPrice)}</strong></div><div><small>সর্বোচ্চ দাম</small><strong>{money(product.maxPrice)}</strong></div><div><small>গড় দাম</small><strong>{money(product.averagePrice ?? product.price)}</strong></div></div><p className="detail-disclaimer">দাম ও প্রাপ্যতা API-র সরবরাহ করা তথ্যের ওপর নির্ভরশীল। কেনার আগে স্থানীয় বাজারে যাচাই করুন।</p><Link href="/" className="submit-button detail-back">আরও পণ্য দেখুন ↗</Link></div></article></main><footer className="site-footer"><div className="shell footer-inner"><p><strong>বাজার দর</strong> — প্রয়োজনীয় পণ্যের দাম এক নজরে।</p><p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p></div></footer></>;
}
