
import Link from "next/link";
import {
  ArrowRight,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { ProductGrid } from "@/components/product-card";
import {
  getCategories,
  getProducts,
} from "@/lib/bazardor-api";
import Image from "next/image";

export const revalidate = 300;

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    getProducts().catch(() => []),
    getCategories().catch(() => []),
  ]);

  // API price fields: today, yesterday, lastWeek, lastMonth
  // API change field: { dir: "up" | "down", pct: number }
  const risers = products
    .filter((product) => product.change?.dir === "up")
    .sort(
      (a, b) =>
        Number(b.change?.pct ?? 0) -
        Number(a.change?.pct ?? 0),
    )
    .slice(0, 6);

  const fallers = products
    .filter((product) => product.change?.dir === "down")
    .sort(
      (a, b) =>
        Number(b.change?.pct ?? 0) -
        Number(a.change?.pct ?? 0),
    )
    .slice(0, 6);

  const formatPrice = (price: number | undefined) =>
    price == null ? "দাম পাওয়া যায়নি" : `${price.toLocaleString("bn-BD")} টাকা`;

  return (
    <>
      <SiteHeader />

      <main className="shell home-main">
        <section className="home-hero">
          <div>
            <span className="intro-badge">
              <span />
              বাংলাদেশের বাজারদর এক নজরে
            </span>

            <h1>
              আজকের বাজারের দাম এক
              <br />
              <em>নজরে</em>
            </h1>

            <p>
              চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম —
              বাজারভিত্তিক বিস্তারিত, গড়, সর্বনিম্ন-সর্বোচ্চ এবং
              দামের পরিবর্তন এক জায়গায়।
            </p>

            <a href="#সব-পণ্য" className="submit-button home-cta">
              সব পণ্য দেখুন <ArrowRight size={17} />
            </a>

            <div className="hero-stats">
              <span>
                <strong>{products.length.toLocaleString("bn-BD")}</strong>{" "}
                পণ্য
              </span>
              <span>
                <strong>{categories.length.toLocaleString("bn-BD")}</strong>{" "}
                ক্যাটাগরি
              </span>
              <span>
                <strong>API</strong> লাইভ ডেটা
              </span>
            </div>
          </div>

          <div className="market-illustration">
            <Image
              width={400}
              height={400}
              src="/bazar-hero.png"
              alt="বাজারদর"
            />


          </div>
        </section>

        {risers.length > 0 && (
          <section className="product-section">
            <div className="section-heading">
              <div>

                <h2>
                  <span className="heading-up">▲</span>আজ দাম বেড়েছে 
                </h2>

              </div>
            </div>

            <ProductGrid products={risers} />
          </section>
        )}

        {fallers.length > 0 && (
          <section className="product-section">
            <div className="section-heading">
              <div>
                <span className="eyebrow">

                </span>
                <h2>
                <span className="heading-down">▼</span>  আজ দাম কমেছে 
                </h2>

              </div>
            </div>

            <ProductGrid products={fallers} />
          </section>
        )}

        <section id="সব-পণ্য" className="product-section all-products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                <span className="eyebrow-dot" /> বাজারের সম্পূর্ণ তালিকা
              </span>
              <h2>সব পণ্য</h2>
              <p>API থেকে পাওয়া পণ্যের বর্তমান দাম দেখুন।</p>
            </div>

            <span className="result-count">
              {products.length.toLocaleString("bn-BD")}টি পণ্য
            </span>
          </div>

          <div className="category-chips">
            <Link href="/#সব-পণ্য" className="category-chip active-chip">
              সব পণ্য
            </Link>

            {categories.map((category) => (
              <Link
                className="category-chip"
                href={`/category/${encodeURIComponent(category.slug)}`}
                key={category.slug}
              >
                {category.nameBn ?? category.name}
              </Link>
            ))}
          </div>

          <ProductGrid products={products} />
        </section>

        {/* Today's prices are explicitly read from product.today */}
        <section className="product-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">আজকের মূল্য</span>
              <h2>আজকের বাজারদর</h2>
            </div>
          </div>

          <div className="category-chips">
            {products.slice(0, 6).map((product) => (
              <div className="category-chip" key={product.id}>
                {product.image ?? product.categoryIcon ?? "🛒"}{" "}
                {product.nameBn} — {formatPrice(product.today)}
              </div>
            ))}
          </div>
        </section>

        <section className="api-note">
          <span>✓</span>
          <p>
            <strong>সরাসরি API ইন্টিগ্রেশন</strong>
            <br />
            পণ্যের বর্তমান দাম `today` এবং মূল্য পরিবর্তন
            `change.pct` থেকে নেওয়া হয়।
          </p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>
            <strong>বাজার দর</strong> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <p>দাম বাজার ও সময় অনুযায়ী পরিবর্তিত হতে পারে।</p>
        </div>
      </footer>
    </>
  );
}
