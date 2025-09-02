import React, { useState } from "react";
import "./setting.css";

const ChangePassword = ({ setCurrentSetting, userId, api, Auth }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // بررسی تطابق رمز عبور جدید و تکرار آن
    if (newPassword !== confirmPassword) {
      setError("رمز عبور جدید و تکرار آن یکسان نیست!");
      return;
    }
    try {
      // ارسال اطلاعات به سرور
      const response = await fetch(`${api}/users/secret/ChangePassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${Auth}`,
        },
        body: JSON.stringify({
          userId: userId, // مقدار userId واقعی را اینجا جایگزین کنید
          currentPassword,
          newPassword,
        }),
      });

      // مدیریت پاسخ سرور
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "مشکلی پیش آمده است.");
        return;
      }

      // موفقیت‌آمیز بودن تغییر رمز عبور
      setSuccess(true);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      setError("مشکلی در ارتباط با سرور پیش آمده است!");
    }
  };

  return (
    <div
      dir="rtl"
      className="text-white rounded-xl w-[100%] h-[100%] px-5 py-4 shadow-lg z-50 flex flex-col items-center"
    >
      <img
        onClick={() => setCurrentSetting("main")}
        className="w-8 rotate-180 mb-4 mr-auto rounded-xl opacity-60 hover:opacity-95 transition-all cursor-pointer"
        src="/BackArrow.png"
        alt="back"
      />
      <h2 className="text-xl text-black bg-gray-200 py-1 rounded-2xl font-semibold text-center w-full mt-7">
        تغییر رمز عبور
      </h2>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md flex flex-col items-center gap-4"
      >
        <div className="w-full">
          <label className="block mb-1 text-sm mr-2 mt-3">رمز عبور فعلی</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="رمز عبور فعلی را وارد کنید"
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-950"
          />
        </div>
        <div className="w-full">
          <label className="block mb-1 text-sm mr-2 mt-3">رمز عبور جدید</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="رمز عبور جدید را وارد کنید"
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-950"
          />
        </div>
        <div className="w-full">
          <label className="block mb-1 text-sm mr-2 mt-3">
            تکرار رمز عبور جدید
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="تکرار رمز عبور جدید"
            required
            className="w-full p-3 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-950"
          />
        </div>
        <button type="submit" className="btn_one w-full py-2 mt-4">
          ذخیره تغییرات
        </button>
        {error && (
          <div className="w-full mt-14 font-bold animation-res text-red-500 text-sm text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="w-full mt-14 font-bold animation-res text-green-500 text-sm text-center">
            رمز عبور با موفقیت تغییر کرد!
          </div>
        )}
      </form>
    </div>
  );
};

export default ChangePassword;
