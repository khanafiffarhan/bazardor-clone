import Link from "next/link";
import { ArrowLeft, ShieldCheck, TrendingUp, MapPin } from "lucide-react";
import { SiteHeader } from "@/components/site-header";
import { SignupForm } from "@/components/signup-form";
export default function SignupPage() {
  return (
    <>
      <SiteHeader />
      <main className="signup-main">
        <div className="shell signup-layout">
          <div className="signup-intro">
            <Link href="/" className="back-link">
              <ArrowLeft size={16} /> হোম পেজে ফিরে যান
            </Link>
            <div className="intro-content">
              <div className="intro-badge">
                <span /> স্মার্ট বাজারের স্মার্ট সিদ্ধান্ত
              </div>
              <h2>
                বাজার বুঝুন,
                <br />
                <em>সাশ্রয়ী</em> থাকুন।
              </h2>
              <p>
                প্রয়োজনীয় পণ্যের দাম জানুন এক নজরে। সঠিক তথ্য নিয়ে প্রতিদিনের
                বাজার করুন আরও নিশ্চিন্তে।
              </p>
              <div className="benefit-list">
                <div>
                  <span className="benefit-icon">
                    <TrendingUp size={19} />
                  </span>
                  <span>
                    <strong>দামের ওঠানামা দেখুন</strong>
                    <small>প্রতিদিনের বাজারদরের তুলনা</small>
                  </span>
                </div>
                <div>
                  <span className="benefit-icon">
                    <MapPin size={19} />
                  </span>
                  <span>
                    <strong>বাজারভিত্তিক তথ্য</strong>
                    <small>বিভিন্ন বাজারের দামের ধারণা</small>
                  </span>
                </div>
                <div>
                  <span className="benefit-icon">
                    <ShieldCheck size={19} />
                  </span>
                  <span>
                    <strong>সহজ ও নিরাপদ অ্যাকাউন্ট</strong>
                    <small>আপনার তথ্য আপনারই</small>
                  </span>
                </div>
              </div>
            </div>
            <div className="intro-footer">
              <span className="footer-mark">BD</span>
              <span>প্রতিদিনের বাজার, এবার হাতের মুঠোয়।</span>
            </div>
          </div>
          <div className="form-column">
            <SignupForm />
          </div>
        </div>
      </main>
      <footer className="site-footer">
        <div className="shell footer-inner">
          <p>
            <strong>বাজার দর</strong> — প্রয়োজনীয় পণ্যের দাম এক নজরে।
          </p>
          <p>সকল দাম সম্ভাব্য; বাজার অবস্থার ওপর নির্ভর করে পরিবর্তিত হয়।</p>
        </div>
      </footer>
    </>
  );
}
