import Link from "next/link";
export default function NotFound() { return <main className="not-found"><span>🔎</span><h1>পৃষ্ঠাটি খুঁজে পাওয়া যায়নি</h1><p>এই পণ্য বা ক্যাটাগরির তথ্য পাওয়া যায়নি।</p><Link href="/" className="submit-button">হোম পেজে ফিরে যান</Link></main>; }
