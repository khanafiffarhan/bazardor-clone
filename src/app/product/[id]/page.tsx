import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

export const revalidate = 300;

type Market = {
  market: string;
  division: string;
  min: number;
  max: number;
};

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  category: string;
  categoryNameBn: string;
  categoryIcon: string;
  unit: string;
  image: string;
  today: number;
  yesterday: number;
  lastWeek: number;
  lastMonth: number;
  change: {
    dir: "up" | "down";
    pct: number;
  };
  markets: Market[];
};

const formatPrice = (price: number) =>
  `${price.toLocaleString("bn-BD")} টাকা`;

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let product: Product | null = null;

  try {
    const response = await fetch(
      `https://openapi.programming-hero.com/api/bazardor/products/${encodeURIComponent(id)}`,
      { next: { revalidate: 300 } },
    );

    if (response.ok) {
      product = await response.json();
    }
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }

  if (!product) notFound();

  const minPrice = product.markets.length
    ? Math.min(...product.markets.map((market) => market.min))
    : product.today;

  const maxPrice = product.markets.length
    ? Math.max(...product.markets.map((market) => market.max))
    : product.today;

  const averagePrice = product.markets.length
    ? product.markets.reduce(
        (sum, market) => sum + (market.min + market.max) / 2,
        0,
      ) / product.markets.length
    : product.today;

  return (
    <>
      <SiteHeader />

      <main className="shell product-detail-page">
        <Link href="/" className="back-link">
          ← সব পণ্যে ফিরে যান
        </Link>

        <article className="product-detail-card">
          <div className="detail-art">
            {product.image || product.categoryIcon || "🛒"}
          </div>

          <div className="detail-content">
            <span className="eyebrow">পণ্যের বিস্তারিত</span>

            <h1>{product.nameBn}</h1>

            <p className="detail-description">
              {product.nameBn} এর আজকের বাজারদর, বিভিন্ন বাজারের
              সর্বনিম্ন ও সর্বোচ্চ দাম এবং আগের সময়ের দামের তুলনা দেখুন।
            </p>

            <div className="detail-tags">
              <span>{product.categoryNameBn || product.category}</span>
              <span>প্রতি {product.unit}</span>
            </div>

            <div className="detail-price-grid">
              <div>
                <small>আজকের দাম</small>
                <strong>{formatPrice(product.today)}</strong>
              </div>

              <div>
                <small>সর্বনিম্ন দাম</small>
                <strong>{formatPrice(minPrice)}</strong>
              </div>

              <div>
                <small>সর্বোচ্চ দাম</small>
                <strong>{formatPrice(maxPrice)}</strong>
              </div>

              <div>
                <small>গড় দাম (আনুমানিক)</small>
                <strong>{formatPrice(Math.round(averagePrice))}</strong>
              </div>
            </div>

            <h2>দামের পরিবর্তন</h2>

            <div className="detail-tags">
              <span>গতকাল: {formatPrice(product.yesterday)}</span>
              <span>গত সপ্তাহ: {formatPrice(product.lastWeek)}</span>
              <span>গত মাস: {formatPrice(product.lastMonth)}</span>
              <span>
                পরিবর্তন: {product.change?.dir === "up" ? "▲" : "▼"}{" "}
                {product.change?.pct ?? 0}%
              </span>
            </div>

            <h2>বাজারভিত্তিক আজকের দাম</h2>

            <div className="market-table-wrapper">
              <table className="market-table">
                <thead>
                  <tr>
                    <th>বাজার</th>
                    <th>বিভাগ</th>
                    <th>সর্বনিম্ন</th>
                    <th>সর্বোচ্চ</th>
                  </tr>
                </thead>

                <tbody>
                  {product.markets.map((market) => (
                    <tr key={`${market.market}-${market.division}`}>
                      <td>{market.market}</td>
                      <td>{market.division}</td>
                      <td>{formatPrice(market.min)}</td>
                      <td>{formatPrice(market.max)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="detail-disclaimer">
              দাম ও প্রাপ্যতা API-র সরবরাহ করা তথ্যের ওপর নির্ভরশীল।
              কেনার আগে স্থানীয় বাজারে যাচাই করুন।
            </p>

            <Link href="/" className="submit-button detail-back">
              আরও পণ্য দেখুন ↗
            </Link>
          </div>
        </article>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>
            <strong>বাজার দর</strong> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
        </div>
      </footer>
    </>
  );
}