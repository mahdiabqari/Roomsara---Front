import "./Home.css";
import Link from "next/link";
import Head from "next/head";
import Header from "./components/----/headerpage";

export const metadata = {
  title: "روم سرا | پیام رسان امن با چت گروهی و تماس صوتی",
  description:
    "پیام رسان فارسی روم سرا با قابلیت چت خصوصی و گروهی، تماس صوتی با کیفیت بالا و امنیت end-to-end. دانلود رایگان نسخه اندروید و استفاده از نسخه وب PWA",
  keywords:
    "پیام رسان ایرانی, چت گروهی, تماس صوتی, دانلود اندروید, PWA, امنیت چت, روم سرا",
  authors: [{ name: "روم سرا" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  applicationName: "روم سرا",
  icons: [
    { rel: "icon", url: "/favicon.ico" },
    { rel: "apple-touch-icon", url: "/icon.png" },
  ],
  openGraph: {
    title: "روم سرا | پیام رسان امن با چت گروهی و تماس صوتی",
    description:
      "پیام رسان فارسی روم سرا با قابلیت چت خصوصی و گروهی، تماس صوتی با کیفیت بالا و امنیت end-to-end. دانلود رایگان نسخه اندروید و استفاده از نسخه وب PWA",
    url: "https://roomsara.liara.run",
    siteName: "روم سرا",
    images: [
      {
        url: "/icon.png",
        width: 600,
        height: 600,
        alt: "روم سرا",
      },
    ],
    locale: "fa_IR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "روم سرا | پیام رسان امن با چت گروهی و تماس صوتی",
    description:
      "پیام رسان فارسی روم سرا با قابلیت چت خصوصی و گروهی، تماس صوتی با کیفیت بالا و امنیت end-to-end. دانلود رایگان نسخه اندروید و استفاده از نسخه وب PWA",
    images: ["/icon.png"],
    creator: "@roomsara_app",
  },
  metadataBase: new URL("https://roomsara.liara.run"),
};

export default function Home() {
  return (
    <div className="animate-fade-in">
      {/* افزودن تگ‌های سئو */}
      <Head>
        <title>روم سرا | پیام رسان امن با چت گروهی و تماس صوتی</title>
        <meta
          name="description"
          content="پیام رسان فارسی روم سرا با قابلیت چت خصوصی و گروهی، تماس صوتی با کیفیت بالا و امنیت end-to-end. دانلود رایگان نسخه اندروید و استفاده از نسخه وب PWA"
        />
        <meta
          name="keywords"
          content="پیام رسان ایرانی, چت گروهی, تماس صوتی, دانلود اندروید, PWA, امنیت چت"
        />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="fa_IR" />
        <link rel="canonical" href="https://roomsara.liara.run" />
      </Head>

      <Header />

      {/* بخش معرفی (Hero) */}
      <section className="hero">
        <div className="hero-content animate-slide-up" data-aos="fade-up">
          <h1>روم ســـرا</h1>
          <p role="doc-subtitle">
            پیام‌رسانی سریع، ارتباط صوتی، گفت‌وگوهای گروهی، تماس‌های صوتی و
            ارتباطی ساده و بی‌وقفه – همه در یک پلتفرم سبک و کاربردی
          </p>
          <div className="cta-buttons">
            <Link
              href="/SignIn"
              className="btn btn-primary animate-scale-in glow"
            >
              شروع رایگان
            </Link>
            <Link href="/Login" className="btn btn-secondary animate-scale-in">
              ورود به حساب
            </Link>
          </div>
        </div>
        <img
          src="/icon.png"
          alt="نمایشگر رابط کاربری روم سرا"
          className="hero-image animate-slide-up"
          data-aos="fade-left"
          width="600"
          height="600"
          loading="lazy"
        />
      </section>

      {/* بخش ویژگی‌ها */}
      <section aria-labelledby="features-heading">
        <h2 id="features-heading" className="sr-only">
          ویژگی‌های اصلی
        </h2>
        <div className="features-grid">
          <div className="feature-card animate-slide-up" data-aos="zoom-in">
            <img
              src="/networking.png"
              alt="آیکون چت گروهی"
              className="w-20 h-20 mb-6"
              width="80"
              height="80"
              loading="lazy"
            />
            <h3>پیام‌رسانی هوشمند</h3>
            <p>سیستم چت پیشرفته با قابلیت‌های گروهی و مدیریت حرفه‌ای</p>
          </div>

          <div
            className="feature-card animate-slide-up"
            data-aos="zoom-in"
            data-aos-delay="200"
          >
            <img
              src="/lock.png"
              alt="آیکون امنیت"
              className="w-20 h-20 mb-6"
              width="80"
              height="80"
              loading="lazy"
            />
            <h3>ذخیره‌سازی ایمن پیام‌ها</h3>
            <p>
              پیام‌های شما به‌صورت امن در سرور ذخیره شده و از دسترسی غیرمجاز
              محافظت می‌شوند.
            </p>
          </div>

          <div
            className="feature-card animate-slide-up"
            data-aos="zoom-in"
            data-aos-delay="400"
          >
            <img
              src="/touch.png"
              alt="آیکون دسترسی آسان"
              className="w-20 h-20 mb-6"
              width="80"
              height="80"
              loading="lazy"
            />
            <h3>دسترسی آسان و راحت (PWA)</h3>
            <p>استفاده بدون نیاز به نصب اپلیکیشن</p>
          </div>
        </div>
      </section>

      {/* بخش تبلیغات و دانلود اپلیکیشن */}
      <section className="promo-section" data-aos="fade-up">
        <div className="promo-content md:rounded-0">
          <h2>همـیـن حـالا شــروع کنـیــد</h2>
          <p>از طریق موبایل یا نسخه وب</p>
          <div className="download-section">
            <div className="download-buttons">
              <Link
                href="https://roomsaraservernet.liara.run/download-app"
                className="relative btn container items-center gap-3 md:gap-2 w-[20%] md:w-[70%] btn-download"
                aria-label="دانلود نسخه اندروید"
              >
                <span className="absolute top-[-28px] right-4 md:right-4 text-[12px] md:text-xs text-gray-200 bg-black/50 px-4 py-1 rounded-t-lg">
                  نسخه دمو
                </span>
                دانلود اندروید
                <img
                  src="/android.png"
                  alt="آیکون اندروید"
                  className="w-10 rounded-full h-10"
                  width="40"
                  height="40"
                  loading="lazy"
                />
              </Link>

              <Link
                href="/Login"
                className="btn container items-center gap-3 md:gap-2 w-[30%] md:w-[70%] btn-download"
                aria-label="استفاده از نسخه PWA"
              >
                نسخه PWA
                <img
                  src="/browser.png"
                  alt="آیکون مرورگر"
                  className="w-10 rounded-full mb-2 md:mb-0 h-10"
                  width="40"
                  height="40"
                  loading="lazy"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* فوتر */}
      <footer className="footer animated-gradient" role="contentinfo">
        <div className="footer-links">
          <a
            href="mailto:rooomsara@gmail.com"
            data-aos="fade-up"
            data-aos-delay="200"
            aria-label="تماس با ما"
          >
            تماس با ما
          </a>
        </div>
        <div className="social-icons my-7">
          <Link
            href="https://instagram.com/roomsara_app"
            data-aos="fade-up"
            data-aos-delay="400"
            aria-label="صفحه اینستاگرام روم سرا"
          >
            <img
              src="/instagram.png"
              alt="آیکون اینستاگرام"
              className="w-10 rounded-full h-10"
              width="40"
              height="40"
              loading="lazy"
            />
          </Link>
          <Link
            href="mailto:rooomsara@gmail.com"
            data-aos="fade-up"
            data-aos-delay="500"
            aria-label="ارسال ایمیل به روم سرا"
          >
            <img
              src="/Gmail.png"
              alt="آیکون جیمیل"
              className="w-10 h-10"
              width="40"
              height="40"
              loading="lazy"
            />
          </Link>
        </div>
        <p data-aos="fade-up" data-aos-delay="600">
          © 2025 روم سرا. تمام حقوق محفوظ است.
        </p>
      </footer>
    </div>
  );
}
