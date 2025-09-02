import { useEffect, useState, useRef } from "react";
import "./Home.css";
import EmojiPicker from "emoji-picker-react"; // اضافه کردن پکیج ایموجی
import moment from "moment-jalaali";

export default function ChatPage({
  selectShow,
  setSelectShow,
  selectedUserInfo,
  messages,
  handleScrollToMessage,
  userId,
  handleRightClick,
  replyingTo,
  setReplyingTo,
  newMessage,
  setNewMessage,
  handleSendMessage,
  showres,
  setShowres,
  me,
  api,
  isloadingMs,
  setSelectedUser,
  setShowprofile,
  setIsJoinModalOpen,
  setIsCreateModalOpen,
  HandleNavigateToRoom,
  handleCreateRoom,
  roomName,
  setRoomName,
  roomJoinName,
  setRoomJoinName,
  isLoadingMore,
}) {
  const inputRef = useRef(null);
  const [inputHeight, setInputHeight] = useState("4.25rem"); // ارتفاع اولیه
  const [showEmojiPicker, setShowEmojiPicker] = useState(false); // نمایش ایموجی پیکر
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => setIsMobile(window.innerWidth <= 768); // کمتر از md
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const handleInputChange = (e) => {
    setNewMessage(e.target.value);

    // تغییر ارتفاع اینپوت بر اساس محتوا
    inputRef.current.style.height = "auto"; // ریست کردن ارتفاع
    const newHeight = Math.min(inputRef.current.scrollHeight, 80); // محدود به 120px (حدود 5 خط)
    inputRef.current.style.height = `${newHeight}px`;
    setInputHeight(`${newHeight}px`);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // از پیش‌فرض Enter جلوگیری می‌کند
      handleSendMessage();
    }
  };

  const handleEmojiClick = (emojiData) => {
    setNewMessage((prev) => prev + emojiData.emoji);
  };
  const noneprofile = "/noneProfile.png";

  //// پردازش لینک در پیام هـــــــــــــــــــــــــا
  const isLink = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return urlPattern.test(text);
  };

  const parseMessage = (text) => {
    const urlPattern = /(https?:\/\/[^\s]+)/g;
    return text.split(urlPattern).map((part, index) => {
      if (urlPattern.test(part)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-600 transition-all break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const GetBackMD = () => {
    setShowres(false);
    setSelectShow(false);
    setSelectedUser("");
  };

  const formatMessageDate = (timestamp) => {
    const now = moment();
    const messageDate = moment(timestamp);

    if (messageDate.isSame(now, "day")) {
      return "امروز";
    }
    if (messageDate.isSame(now.clone().subtract(1, "day"), "day")) {
      return "دیروز";
    }
    if (messageDate.isAfter(now.startOf("week"))) {
      return messageDate.format("dddd");
    }
    return messageDate.format("jYYYY/jMM/jDD");
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest(".sendM")) {
      setShowEmojiPicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      {selectShow && (
        <div className="top-chat-page z-20 fixed top-2 w-[65.6%] md:w-full md:right-0 md:top-0 right-[38px] md:w-[100%] md:mx-auto fixed rounded-lg flex justify-center items-center text-gray-200 text-center py-2 text-3xl h-[5rem] md:h-[4.5rem] md:bg-[#273244] md:border-none">
          <img
            onClick={GetBackMD}
            className="w-12 h-12 ml-4 md:hidden rounded-full rotate-180 mr-auto hover:translate-x-[-2px] cursor-pointer transition-all transition-[0.5s]"
            src="/BackArrow.png"
            alt="send"
          />
          <img
            onClick={GetBackMD}
            className="w-8 h-8 ml-4 rounded-full hidden md:flex rotate-180 mr-auto hover:translate-x-[-2px] cursor-pointer transition-all transition-[0.5s]"
            src="/BackArrow.png"
            alt="send"
          />
          <div className="flex justify-center text-[#cccccc] flex-col mr-4">
            <h1
              className={`text-[28px] md:text-[17px] ${
                selectedUserInfo.id !== me.id && ""
              }`}
            >
              {(selectedUserInfo.id === me.id && "پیام های ذخیره شده") ||
                selectedUserInfo.name}
            </h1>
          </div>
          {(selectedUserInfo.id === me.id && (
            <img
              className=" mr-7 rounded-full w-16 h-16 opacity-60 md:w-14 md:h-14"
              src="/SavedMessage.png"
              alt="profile"
            />
          )) || (
            <button>
              <img
                onClick={() => setShowprofile(true)}
                className=" mr-7 imgimg md:opacity-100 rounded-full cursor-pointer w-16 h-16 opacity-60 md:w-14 md:h-14"
                src={
                  selectedUserInfo.profile_image
                    ? `${api}/${selectedUserInfo.profile_image}`
                    : noneprofile
                }
                alt="profile"
              />
            </button>
          )}
        </div>
      )}
      {showres && (
        <div
          className={`right md:border-none md:rounded-none rounded-xl h-full overflow-y-scroll overflow-x-hidden md:pb-8 md:pr-1 w-[70%] md:w-full`}
          id="chat-container"
          style={{
            display: "flex",
            flexDirection: "column-reverse", // پیام‌ها از پایین به بالا نمایش داده شوند
            overflowY: "auto",
            height: "100%", // یا ارتفاع مورد نظر
          }}
        >
          {/*صفحه چت*/}
          {selectShow && (
            <div className="md:relative md:w-full gap-2 md:gap-1 z-10 flex flex-col px-5 md:px-2 md:pr-0 pt-[4.5rem] w-[95%] md:w-[97%] md:h-max-content mx-auto rounded-xl pb-[6.5rem] md:pb-[5rem]">
              {isLoadingMore && (
                <div className="sticky top-0 z-20 flex justify-center">
                  <div className="mt-2 mb-1 inline-flex items-center gap-2 rounded-full bg-neutral-800/70 px-3 py-1 backdrop-blur">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white/70 border-t-transparent" />
                  </div>
                </div>
              )}

              {messages.reduce((acc, msg, index) => {
                // محاسبه تاریخ پیام فعلی
                const currentDate = moment(msg.timestamp).startOf("day");
                // تاریخ پیام قبلی
                const prevDate =
                  index > 0 && messages[index - 1]?.timestamp
                    ? moment(messages[index - 1].timestamp).startOf("day")
                    : null;

                // اگر تاریخ تغییر کرد جداکننده اضافه کن
                if (!prevDate || !currentDate.isSame(prevDate)) {
                  acc.push(
                    <div
                      key={`date-${currentDate.format("YYYY-MM-DD")}`}
                      className="date-separator my-4 flex items-center gap-3"
                    >
                      <div className="flex-1 border-t border-gray-400/30"></div>
                      <span className="text-gray-400 text-sm font-medium">
                        {formatMessageDate(msg.timestamp)}
                      </span>
                      <div className="flex-1 border-t border-gray-400/30"></div>
                    </div>
                  );
                }

                // اضافه کردن پیام
                acc.push(
                  <div
                    key={msg.id}
                    id={`message-${msg.id}`}
                    className={`message relative ${
                      msg.sender_id === userId
                        ? "send-message break-all"
                        : "receive-message break-all"
                    }`}
                  >
                    {/* ریپلای */}
                    {msg.reply_to && (
                      <div
                        className={`reply-preview md:w-[40%] md:text-[14px] ${
                          msg.sender_id === userId
                            ? "reply-right"
                            : "reply-left"
                        }`}
                        onClick={() => handleScrollToMessage(msg.reply_to)}
                        style={{ cursor: "pointer" }}
                      >
                        Replying to:
                        {msg.reply_to_text || "این پیام حذف شده است"}
                      </div>
                    )}

                    {/* متن پیام */}
                    <section
                      dir="rtl"
                      className={`${
                        msg.sender_id === userId
                          ? "send-m flex md:text-[16px] text-right"
                          : "receive-m md:text-[16px] text-left"
                      }`}
                      style={{
                        display: "inline-block",
                        position: "relative",
                        userSelect: "none",
                      }}
                      onContextMenu={(e) => handleRightClick(e, msg)}
                    >
                      <div className="flex justify-center items-end gap-2">
                        {msg.sender_id !== userId ? (
                          <>
                            <h1 className="break-all">
                              {isLink(msg.message)
                                ? parseMessage(msg.message)
                                : msg.message}
                            </h1>
                            <h1 className="text-[13px] whitespace-nowrap md:text-[12px]">
                              {moment(msg.timestamp).format("HH:mm")}
                            </h1>
                          </>
                        ) : (
                          <>
                            <h1 className="text-[13px] whitespace-nowrap md:text-[12px] text-[#cccccc]">
                              {moment(msg.timestamp).format("HH:mm")}
                            </h1>
                            <h1 className="break-all">
                              {isLink(msg.message)
                                ? parseMessage(msg.message)
                                : msg.message}
                            </h1>
                          </>
                        )}
                      </div>
                    </section>
                  </div>
                );

                return acc;
              }, [])}

              {isloadingMs && (
                <div className="fixed mt-20 md:mt-18 inset-0 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#ee9b00] border-t-transparent"></div>
                </div>
              )}

              {!messages[0] && !isloadingMs && (
                <h1
                  dir="rtl"
                  className="text-center text-slate-100/80 text-lg font-medium 
        mb-[15rem] md:mb-[20rem] md:text-sm"
                >
                  پیامی وجود ندارد ...
                </h1>
              )}
            </div>
          )}

          {!selectShow && (
            <div
              dir="rtl"
              className="flex flex-col items-center md:relative md:bottom-[5rem] md:left-[1%] py-10 px-5 md:px-4"
            >
              {/* بخش هدر */}
              <div className="relative bg-start-card group w-full py-6 px-10 md:px-4 rounded-xl overflow-hidden md:w-full md:mx-auto transform transition-all duration-500">
                {/* لایه پس‌زمینه با افکت بلور و تغییر شفافیت در حالت هاور */}
                <div className="absolute bg-start-card opacity-70 group-hover:opacity-50 transition-all duration-500"></div>

                <div className="relative z-10">
                  <h1 className="text-4xl md:text-2xl font-extrabold text-[#CCCCCC] drop-shadow-xl text-right md:text-center md:max-w-md md:mx-auto">
                    ساختن اتاق
                  </h1>
                  <p className="mt-3 text-xl md:text-base text-[#CCCCCC] drop-shadow md:text-center md:max-w-md md:mx-auto">
                    اتاق خود را بسازید یا به یک اتاق موجود بپیوندید!
                  </p>
                </div>
              </div>
              {/* محتوای اصلی */}
              <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:flex md:flex-col gap-6 md:gap-8">
                <div className="w-full max-w-6xl mt-8 grid grid-cols-1 md:flex md:flex-col gap-6 md:gap-8">
                  {/* بخش تبلیغات */}
                  <div className="bg-[#CCCCCC] flex md:hidden shadow-lg rounded-lg md:rounded-xl p-5 md:p-6 flex flex-col items-center justify-center">
                    <h2 className="text-xl md:text-lg font-semibold text-[#000000] mb-4 md:mb-3 text-center">
                      تبلیغات
                    </h2>
                    <p className="text-sm md:text-sm text-[#ee9b00] text-center">
                      برند یا رویداد خود را در اینجا تبلیغ کنید. روزانه به چندین
                      کاربر دسترسی پیدا کنید!
                    </p>
                    <button className="bg-[#ee9b00] text-white md:text-base mt-5 px-6 py-2 md:px-6 md:py-2 rounded-lg md:rounded-lg hover:bg-[#005f73] transition touch-manipulation">
                      اطلاعات بیشتر
                    </button>
                  </div>

                  {/* بخش میانی */}
                  <div className="flex md:flex-col justify-center items-center w-full gap-10 md:gap-8">
                    {/* دکمه‌ها یا فرم‌ها بسته به دستگاه */}
                    <div className="w-[45%] md:w-full md:flex md:flex-col md:gap-6">
                      {/* نسخه دسکتاپ: فرم ساخت اتاق */}
                      <div className="bg-start-card shadow-join-card animation-fade-in-up w-full h-full shadow-2xl rounded-2xl p-8 md:hidden flex flex-col items-center transition-all duration-300 transform hover:-translate-y-1">
                        <h2 className="text-3xl font-bold text-[#CCCCCC] mb-8 tracking-wide text-center">
                          ساخت اتاق
                        </h2>
                        <form
                          className="flex flex-col items-center w-full gap-6"
                          onSubmit={handleCreateRoom}
                        >
                          <input
                            type="text"
                            placeholder="نام اتاق را وارد کنید"
                            value={roomName}
                            onChange={(e) => setRoomName(e.target.value)}
                            className="w-full border-0 bg-[#333333]/90 text-[#c3c3c3] text-lg px-6 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#005f73]/50 placeholder-[#CCCCCC]/70 shadow-inner transition-all duration-200"
                          />
                          <button
                            type="submit"
                            role="button"
                            className=" button-86"
                          >
                            ساخت اتاق
                            <img
                              src="/add.png"
                              alt="home"
                              className="w-7 h-7 mr-2 transition-transform hover:scale-110 filter invert"
                            />
                          </button>
                        </form>
                      </div>

                      {/* نسخه موبایل: دکمه ساخت اتاق */}
                      <button
                        className="hidden rs-modal-btn md:flex rs-create-btn bg-start-card shadow-join-card w-full h-full shadow-2xl rounded-xl p-6 items-center justify-center gap-4 text-[#CCCCCC] text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#ee9b00]/90"
                        onClick={() => setIsCreateModalOpen(true)}
                      >
                        ساخت اتاق جدید
                        <img
                          src="/add.png"
                          alt="home"
                          className="w-7 h-7  transition-transform hover:scale-110 filter invert"
                        />
                      </button>
                    </div>

                    <div className="w-[45%] md:w-full md:flex md:flex-col md:gap-6">
                      {/* نسخه دسکتاپ: فرم پیوستن به اتاق */}
                      <div className="bg-start-card shadow-join-card animation-fade-in-up w-full h-full shadow-2xl rounded-2xl p-8 md:hidden flex flex-col items-center transition-all duration-300 transform hover:-translate-y-1">
                        <h2 className="text-3xl font-bold text-[#CCCCCC] mb-8 tracking-wide text-center">
                          به اتاق دیگران بپیوندید
                        </h2>
                        <form
                          className="flex flex-col items-center w-full gap-6"
                          onSubmit={HandleNavigateToRoom}
                        >
                          <input
                            type="text"
                            placeholder="لینک اتاق را وارد کنید"
                            value={roomJoinName}
                            onChange={(e) => setRoomJoinName(e.target.value)}
                            className="w-full border-0 bg-[#333333]/90 text-[#CCCCCC] text-lg px-6 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#005f73]/50 placeholder-[#CCCCCC]/70 shadow-inner transition-all duration-200"
                          />
                          <button
                            type="submit"
                            role="button"
                            className=" button-86"
                          >
                            پیوستن به اتاق
                            <img
                              src="/join.png"
                              alt="home"
                              className="w-7 h-7 mr-2 transition-transform hover:scale-110 filter invert"
                            />
                          </button>
                        </form>
                      </div>

                      {/* نسخه موبایل: دکمه پیوستن به اتاق */}
                      <button
                        className="hidden  rs-modal-btn md:flex rs-join-btn bg-start-card shadow-join-card w-full h-full shadow-2xl rounded-xl p-6 items-center justify-center gap-4 text-[#CCCCCC] text-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:bg-[#ee9b00]/90"
                        onClick={() => setIsJoinModalOpen(true)}
                      >
                        پیوستن به اتاق
                        <img
                          src="/join.png"
                          alt="home"
                          className="w-7 h-7 mr-2 transition-transform hover:scale-110 filter invert"
                        />
                      </button>
                    </div>
                  </div>

                  {/* بخش تبلیغات */}
                  <div className="bg-[#CCCCCC] hidden md:flex animation-right-to-left shadow-lg rounded-xl p-6 flex flex-col items-center justify-center">
                    <h2 className="text-lg font-semibold text-[#000000] mb-3 text-center">
                      تبلیغات
                    </h2>
                    <p className="text-sm text-[#ee9b00] text-center">
                      برند یا رویداد خود را در اینجا تبلیغ کنید. روزانه به چندین
                      کاربر دسترسی پیدا کنید!
                    </p>
                    <button className="bg-[#ee9b00] text-white text-base mt-5 px-6 py-2 rounded-lg hover:bg-[#005f73] transition touch-manipulation">
                      اطلاعات بیشتر
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      {selectShow && (
        <div
          dir="rtl"
          className="z-20 fixed bottom-2 w-[65.6%] md:w-full md:right-0 md:bottom-0 right-[38px]"
        >
          {/* نمایش ریپلای‌شده */}
          {replyingTo && replyingTo.message && (
            <div className="replying-to bottom-to-top-animattion border-l-4 md:rounded-2xl md:h-[2.5rem] md:top-0 border-blue-400 px-3 relative top-10 py-2  h-[5rem] w-[70%] mx-auto rounded-xl flex justify-between">
              <div className="flex gap-4">
                <span className="text-sm md:text-[12px] text-blue-300 font-semibold">
                  پـاسـخ بــه :
                </span>
                <p className="text-white text-sm font-medium md:text-[12px]">
                  {replyingTo.message.length > 20
                    ? `${replyingTo.message.slice(0, 20)}...`
                    : replyingTo.message}
                </p>
              </div>
              <button
                className="text-xl md:text-xs mb-10 md:m-0"
                onClick={() => setReplyingTo(null)}
              >
                ❌
              </button>
            </div>
          )}

          <div className="sendM flex flex-col md:rounded-t-[0px] min-h-24 md:bg-transparent md:backdrop-filter-none md:border-t-0 md:shadow-none md:min-h-24 h-auto md:h-[4.5rem] gap-2 container z-800 bottom-0 w-full shadow-xl p-2 backdrop-blur-md transition-all duration-300">
            {/* اینپوت پیام */}
            <div className="flex justify-center items-center w-full gap-2 md:w-[97%] md:mt-2 relative">
              {/* دکمه ایموجی */}
              <button
                className="absolute left-16 bottom-3 text-2xl md:left-5 transition-transform duration-300 hover:scale-110 active:scale-95"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              >
                <img
                  className="w-7 h-7 filter invert rounded-full hover:drop-shadow-lg"
                  src="/happy-face.png"
                  alt="emoji"
                />
              </button>

              {/* پیکر اموجی */}
              {showEmojiPicker && (
                <div className="high absolute bottom-14 left-10 md:bottom-16 md:left-[0px] animate-slide-up backdrop-blur-lg bg-[#273244]/90 rounded-xl shadow-2xl border border-white/10">
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    searchDisabled={true}
                    {...(isMobile === true ? { width: 280, height: 350 } : {})}
                  />
                </div>
              )}

              {/* تکست اریا */}
              <textarea
                ref={inputRef}
                className="w-[90%] md:w-[96%] min-h-[2.75rem] md:text-[15px] md:pl-8 max-h-[7rem] overflow-y-scroll rounded-xl md:pr-[3.75rem] pr-[5rem] md:rounded-xl text-lg px-4 py-2 border-0 bg-[#273244] text-white shadow-inner placeholder-gray-500 transition-all resize-none overflow-hidden outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:shadow-lg"
                value={newMessage}
                onKeyDown={handleKeyPress}
                onChange={handleInputChange}
                spellCheck="true"
                placeholder="پیام خود را بنویسید ..."
                style={{ height: inputHeight }}
              />

              {/* دکمه ارسال */}
              <button
                className="flex items-center absolute right-16 justify-center w-[3rem] h-[3rem] md:rounded-full md:right-4 bg-blue-600 hover:bg-blue-700 hover:shadow-[0_0_15px_rgba(59,130,246,0.7)] md:bg-[#333333] hover:md:bg-black text-white rounded-full shadow-md transition-all duration-300 transform hover:scale-110 active:scale-95"
                onClick={handleSendMessage}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 2L11 13" />
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
