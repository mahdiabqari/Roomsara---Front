import React, { useState } from "react";
import "./setting.css";

export default function Notif({ setCurrentSetting }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [previewEnabled, setPreviewEnabled] = useState(true);

  const toggleOption = (setter) => setter((prev) => !prev);

  return (
    <div
      dir="rtl"
      className="text-white rounded-xl w-[95%] h-[95%] p-4 shadow-lg fixed top-5 left-5 z-50"
    >
      <img
        onClick={() => setCurrentSetting("main")}
        className="w-8 rotate-180 mr-auto rounded-xl opacity-60 hover:opacity-95 transition-all cursor-pointer"
        src="/BackArrow.png"
        alt="png"
      />
      <h2 className="mt-7">تنظیمات اعلان‌ها</h2>
      <ul className="notif-settings-list">
        <li
          className={`notif-item ${
            notificationsEnabled ? "enabled" : "disabled"
          }`}
          onClick={() => toggleOption(setNotificationsEnabled)}
        >
          <span>فعال‌سازی اعلان‌ها</span>
          <div className={`toggle ${notificationsEnabled ? "on" : "off"}`}>
            <div className="toggle-circle"></div>
          </div>
        </li>
        <li
          className={`notif-item ${soundEnabled ? "enabled" : "disabled"}`}
          onClick={() => toggleOption(setSoundEnabled)}
        >
          <span>صدای اعلان‌ها</span>
          <div className={`toggle ${soundEnabled ? "on" : "off"}`}>
            <div className="toggle-circle"></div>
          </div>
        </li>
        <li
          className={`notif-item ${previewEnabled ? "enabled" : "disabled"}`}
          onClick={() => toggleOption(setPreviewEnabled)}
        >
          <span>نمایش پیش‌نمایش پیام‌ها</span>
          <div className={`toggle ${previewEnabled ? "on" : "off"}`}>
            <div className="toggle-circle"></div>
          </div>
        </li>
      </ul>
    </div>
  );
}
