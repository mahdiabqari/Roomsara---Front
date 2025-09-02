"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import "./login.css";
export default function login() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [timer, setTimer] = useState(120);
  const [verifyCode, setVerifyCode] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const api = "";
  const [loadingg, setLoadingg] = useState(false);

  async function sendInfo(e) {
    e.preventDefault();
    setLoadingg(true);

    // اعتبارسنجی ایمیل با regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("لطفاً یک ایمیل معتبر وارد کنید.");
      setLoadingg(false);
      return;
    }

    // اعتبارسنجی رمز عبور با regex
    const passwordRegex = /^.{6,}$/;
    if (!passwordRegex.test(password)) {
      alert("رمز عبور باید حداقل 6 کاراکتر داشته باشد.");
      setLoadingg(false);
      return;
    }

    const newuser = { email, password };

    try {
      const response = await fetch(`${api}/users/login`, {
        method: "POST",
        body: JSON.stringify(newuser),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const userId = data.id; // User ID from response
        const token = response.headers.get("authorization"); // Try to get token from headers
        setLoadingg(false);

        if (token) {
          localStorage.setItem("AuthorizationRoomSara", token); // Save token
          localStorage.setItem("RoomSaraID", userId); // Save user ID
          router.push(`/App`);
        } else {
          setLoadingg(false);
        }
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
        setLoadingg(false);
      }
    } catch (error) {
      setLoadingg(false);
      alert(
        "An error occurred while trying to log in. Please try again later."
      );
    }
  }

  // شمارش معکوس
  useEffect(() => {
    if (codeSent && timer > 0) {
      const interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [codeSent, timer]);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoadingg(true);

    try {
      const response = await fetch(`${api}/users/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setCurrentStep("Verify");
        setCodeSent(true);
        setLoadingg(false);
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
        setLoadingg(false);
      }
    } catch (error) {
      setLoadingg(false);

      alert("خطایی در ارسال کد بازیابی رخ داد. لطفاً دوباره تلاش کنید.");
    }
  };

  // تایید کد وارد شده
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoadingg(true);

    try {
      const response = await fetch(`${api}/users/verify-reset-code`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, resetCode: verifyCode }),
      });

      if (response.ok) {
        setLoadingg(false);

        setCurrentStep("reset"); // به صفحه تغییر رمز عبور برو
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
        setLoadingg(false);
      }
    } catch (error) {
      alert("خطا در تایید کد. لطفاً دوباره تلاش کنید.");
      setLoadingg(false);
    }
  };

  // تغییر رمز عبور
  const handleSaveNewPassword = async (e) => {
    e.preventDefault();
    setLoadingg(true);

    if (password !== confirmPassword) {
      alert("رمز عبور و تکرار آن مطابقت ندارند.");
      setLoadingg(false);
      return;
    }

    try {
      const response = await fetch(`${api}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword: password }),
      });

      if (response.ok) {
        router.push("/Login"); // به صفحه ورود برگرد
        setCurrentStep("login");
        setLoadingg(false);
        alert("رمز عبور با موفقیت تغییر کرد.");
      } else {
        const errorMessage = await response.text();
        alert(errorMessage);
        setLoadingg(false);
      }
    } catch (error) {
      alert("خطایی در تغییر رمز عبور رخ داد. لطفاً دوباره تلاش کنید.");
      setLoadingg(false);
    }
  };

  const BackToChangeEmail = (e) => {
    e.preventDefault();
    setCurrentStep("forgot");
    setTimer(180);
  };

  useEffect(() => {
    const ID = localStorage.getItem("RoomSaraID");
    if (ID) {
      router.push(`/App`);
    } else {
      setLoading(false);
      setCurrentStep("login");
    }
  }, []);

  return (
    <main
      dir="rtl"
      className="main-home w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#000000] via-[#333333] to-[#005f73] p-4 md:p-6"
    >
      {/* Step 1: Login */}
      {currentStep === "login" && (
        <div className="flex flex-col w-full max-w-[500px] bg-[#333333] rounded-2xl shadow-xl overflow-hidden border border-[#CCCCCC]/20">
          <div className="bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0] p-8 md:p-6">
            <h1 className="text-center font-black text-4xl md:text-3xl text-white drop-shadow-md">
              ورود
            </h1>
          </div>

          <form className="flex flex-col gap-6 p-8 md:p-6 bg-[#000000]/30">
            <div className="space-y-4">
              <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                ایمیل
              </label>
              <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                     focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                     transition-all duration-200 placeholder:text-[#CCCCCC]/60"
                placeholder="example@domain.com"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                رمز عبور
              </label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                     focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                     transition-all duration-200 placeholder:text-[#CCCCCC]/60"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={sendInfo}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0]
                   text-white font-bold text-lg md:text-base rounded-xl
                   transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loadingg ? (
                <div className="flex items-center justify-center space-x-1 gap-2 py-1">
                  <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.3s] rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.15s] rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-white animate-bounce rounded-sm"></span>
                </div>
              ) : (
                "ورود به برنامه"
              )}
            </button>

            <div className="flex container gap-3 mt-4">
              <button
                onClick={() => setCurrentStep("forgot")}
                type="button"
                className="text-[#CCCCCC] ml-auto hover:text-[#ee9b00] text-sm font-medium text-center transition-colors"
              >
                بازیابی رمز عبور
              </button>

              <Link
                href="/SignIn"
                className="text-[#CCCCCC] hover:text-[#ee9b00] text-sm font-medium text-center transition-colors"
              >
                ایجاد حساب جدید
              </Link>
            </div>
          </form>
        </div>
      )}

      {/* Step 2: Forgot Password */}
      {currentStep === "forgot" && (
        <div className="flex flex-col w-full max-w-[500px] bg-[#333333] rounded-2xl shadow-xl overflow-hidden border border-[#CCCCCC]/20">
          <div className="bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0] p-8 md:p-6">
            <h1 className="text-center font-black text-4xl md:text-3xl text-white drop-shadow-md">
              بازیابی رمز عبور
            </h1>
          </div>

          <form className="flex flex-col gap-6 p-8 md:p-6 bg-[#000000]/30">
            <div className="space-y-4">
              <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                ایمیل
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                     focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                     transition-all duration-200 placeholder:text-[#CCCCCC]/60"
                placeholder="example@domain.com"
              />
            </div>

            <button
              onClick={handleSendCode}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0] 
                   text-white font-bold text-lg md:text-base rounded-xl
                   transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loadingg ? (
                <div className="flex items-center justify-center space-x-1 gap-2 py-1">
                  <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.3s] rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.15s] rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-white animate-bounce rounded-sm"></span>
                </div>
              ) : (
                "ارسال کد تایید"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Step 3: Verify Code */}
      {currentStep === "Verify" && (
        <div className="flex flex-col w-full max-w-[500px] bg-[#333333] rounded-2xl shadow-xl overflow-hidden border border-[#CCCCCC]/20">
          <div className="bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0] p-8 md:p-6">
            <h1 className="text-center font-black text-4xl md:text-3xl text-white drop-shadow-md">
              تایید هویت
            </h1>
          </div>

          <form className="flex flex-col gap-6 p-8 md:p-6 bg-[#000000]/30">
            <div className="space-y-4">
              <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                کد تایید
              </label>
              <input
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                     focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                     transition-all duration-200 placeholder:text-[#CCCCCC]/60 text-center"
                placeholder="- - - -"
                type="number"
              />
            </div>

            <button
              onClick={handleVerifyCode}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0]
                   text-white font-bold text-lg md:text-base rounded-xl
                   transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loadingg ? (
                <div className="flex items-center justify-center space-x-1 gap-2 py-1">
                  <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.3s] rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.15s] rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-white animate-bounce rounded-sm"></span>
                </div>
              ) : (
                "تایید کد"
              )}
            </button>

            <div className="flex flex-col items-center gap-3 mt-4">
              {codeSent && timer > 0 && (
                <p className="text-[#CCCCCC]/80 text-sm">
                  زمان باقی مانده: {timer} ثانیه
                </p>
              )}

              {codeSent && timer === 0 && (
                <button
                  onClick={handleSendCode}
                  type="button"
                  className="text-[#ee9b00] hover:text-[#ffaa00] text-sm font-medium transition-colors"
                >
                  {loadingg ? (
                    <div className="flex items-center justify-center space-x-1 gap-2 py-1">
                      <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.3s] rounded-sm"></span>
                      <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.15s] rounded-sm"></span>
                      <span className="w-1.5 h-4 bg-white animate-bounce rounded-sm"></span>
                    </div>
                  ) : (
                    "ارسال مجدد کد"
                  )}
                </button>
              )}

              <button
                onClick={BackToChangeEmail}
                type="button"
                className="text-[#CCCCCC] hover:text-[#ee9b00] text-sm font-medium transition-colors"
              >
                تغییر ایمیل
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 4: Reset Password */}
      {currentStep === "reset" && (
        <div className="flex flex-col w-full max-w-[500px] bg-[#333333] rounded-2xl shadow-xl overflow-hidden border border-[#CCCCCC]/20">
          <div className="bg-gradient-to-rfrom-[#005f73] to-[#3e5f9ce0] p-8 md:p-6">
            <h1 className="text-center font-black text-4xl md:text-3xl text-white drop-shadow-md">
              تنظیم مجدد رمز
            </h1>
          </div>

          <form className="flex flex-col gap-6 p-8 md:p-6 bg-[#000000]/30">
            <div className="space-y-4">
              <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                رمز عبور جدید
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                     focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                     transition-all duration-200 placeholder:text-[#CCCCCC]/60"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-4">
              <label className="block text-[#CCCCCC] text-lg md:text-base font-medium">
                تکرار رمز عبور
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#333333] border-2 border-[#CCCCCC]/20 text-[#CCCCCC] 
                     focus:outline-none focus:border-[#ee9b00] focus:ring-2 focus:ring-[#ee9b00]/30
                     transition-all duration-200 placeholder:text-[#CCCCCC]/60"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleSaveNewPassword}
              className="w-full py-3 px-6 bg-gradient-to-r from-[#005f73] to-[#3e5f9ce0] 
                   text-white font-bold text-lg md:text-base rounded-xl
                   transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              {loadingg ? (
                <div className="flex items-center justify-center space-x-1 gap-2 py-1">
                  <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.3s] rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-white animate-bounce [animation-delay:-0.15s] rounded-sm"></span>
                  <span className="w-1.5 h-4 bg-white animate-bounce rounded-sm"></span>
                </div>
              ) : (
                "به روز رسانی رمز عبور"
              )}
            </button>
          </form>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ee9b00] border-t-transparent"></div>
        </div>
      )}
    </main>
  );
}
