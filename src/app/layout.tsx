import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ConsentBanner from "@/components/ConsentBanner";

const manrope = Manrope({ subsets: ["latin"], weight: ["400", "500", "600", "700", "800"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://kardiaguard.com"),
  title: {
    default: "Kardia Guard — Knowledge is Power for your heart",
    template: "%s · Kardia Guard",
  },
  description:
    "Kardia Guard is a free service that connects you to heart-screening facilities and providers near you, reminds you what to check and when based on national guidelines, and gives you the knowledge to make the right decisions for your heart.",
  openGraph: {
    title: "Kardia Guard — Knowledge is Power",
    description:
      "Find heart screening near you, get guideline-based reminders, and the knowledge to decide. Free to join.",
    images: ["/brand/logo.png"],
    type: "website",
  },
  icons: { icon: "/brand/heart.png" },
};

const PIXEL_ID = process.env.NEXT_PUBLIC_PIXEL_ID || "kardiaguard";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={manrope.className}>
        {/* Core visitor tracking — PredictiveData pixel (identifies/enriches visitors into the Core CRM) */}
        <Script id="predictivedata-pixel" strategy="afterInteractive" dangerouslySetInnerHTML={{
          __html:
            `(function(s,p,i,c,e){s[e]=s[e]||function(){(s[e].a=s[e].a||[]).push(arguments);};s[e].l=1*new Date();var t=new Date().getTime();var k=c.createElement("script"),a=c.getElementsByTagName("script")[0];k.async=1,k.src=p+"?request_id="+i+"&t="+t,a.parentNode.insertBefore(k,a);s.pixelClientId=i;})(window,"https://predictivedata.org/script","${PIXEL_ID}",document,"script");`,
        }} />
        <Header />
        <div style={{ flex: 1 }}>{children}</div>
        <Footer />
        <ConsentBanner />
      </body>
    </html>
  );
}
