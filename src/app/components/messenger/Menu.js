import { useState } from "react";
import "./Menu.css";
import ChangePic from "../settings/ChangeProfile";
import ChangePassword from "../settings/ChangePass";
import Notif from "../settings/Notif";
import Logout from "../settings/Logout";
import Link from "next/link";
import Terms from "../settings/Terms";
export default function Menu_left_D({
  setSearchTerm,
  searchTerm,
  enterSearch,
  handleSearchUsers,
  suggest,
  setSuggest,
  handleSelectUser,
  users,
  showres,
  unreadMessages,
  setMenuitem,
  menuitem,
  showsetting,
  setShowsetting,
  me,
  userId,
  setMe,
  api,
  Auth,
  loading,
}) {
  const clickhandler = (e) => {
    e.preventDefault();
    setMenuitem(!menuitem); // تغییر وضعیت منو
  };

  const noneprofile = "/noneProfile.png";

  const [selectedUserId, setSelectedUserId] = useState(null); // ذخیره شناسه کاربر انتخاب‌شده
  const [currentSetting, setCurrentSetting] = useState("main");
  return (
    <div
      className={`left md:border-none md:rounded-none overflow-y-scroll overflow-x-hidden rounded-xl h-full md:w-[100%] md:mx-auto w-[30%] py-7 md:pb-[12rem] px-5 md:px-2 md:${
        (showres && "hidden") || ""
      }`}
    >
      {!showsetting && (
        <>
          <div
            dir="rtl"
            className="search px-5 md:px-3 py-4 md:py-3 md:rounded-3xl container gap-2 mx-auto md:ml-[1%]"
          >
            <button onClick={handleSearchUsers}>
              <img
                className="img_search rounded-full w-12 opacity-60"
                src="/Search.png"
                alt="png"
              />
            </button>
            <input
              className="search-input w-[100%] px-3 md:px-2 text-lg md:text-[16px] mx-auto container h-[2.5rem] rounded-xl opacity-90"
              type="text"
              value={searchTerm}
              onKeyDown={enterSearch}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="جست و جوی اعضا ..."
            />
            <img
              className="Show-menu-Items w-10 h-10 rounded-full cursor-pointer"
              src="/Menu.png"
              alt="png"
              onClick={clickhandler}
            />
          </div>
          {suggest[0] && (
            <div className="suggest gap-4 absolute z-10 container flex-col left-[12%] md:ml-[0%] w-[19rem] mx-auto py-4 px-2 rounded-xl ">
              <div className="container gap-2 w-[90%] mx-auto">
                <img
                  onClick={() => setSuggest([])}
                  className="w-8 rotate-180 ml-auto rounded-xl opacity-60 hover:opacity-95 transition-all cursor-pointer"
                  src="https://th.bing.com/th/id/OIP.AtMAbDgKLti8K279Cutr6AAAAA?w=474&h=474&rs=1&pid=ImgDetMain"
                  alt="png"
                />
                <div className="bg-gray-500 rounded-xl w-[85%] h-[2rem]"></div>
              </div>
              <div className="h-[34rem] overflow-y-scroll w-full">
                {suggest.map((user, index) => (
                  <div
                    className="chat_s"
                    key={index}
                    onClick={() => handleSelectUser(user)} // رویداد کلیک
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        // بررسی اگر کلید فشرده شده Enter بود
                        handleSelectUser(user); // انتخاب کاربر با Enter
                      }
                    }}
                    tabIndex={0} // برای اینکه المان قابل فوکوس باشد
                  >
                    <img
                      className="w-10 h-10 rounded-full"
                      src={
                        user.profile_image
                          ? `${api}/${user.profile_image}`
                          : noneprofile
                      }
                      alt="img"
                    />
                    <div className="info w-[70%] text-gray-200">
                      <h1 className="text-[20px]">{user.name}</h1>
                      <h3 className="text-[13px]">{user.email}</h3>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {users.map((user, index) => (
            <div
              className={`chat md:py-[5px] md:my-3 border-[#333333] md:px-[0px] md:w-[100%] md:ml-[1%] ${
                selectedUserId === user.id
                  ? "selected bg-[#9b9b9b8a] border-white"
                  : "text-gray-200 bg-[#47474759]"
              }`} // تغییر استایل بر اساس انتخاب
              key={index}
              onClick={() => {
                handleSelectUser(user);
                setSelectedUserId(user.id); // بروزرسانی شناسه کاربر انتخاب‌شده
              }}
            >
              {(user.id === me.id && (
                <img
                  className="img_search rounded-full w-14 h-14 md:w-[56.5px] md:h-[56.5px] opacity-70"
                  src="https://th.bing.com/th/id/OIP.-aRMQ8k-bVpKMPU0TxdtKAHaHa?rs=1&pid=ImgDetMain"
                  alt="profile"
                />
              )) || (
                <img
                  className="img_search rounded-full w-16 h-16 md:w-[56.5px] md:h-[56.5px] opacity-70"
                  src={
                    user.profile_image
                      ? `${api}/${user.profile_image}`
                      : noneprofile
                  }
                  alt="profile"
                  // دیگر ویژگی‌ها
                />
              )}

              <div className="info w-[70%]">
                <h1 className="text-[24px] md:text-[17.5px]">
                  {user.id === me.id ? "پیام‌های ذخیره شده" : user.name}
                </h1>
              </div>

              {user &&
                unreadMessages &&
                (unreadMessages[user?.id] || 0) > 0 && (
                  <span className="unread-badge container mr-4 md:opacity-90">
                    {unreadMessages[user?.id] || 0}
                  </span>
                )}
            </div>
          ))}
        </>
      )}

      {showsetting && (
        <div className="setting-container">
          {/* بخش بالایی */}

          {(() => {
            switch (currentSetting) {
              case "main":
                return (
                  <>
                    <div className="top-setting ">
                      <img
                        onClick={() => setShowsetting(false)}
                        className="w-8 mt-4 ml-5 rotate-180 mr-auto rounded-xl opacity-60 hover:opacity-95 transition-all cursor-pointer"
                        src="/BackArrow.png"
                        alt="png"
                      />
                      <div className="profile-section">
                        <img
                          src={
                            me.profile_image
                              ? `${api}/${me.profile_image}`
                              : noneprofile
                          } // بررسی وجود پروفایل
                          alt="Profile"
                          className="profile-image w-[42%] md:w-38"
                        />

                        <div className="profile-info">
                          <h2 className="profile-name">{me.name}</h2>
                        </div>
                      </div>
                    </div>

                    {/* بخش اطلاعات و تنظیمات */}
                    <div dir="rtl" className="info-setting">
                      <ul className="settings-list">
                        {/* آیتم تغییر پروفایل */}
                        <li
                          onClick={() => setCurrentSetting("changepic")}
                          className="settings-item"
                        >
                          <img
                            src="/user.png"
                            className="w-6 mx-3 filter invert "
                            alt="set"
                          />{" "}
                          {/* آیکون پروفایل */}
                          <span>تغییر پروفایل</span>
                        </li>

                        {/* آیتم امنیت و حریم خصوصی */}
                        <li
                          onClick={() => setCurrentSetting("changePass")}
                          className="settings-item"
                        >
                          <img
                            src="/security.png"
                            className="w-6 mx-3 filter invert "
                            alt="set"
                          />{" "}
                          {/* آیکون امنیت */}
                          <span>امنیت و حریم خصوصی</span>
                        </li>

                        {/* آیتم شرایط و قوانین */}
                        <li
                          onClick={() => setCurrentSetting("terms")} // اضافه کردن state جدید برای شرایط و قوانین
                          className="settings-item"
                        >
                          <img
                            src="/document.png"
                            className="w-6 mx-3 filter invert "
                            alt="set"
                          />{" "}
                          {/* آیکون شرایط و قوانین */}
                          <span>شرایط و قوانین</span>
                        </li>

                        {/* آیتم درباره ما */}
                        <Link href="/" className="settings-item">
                          <img
                            src="/info.png"
                            className="w-6 mx-3 filter invert "
                            alt="set"
                          />
                          {/* آیکون اطلاعات (مناسب برای درباره ما) */}
                          <span>درباره مـا</span>
                        </Link>

                        {/* آیتم خروج */}
                        <li
                          onClick={() => setCurrentSetting("logout")}
                          className="settings-item"
                        >
                          <img
                            src="/exit.png"
                            className="w-6 mx-3 filter invert "
                            alt="set"
                          />{" "}
                          {/* آیکون خروج */}
                          <span>خارج شدن</span>
                        </li>
                      </ul>
                      <span className="text-[13px] text-gray-500 mx-auto text-center container items-center mt-3">
                        روم ســرا. نسخه دمو 2025
                      </span>
                    </div>
                  </>
                );

              case "changepic":
                return (
                  <ChangePic
                    userId={userId}
                    setCurrentSetting={setCurrentSetting}
                    setMe={setMe}
                    me={me}
                    api={api}
                    Auth={Auth}
                  />
                );

              case "changePass":
                return (
                  <ChangePassword
                    userId={userId}
                    setCurrentSetting={setCurrentSetting}
                    api={api}
                    Auth={Auth}
                  />
                );

              case "notif":
                return (
                  <Notif api={api} setCurrentSetting={setCurrentSetting} />
                );

              case "logout":
                return (
                  <Logout
                    userId={userId}
                    setCurrentSetting={setCurrentSetting}
                  />
                );

              case "terms":
                return <Terms setCurrentSetting={setCurrentSetting} />;

              default:
                return null;
            }
          })()}
        </div>
      )}

      {loading && users.length === 0 && (
        <div className="fixed mt-20 inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ee9b00] border-t-transparent"></div>
        </div>
      )}
    </div>
  );
}
