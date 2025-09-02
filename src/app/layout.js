import "./globals.css";
import localFont from "next/font/local";
import Head from "next/head";

export const metadata = {
  title: "روم سرا",
  description:
    "پلتفرم فارسی روم سرا با قابلیت چت خصوصی و گروهی، تماس صوتی با کیفیت بالا. دانلود رایگان نسخه اندروید و استفاده از نسخه وب PWA",
  keywords:
    "پیام رسان ایرانی, چت گروهی, تماس صوتی, دانلود اندروید, PWA, امنیت چت",
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: "https://roomsara.liara.run",
  },
  alternates: {
    canonical: "https://roomsara.liara.run",
  },
};

const vazir = localFont({
  src: "Vazir.ttf",
});

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <Head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#ee9b00" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2c87f0" />
        <link
          rel="icon"
          href="/logo-192.png"
          type="image/png"
          sizes="192x192"
        />
        <link rel="apple-touch-icon" href="/logo-192.png" sizes="192x192" />
        <meta name="msapplication-TileImage" content="/logo.png" />
        <link
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
          rel="stylesheet"
        />
      </Head>
      <body className={`${vazir.className} bg-slate-900`}>{children}</body>
    </html>
  );
}
