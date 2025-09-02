import React from "react";
import "./setting.css";

export default function Logout({ setCurrentSetting, userId }) {
  const LogOut = (e) => {
    e.preventDefault();
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="bg-gradient-to-br from-gray-900 mt-[-20px] absolute mx-auto left-0 top-5 h-[100%] to-gray-800 w-full text-white rounded-xl p-4 shadow-lg z-50 flex flex-col items-center">
      <h2 className="text-[16px] mb-6 mt-[18rem] md:text-[16px]">
        آیا می خواهید از حساب خود خارج شوید؟
      </h2>
      <div className="flex space-x-4">
        <button onClick={LogOut} className="btn_tow px-6">
          خروج
        </button>
        <button
          onClick={() => setCurrentSetting("main")}
          className="btn_one px-6 py-2"
        >
          انصراف
        </button>
      </div>
    </div>
  );
}
