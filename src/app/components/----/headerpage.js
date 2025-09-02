"use client";
import { useEffect, useState } from "react";
import React from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Link from "next/link";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);
  return (
    <>
      {/* هدر بدون تغییر */}
      <header className="header">
        <nav className="nav">
          <Link
            href="/"
            className="logo animate-scale-in"
            aria-label="صفحه اصلی روم سرا"
          >
            <img
              src="/logo.png"
              alt="لوگوی روم سرا"
              className="logo-image"
              width="48"
              height="48"
              loading="lazy"
            />
            روم سرا
          </Link>

          {/* دسکتاپ منو */}
          <div className="nav-links">
            <Link href="/Login" className="animate-slide-up">
              ورود
            </Link>
            <Link href="/SignIn" className="animate-slide-up">
              ثبت نام
            </Link>
            <Link
              href="mailto:rooomsara@gmail.com"
              className="animate-slide-up"
            >
              ارتباط با ما
            </Link>
          </div>

          {/* موبایل منو */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="منوی موبایل"
          >
            {isMenuOpen ? (
              <h1 className="w-10 h-10">✕</h1>
            ) : (
              <img
                src="/Menu.png"
                className="w-10 bg-white rounded-xl h-10"
                alt="منوی موبایل"
                width="40"
                height="40"
                loading="lazy"
              />
            )}
          </button>

          <div
            className={`mobile-menu hidden md:flex mt-4 ${
              isMenuOpen ? "active" : ""
            }`}
          >
            <Link href="/Login" onClick={() => setIsMenuOpen(false)}>
              ورود
            </Link>
            <Link href="/SignIn" onClick={() => setIsMenuOpen(false)}>
              ثبت نام
            </Link>
            <Link
              href="mailto:rooomsara@gmail.com"
              onClick={() => setIsMenuOpen(false)}
            >
              ارتباط با ما
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
