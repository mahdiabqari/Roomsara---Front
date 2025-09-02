"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const api = "";
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [verificationError, setVerificationError] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendInfo(e) {
    e.preventDefault();
    setLoading(true);
    setError(""); // پاک کردن خطاهای قبلی

    const formData = new FormData(e.target);
    const name = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");

    // اعتبارسنجی ایمیل با regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("لطفاً یک ایمیل معتبر وارد کنید.");
      setLoading(false);
      return;
    }

    // اعتبارسنجی رمز عبور با regex
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
      setError(
        "رمز عبور باید حداقل ۶ کاراکتر داشته باشد و شامل حداقل یک عدد و یک حرف باشد."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${api}/users/register`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setLoading(false);
        setStep(2); // رفتن به مرحله بعدی
      } else {
        const errorMessage = await response.text();
        setError(errorMessage); // نمایش خطا در state
      }
    } catch (error) {
      setError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  async function verifyCode(e) {
    e.preventDefault();
    setLoading(true);
    setVerificationError(""); // پاک کردن خطاهای قبلی
    const formData = new FormData(e.target);
    const code = formData.get("code");

    try {
      const response = await fetch(`${api}/users/verify-email`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      if (response.ok) {
        const data = await response.json();
        const token = response.headers.get("Authorization");
        const userId = data.userId;
        localStorage.setItem("RoomSaraID", userId);
        localStorage.setItem("AuthorizationRoomSara", token);
        router.push(`/App`);
        setLoading(false);
      } else {
        const error = await response.text();
        setVerificationError(error); // نمایش خطا در state
      }
    } catch (error) {
      setVerificationError("خطا در ارتباط با سرور");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {step === 1 ? (
        <main
          dir="rtl"
          className="main-home w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#333333] to-[#005f73] p-4 md:p-6"
        >
          <div className="flex flex-col w-full max-w-[500px] bg-[#333333] rounded-2xl shadow-xl overflow-hidden border border-[#CCCCCC]/20">
            <div className="bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0] p-8 md:p-6">
              <h1 className="text-center font-black text-4xl md:text-3xl text-white drop-shadow-md">
                ثبت‌نام
              </h1>
              <h2 className="text-center text-[#CCCCCC] text-lg md:text-base mt-2 font-medium">
                لطفاً اطلاعات خود را وارد کنید
              </h2>
            </div>

            <form
              className="flex flex-col gap-6 p-8 md:p-6 bg-[#000000]/30"
              onSubmit={sendInfo}
            >
              <div className="space-y-4">
                <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                  نام کامل
                </label>
                <input
                  name="name"
                  className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                       focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                       transition-all duration-200 placeholder:text-[#CCCCCC]/60"
                  type="text"
                  placeholder="نام و نام خانوادگی"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                  ایمیل
                </label>
                <input
                  name="email"
                  className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                       focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                       transition-all duration-200 placeholder:text-[#CCCCCC]/60"
                  type="email"
                  placeholder="example@domain.com"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                  رمز عبور
                </label>
                <input
                  name="password"
                  className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                       focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                       transition-all duration-200 placeholder:text-[#CCCCCC]/60"
                  type="password"
                  placeholder="••••••••"
                  minLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-6 bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0]
        text-white font-bold text-lg md:text-base rounded-xl transform hover:scale-[1.02]
        transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-1 gap-2 py-1">
                    <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.3s] rounded-sm"></span>
                    <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.15s] rounded-sm"></span>
                    <span className="w-1.5 h-4 bg-white animate-bounce rounded-sm"></span>
                  </div>
                ) : (
                  "ثبت‌نام در سیستم"
                )}
              </button>

              {error && (
                <div className="mt-2 p-3 text-center text-red-400 bg-red-900/30 rounded-lg border border-red-400/30 animate-fade-in">
                  {error}
                </div>
              )}

              <Link
                href="/Login"
                className="text-[#CCCCCC] hover:text-[#ee9b00] text-sm font-medium text-center transition-colors"
              >
                قبلاً ثبت‌نام کرده‌اید؟ وارد شوید
              </Link>
            </form>
          </div>
        </main>
      ) : (
        <main
          dir="rtl"
          className="main-home w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#333333] to-[#005f73] p-4 md:p-6"
        >
          <div className="flex flex-col w-full max-w-[500px] bg-[#333333] rounded-2xl shadow-xl overflow-hidden border border-[#CCCCCC]/20">
            <div className="bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0] p-8 md:p-6">
              <h1 className="text-center font-black text-4xl md:text-3xl text-white drop-shadow-md">
                تأیید ایمیل
              </h1>
              <h2 className="text-center text-[#CCCCCC] text-lg md:text-base mt-2 font-medium">
                کد تأیید به {email} ارسال شد
              </h2>
            </div>

            <form
              className="flex flex-col gap-6 p-8 md:p-6 bg-[#000000]/30"
              onSubmit={verifyCode}
            >
              <div className="space-y-4">
                <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                  کد تأیید ۶ رقمی
                </label>
                <input
                  name="code"
                  className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                       focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                       transition-all duration-200 placeholder:text-[#CCCCCC]/60 text-center"
                  type="number"
                  placeholder="------"
                  inputMode="numeric"
                  pattern="\d{6}"
                  maxLength="6"
                  required
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 px-6 bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0]
        text-white font-bold text-lg md:text-base rounded-xl transform hover:scale-[1.02]
        transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-1 gap-2 py-1">
                    <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.3s] rounded-sm"></span>
                    <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.15s] rounded-sm"></span>
                    <span className="w-1.5 h-4 bg-white animate-bounce rounded-sm"></span>
                  </div>
                ) : (
                  "تایید نهایی"
                )}
              </button>

              {verificationError && (
                <div className="mt-2 p-3 text-center text-red-400 bg-red-900/30 rounded-lg border border-red-400/30 animate-fade-in">
                  {verificationError}
                </div>
              )}

              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#CCCCCC] hover:text-[#ee9b00] text-sm font-medium text-center transition-colors"
              >
                بازگشت به صفحه ثبت نام
              </button>
            </form>
          </div>
        </main>
      )}
    </>
  );
}
