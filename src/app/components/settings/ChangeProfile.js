import React, { useState } from "react";
import "./setting.css";

const ChangePic = ({ setCurrentSetting, userId, setMe, me, api, Auth }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagepreview, setImagepreview] = useState(null);
  const [username, setUsername] = useState("");
  const [err, setErr] = useState("");
  const [sucsess, setSucsess] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file); // ذخیره خود فایل (نه URL)
      setImagepreview(URL.createObjectURL(file)); // ذخیره URL موقتی برای پیش‌نمایش تصویر
    }
  };

  const handleSaveProfilePic = async () => {
    if (!selectedImage) {
      setErr("لطفا یک تصویر انتخاب کنید!");
      return;
    }

    const formData = new FormData();
    formData.append("profilePic", selectedImage); // ارسال خود فایل (نه URL)
    formData.append("userId", userId); // ارسال userId در کنار فایل

    try {
      const response = await fetch(`${api}/users/secret/upload-profile`, {
        method: "POST",
        headers: {
          Authorization: `${Auth}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMe({ ...me, profile_image: selectedImage });
        setSucsess("تصویر پروفایل با موفقیت تغییر پیدا کرد");
      } else {
        setErr("مشکلی پیش آمد لطفا دوباره تلاش کنید !");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setErr("مشکلی پیش آمد لطفا دوباره تلاش کنید !");
    }
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      setErr("لطفاً یک نام کاربری وارد کنید.");
      return;
    }

    // ارسال نام کاربری جدید به سرور
    const response = await fetch(`${api}/users/secret/ChangeUserName`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json", // تعیین هدر برای ارسال JSON
        Authorization: `${Auth}`,
      },
      body: JSON.stringify({
        userId: userId,
        NewUserName: username,
      }), // داده‌ها به صورت رشته JSON ارسال می‌شوند
    });

    if (response.ok) {
      setSucsess("نام کاربری با موفقیت تغییر کرد!");
      setMe({ ...me, name: username });
    }
  };

  return (
    <div
      dir="rtl"
      className="text-white rounded-xl w-[100%] h-[100%] px-5 py-4 shadow-lg z-50 flex flex-col items-center"
    >
      <img
        onClick={() => setCurrentSetting("main")}
        className="w-8 rotate-180 mb-4 rounded-xl opacity-60 mr-auto hover:opacity-95 transition-all cursor-pointer"
        src="/BackArrow.png"
        alt="back"
      />
      {/* بخش تغییر تصویر پروفایل */}
      <div className="w-full border-b-black border-b-2 border-t-black border-t-2 py-8">
        <h2 className="text-xl text-black bg-gray-200 py-1 rounded-2xl font-semibold text-center">
          تغییر تصویر پروفایل
        </h2>
        <div className="flex justify-center gap-7 md:gap-2 items-center">
          <div className="w-40 h-40 rounded-[50px] overflow-hidden bg-gray-700 flex items-center justify-center mb-4 border-4 border-blue-950">
            {imagepreview ? (
              <img
                src={imagepreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-sm text-gray-400">تصویری انتخاب نشده</div>
            )}
          </div>
          <div className="flex flex-col items-center justify-center gap-7 w-[48%]">
            <label
              htmlFor="image-upload"
              className="btn_one w-[90%] py-2 flex justify-center rounded-full cursor-pointer transition-all"
            >
              انتخاب تصویر
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            <button
              className="btn_tow w-[90%] py-2 flex justify-center rounded-full transition-all"
              onClick={handleSaveProfilePic}
            >
              ذخیره تصویر
            </button>
          </div>
        </div>
      </div>
      {/* بخش تغییر نام کاربری */}
      <div className="w-full border-b-black border-b-2 py-8">
        <h2 className="text-xl text-black bg-gray-200 py-1 rounded-2xl font-semibold text-center">
          تغییر نام کاربری
        </h2>
        <div dir="rtl" className="flex justify-center gap-2 items-center">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="نام کاربری جدید را وارد کنید"
            className="w-[70%] bg-gray-700 text-white py-2 text-lg md:text-[15px] px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            className=" py-2 px-6 rounded-full btn_one"
            onClick={handleSaveUsername}
          >
            ذخیره
          </button>
        </div>
      </div>
      {err && (
        <h2 className="text-red-900 text-center mt-14 mx-auto text-sm font-bold animation-res">
          {err}
        </h2>
      )}
      {sucsess && (
        <h2 className="text-green-500 text-center mt-14 mx-auto text-sm font-bold animation-res">
          {sucsess}
        </h2>
      )}
    </div>
  );
};

export default ChangePic;
