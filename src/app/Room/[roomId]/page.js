"use client";
import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import "./room.css";
import { io } from "socket.io-client";
import AudioCall from "@/app/components/peermaneger/AudioCall";
import { motion, AnimatePresence } from "framer-motion";
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import SocketIOFileUpload from "socket.io-file-client";

const socket = io("", {
  auth: {
    token: localStorage.getItem("AuthorizationRoomSara"),
  },
});
const uploader = new SocketIOFileUpload(socket);

export default function Room({ params }) {
  const roomId = params.roomId;
  const [roomInfo, setRoomInfo] = useState(null);
  const [userId, setUserId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("RoomSaraID") || "";
    }
    return "";
  });
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [me, setMe] = useState();
  const [addUser, setAddUser] = useState(false);
  const [loading, setLoading] = useState(true);
  const [signIn, setSignIn] = useState(false);
  const [isKicked, setIsKicked] = useState(false);
  const [showLink, setShowLink] = useState(true);
  const [progress, setProgress] = useState(0);
  const [progressE, setProgressE] = useState(0);
  const [AlretRes, setAlretRes] = useState(false);
  const [showChatMD, setShowChatMD] = useState(false);
  const [err, setErr] = useState();
  const [Auth, setAuth] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("AuthorizationRoomSara") || "";
    }
    return "";
  });
  const [showError, setShowError] = useState(true);
  const [image, setImage] = useState("");
  const api = "";
  const inviteLink = `https://roomsara.liara.run/Room/${roomId}`;
  const noneprofile = "/noneProfile.png";
  const [peerConncet, setPeerConnect] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [mutedUsers, setMutedUsers] = useState({}); // وضعیت میوت کاربرا

  // مدیریت میوت/آن‌میوت
  useEffect(() => {
    socket.on("userMuted", ({ userId, isMuted }) => {
      setMutedUsers((prev) => ({ ...prev, [userId]: isMuted }));
    });

    socket.on("muteStatus", ({ userId, isMuted }) => {
      setMutedUsers((prev) => ({ ...prev, [userId]: isMuted }));
    });

    socket.on("error", ({ message }) => {
      setErr({ message });
    });

    socket.emit("joinRoom", { roomId, userId });

    return () => {
      socket.off("userMuted");
      socket.off("muteStatus");
      socket.off("error");
    };
  }, [roomId, userId, socket]);

  const toggleMute = (targetUserId) => {
    const isMuted = mutedUsers[targetUserId] || false;
    socket.emit("muteUser", { roomId, targetUserId, mute: !isMuted });
  };

  // Users & Messages ---------------------------------------------------------------
  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const roomResponse = await fetch(`${api}/rooms/${roomId}`, {
          headers: {
            Authorization: `${Auth}`,
          },
        });
        const roomData = await roomResponse.json();
        setRoomInfo(roomData);
        setLoading(false);
        if (roomData.owner_id === userId) {
          setIsAdmin(true);
        } else {
          setAddUser(true);
        }

        const res = await fetch(`${api}/users/GetByUserId/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `${Auth}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setMe(data);
          setImage(data.profile_image);
        } else {
        }

        const messagesResponse = await fetch(
          `${api}/rooms/${roomId}/messages`,
          {
            headers: {
              Authorization: `${Auth}`,
            },
          }
        );
        const messagesData = await messagesResponse.json();
        setMessages(messagesData);
      } catch (error) {
        setErr({ message: "خطا در اتصال به اینترنت" });
      }
    };

    if (roomId && userId) {
      fetchRoomData();
    } else if (!userId) {
      setLoading(false);
      setSignIn(true);
    }
  }, [roomId, userId]);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("فقط JPG، PNG و WebP مجاز است!");
      return;
    }
    setSelectedImage(file);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() && !selectedImage) return; // ✅ جلوگیری از ارسال پیام خالی

    const metadata = {
      roomId,
      sender_id: me.id,
      sender_name: me.name,
      message: newMessage || "",
    };

    if (selectedImage) {
      const reader = new FileReader();
      reader.readAsArrayBuffer(selectedImage);
      reader.onload = () => {
        socket.emit("upload", {
          name: selectedImage.name,
          data: reader.result, // داده باینری
          ...metadata,
        });
        setSelectedImage(null); // ✅ پاک کردن عکس بعد از ارسال
      };
    } else {
      socket.emit("send_message_room", metadata);
    }

    setNewMessage(""); // ✅ پاک کردن اینپوت پیام بعد از ارسال
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => {
      socket.off("receive_message", handleReceiveMessage);
    };
  }, [socket]);

  const messagesEndRef = useRef(null); // Create a reference for the last message

  // Function to scroll to the last message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleDownload = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `downloaded-image.jpg`; // نام فایل ذخیره‌شده
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {}
  };

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (e) => setSelectedImage(e.target.result);
        reader.readAsDataURL(file);
      }
    }
  };

  const renderMessages = () => {
    return messages.map((msg, index) => (
      <div
        key={index}
        className={`message md:show-absolute text-white px-4 md:px-3 md:py-1 py-2 my-1 ${
          msg.sender_id === userId ? "mr-auto" : ""
        } rounded-lg shadow-md`}
        style={{
          alignSelf: "flex-start",
          display: "inline-block",
          maxWidth: "75%",
        }}
      >
        <strong className="block text-[14px] md:text-[13px]">
          {msg.sender_id === userId
            ? `: ${msg.sender_name}`
            : `${msg.sender_name}:`}
        </strong>
        {msg.image && (
          <img
            src={msg.image}
            alt="تصویر ارسال شده"
            className="w-48 my-2 mx-auto rounded-lg shadow-md cursor-pointer"
            onClick={() => setFullScreenImage(msg.image)}
          />
        )}
        {msg.message && (
          <h2 className="text-[16px] md:text-[14.5px]">{msg.message}</h2>
        )}
      </div>
    ));
  };

  useEffect(() => {
    if (messages.length > 0) {
      const lastMessageId = messages[messages.length - 1]?.id;
      const element = document.getElementById(`message-${lastMessageId}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }, [messages]);

  // Delete/Remove & Join users -------------------------------------------------------------
  // به‌روزرسانی لیست کاربران هنگام دریافت کاربران اتاق
  useEffect(() => {
    const updateUserList = (users) => {
      const filteredUsers = users.filter((user) => user.id !== userId);

      setUsers([
        ...filteredUsers,
        { id: userId, name: "شما", profile_image: image },
      ]);
    };

    const fetchUsers = () => {
      socket.emit("get_room_users", roomId, (response) => {
        if (response.success && response.users.length > 0) {
          updateUserList(response.users);
        } else {
        }
      });
    };

    // منتظر بمانید تا کاربر در سرور ثبت شود، سپس کاربران را دریافت کنید
    const handleUserJoined = (userInfo) => {
      if (!userInfo || !userInfo.id) {
        return;
      }
      setUsers((prevUsers) => {
        if (!prevUsers.some((user) => user.id === userInfo.id)) {
          return [...prevUsers, userInfo];
        }
        return prevUsers;
      });

      // حالا که کاربر تأیید شد، لیست کاربران را دریافت کن
      fetchUsers();
    };

    const handleUserLeft = ({ userId: userLeftId }) => {
      console.log(`User left: ${userLeftId}`);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userLeftId)
      );
    };

    // اول لیست کاربران را بگیر
    fetchUsers();

    // سپس رویدادها را ثبت کن
    socket.on("user_joined", handleUserJoined);
    socket.on("user_left", handleUserLeft);

    return () => {
      socket.off("user_joined", handleUserJoined);
      socket.off("user_left", handleUserLeft);
    };
  }, [roomId, userId, socket, image]);

  // مدیریت خروج کاربر از اتاق
  useEffect(() => {
    const handleLeaveRoom = () => {
      if (roomId && userId) {
        socket.emit("leave_room", roomId, userId);
      }
    };

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      handleLeaveRoom();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      handleLeaveRoom();
    };
  }, [roomId, userId, socket]);

  const handleAddUser = () => {
    if (!roomId) {
      setErr({ message: "خطا در دریافت اطلاعات" });
      return;
    }

    if (!userId) {
      setErr({ message: "خطا در دریافت اطلاعات" });
      return;
    }

    const isManager = roomInfo?.owner_id === userId;

    socket.emit(
      "join_room",
      { roomId, userId, options: { isManager } },
      (response) => {
        if (response.success) {
        } else {
          setErr({ message: "خطا در دریافت اطلاعات" });
        }
      }
    );
  };
  useEffect(() => {
    handleAddUser();
  }, [addUser, userId, roomId, socket]);

  // حذف کاربر از اتاق
  useEffect(() => {
    const handleUserKicked = () => {
      setIsKicked(true);
    };

    socket.on("user_kicked", handleUserKicked);

    return () => {
      socket.off("user_kicked", handleUserKicked);
    };
  }, [socket]);

  const handleRemoveUser = (userIdToRemove) => {
    socket.emit(
      "remove_user",
      { roomId, userId: userIdToRemove },
      (response) => {
        if (response.success) {
          setUsers((prevUsers) =>
            prevUsers.filter((user) => user.id !== userIdToRemove)
          );
        } else {
          setErr({ message: "خطایی رخ داد !" });
          alert(response.message || "Failed to remove user.");
        }
      }
    );
  };

  useEffect(() => {
    if (isAdmin) {
      setShowLink(true);
      setProgress(0); // مقداردهی اولیه به 0

      const timer = setTimeout(() => {
        setShowLink(false);
      }, 5400);

      const interval = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 2 : 100)); // افزایش تدریجی مقدار
      }, 100);

      return () => {
        clearTimeout(timer); // پاک کردن تایمر
        clearInterval(interval); // پاک کردن اینتروال
      };
    }
  }, [isAdmin]);

  useEffect(() => {
    if (err) {
      setShowError(true);
      setProgressE(0);

      const timer = setTimeout(() => {
        setShowError(false);
      }, 5400);

      const interval = setInterval(() => {
        setProgressE((prev) => (prev < 100 ? prev + 2 : 100));
      }, 100);

      return () => {
        clearTimeout(timer); // پاک کردن تایمر
        clearInterval(interval); // پاک کردن اینتروال
      };
    }
  }, [err]);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setAlretRes(true);
  };

  const truncatedLink = `${inviteLink.slice(0, 25)}...`;

  useEffect(() => {
    document.body.classList.add("overflow-hidden");
    return () => document.body.classList.remove("overflow-hidden");
  }, []);

  //------------------------------------------------------------------------- Theme Color

  // تم آبی
  const blueTheme = {
    ContainerBG:
      "radial-gradient(circle, rgba(0, 95, 115, 1) 0%, rgba(19, 16, 68, 1) 100%)",
    HeaderBG:
      "linear-gradient(to left, rgba(8, 34, 87, 0.459), rgba(91, 91, 156, 0.479))",
    MessagesBG: "rgba(55, 75, 165, 0.603)",
    UserBG:
      "linear-gradient(to left, rgba(8, 34, 87, 0.459), rgba(91, 91, 156, 0.479))",
    UsersListBG: "#2c3c5ea8",
  };

  // تم طوسی
  const grayTheme = {
    ContainerBG:
      "radial-gradient(circle, rgba(51, 51, 51, 1) 0%, rgba(68, 68, 68, 1) 100%)",
    HeaderBG:
      "linear-gradient(to left, rgba(51, 51, 51, 0.459), rgba(68, 68, 68, 0.479))",
    MessagesBG: "#333333",
    UserBG:
      "linear-gradient(to left, rgba(51, 51, 51, 0.459), rgba(68, 68, 68, 0.479))",
    UsersListBG: "rgba(46, 46, 46, 0.66)",
  };

  // آرایه تمام تم‌ها
  const themes = [blueTheme, grayTheme];

  // استفاده از useState برای ذخیره تم انتخابی
  const [colors, setColors] = useState(blueTheme);

  // انتخاب تم به صورت تصادفی فقط یکبار هنگام mount شدن کامپوننت
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setColors(themes[randomIndex]);
  }, []);
  //-------------------------------------------------------------------------

  if (loading)
    return (
      <div className="loader-container mt-[20rem]">
        <div className="loader"></div>
      </div>
    );
  if (signIn)
    return (
      <div className="bg-gray-200 text-white rounded-lg container mt-[17rem] flex-col w-full mx-auto py-10">
        <h1 className="text-3xl text-black font-bold py-4 px-2">
          لطفا ابتدا ثبت نام کنید یا وارد شوید
        </h1>
        <div className="container gap-7 mt-6 mb-2">
          <Link
            className="bg-black text-gray-200 rounded-xl w-[10rem] container py-2"
            href="/Login"
          >
            صفحه ورود
          </Link>
          <Link
            className="bg-black text-gray-200 rounded-xl w-[10rem] container py-2"
            href="/SignIn"
          >
            صفحه ثبت نام
          </Link>
        </div>
      </div>
    );
  if (isKicked) {
    return (
      <div
        dir="rtl"
        className="text-white container flex-col mt-[20rem]"
        style={{ textAlign: "center" }}
      >
        <h1 className="text-4xl">شما از اتاق خارج شدید.</h1>
        <Link href="/Login">
          <p className="mt-10 hover:text-slate-400">
            برای رفتن به صفحه اصلی کلیک کنید.
          </p>
        </Link>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      style={{
        background: colors.ContainerBG,
      }}
      className="overflow-x-hidden md:w-full h-screen flex flex-col"
    >
      <div
        style={{
          background: colors.HeaderBG,
        }}
        className="header text-white h-[7rem] md:h-[5rem] px-20 flex justify-between items-center md:justify-center"
      >
        <h1 className="text-3xl md:text-xl font-bold ">{roomInfo.name}</h1>
        {isAdmin && showLink && (
          <div className="suggestLink bg-gray-200 md:w-[85%] md:top-[0.5rem] md:absolute top-[5rem] px-4 py-2 rounded-lg text-slate-900 shadow-md max-w-md">
            <div className="container gap-2">
              <h1 className="text-lg md:text-[15px] md: font-semibold mb-2">
                لینک دعوت اتاق:
              </h1>
              <div dir="ltr" className="flex items-center gap-2 mb-2">
                <span
                  className="text-blue-400 md:text-[13px] border-2 px-2 py-1 rounded-lg border-gray-300 hover:text-blue-500 cursor-pointer"
                  onClick={handleCopy}
                >
                  {truncatedLink}
                </span>
              </div>
            </div>
            {AlretRes && (
              <div className="item absolute left-[16rem] md:left-[10rem] md:text-[12px] top-14 text-[14px] px-4 py-1 rounded-lg bg-gray-100 text-black">
                لینک کپی شد
              </div>
            )}
            <div className="w-full bg-gray-300 h-[3px] rounded-full mt-1">
              <div
                className="bg-blue-500 h-[3px] rounded-full transition-all"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}
        {err && showError && (
          <div className="suggestLink md:w-[85%] md:top-[5.5rem] md:absolute px-4 py-2 rounded-lg bg-alert-err shadow-md w-[27rem]">
            <div className="container gap-2">
              <h1 className="text-lg font-semibold mb-2 md:text-[17px]">
                هشدار:
              </h1>
              <div dir="rtl" className="flex items-center gap-2 mb-2 w-[100%]">
                <span className="text-white-400 md:text-[14px] border-2 px-2 py-1 rounded-lg border-gray-300 w-full">
                  {err.message}
                </span>
              </div>
            </div>
            <div className="w-full bg-gray-300 h-[3px] rounded-full mt-1">
              <div
                className="bg-black h-[3px] rounded-full transition-all"
                style={{ width: `${progressE}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>

      <div className="flex md:w-full md:flex-col justify-center h-[90%]">
        {/* Main Content */}
        <div className="flex flex-grow md:w-full overflow-hidden">
          {/* Sidebar */}
          <div
            style={{ background: colors.UsersListBG }}
            className="w-[29%] md:hidden text-white p-4 flex flex-col"
          >
            <h2 className="text-lg font-bold mb-4">کاربران</h2>
            <ul className="flex-grow overflow-y-auto">
              {Array.isArray(users) &&
                users.map((user) => (
                  <li
                    key={user.id}
                    className="user-from-userList flex justify-between items-center py-2 border-b border-gray-600"
                  >
                    <img
                      className="rounded-full w-14 h-14"
                      src={
                        user.profile_image
                          ? `${api}/${user.profile_image}`
                          : noneprofile
                      }
                      alt="profile"
                    />
                    <span className="ml-auto mr-2">{user.name}</span>
                    {isAdmin && user.id !== userId && (
                      <button
                        onClick={() => toggleMute(user.id)}
                        className="py-1 rounded-lg text-[7px] ml-2 text-gray-200 transition"
                      >
                        {mutedUsers[user.id] ? (
                          <FaMicrophoneSlash className="text-[19px] text-white" />
                        ) : (
                          <FaMicrophone className="text-[19px] text-white" />
                        )}
                      </button>
                    )}
                    {isAdmin && user.id !== userId && (
                      <button
                        onClick={() => handleRemoveUser(user.id)}
                        className="px-3 py-1 rounded-lg text-[12px] ml-1 bg-red-400 text-gray-200 transition"
                      >
                        حذف کاربر
                      </button>
                    )}
                    {user.id === roomInfo.owner_id && (
                      <button className="px-4 py-1 rounded-lg text-[13px] ml-2 bg-slate-400 text-white transition">
                        مدیر
                      </button>
                    )}
                  </li>
                ))}
            </ul>
          </div>
          {/* Audio Section */}
          <div className="flex-grow w-[40%] md:w-full overflow-y-scroll h-[86%] flex flex-wrap justify-center items-center p-4">
            <div className="w-full">
              <AudioCall
                setErr={setErr}
                userId={userId}
                roomId={roomId}
                socket={socket}
                setShowChatMD={setShowChatMD}
                showChatMD={showChatMD}
                users={users}
                api={api}
                noneprofile={noneprofile}
                setPeerConnect={setPeerConnect}
                mutedUsers={mutedUsers}
              />
            </div>
          </div>
        </div>

        {/* Messages */}
        <div
          style={{
            backgroundColor: colors.MessagesBG,
          }}
          className="Messages-box md:hidden w-full max-w-[25%] md:max-w-[100%] md:h-[20rem] md:mx-auto overflow-y-scroll h-full shadow-inner flex flex-col gap-2"
        >
          <h1 className="header-messages m-4 sticky top-4 text-2xl bg-gray-950 text-white text-center py-2 rounded-lg mb-4">
            پـــــیــــــام هـــــــــــا
          </h1>
          <div className="flex flex-col gap-0 w-full py-4 px-2 pb-20">
            {(messages[0] && renderMessages()) || (
              <h2 className="container mt-10">هنوز پیامی موجود نیست...</h2>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Footer */}

          {selectedImage && (
            <div className="fixed bottom-14 mb-5 px-2 py-1 w-[23.75%] bg-gray-200 flex justify-center items-center">
              <img
                src={
                  selectedImage instanceof File
                    ? URL.createObjectURL(selectedImage)
                    : selectedImage
                }
                alt="پیش‌نمایش تصویر"
                className="w-24 mx-auto rounded-lg shadow-md"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-2 right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>
          )}

          <div className="bg-gray-950 fixed bottom-0 left-0 w-[25%] py-4 px-4 flex items-center gap-4 shadow-md">
            <div className="absolute w-10 h-10 mt-2">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: "none" }}
                id="image-picker"
              />
              <label htmlFor="image-picker">
                <img
                  className="w-8 cursor-pointer hover:scale-105 transition-all w-8 absolute mr-2"
                  src="/image-picker.png"
                  alt="انتخاب تصویر"
                />
              </label>
            </div>
            <input
              type="text"
              placeholder="پیام خود را بنویسید...."
              value={newMessage}
              onKeyDown={handleKeyPress}
              onPaste={handlePaste} // مدیریت پیست کردن تصویر
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-grow px-12 py-[11px] rounded-2xl text-black"
            />
            <button
              onClick={handleSendMessage}
              className="bg-white absolute right-[83%] text-[#2C3C5E] px-2 py-2 rounded-full hover:bg-[#E0E0E0] transition flex items-center justify-center gap-2"
            >
              <img
                src="/sendIcon.png"
                className="w-6 h-6 rotate-180 transition-all transition-[0.5s] hover:translate-x-[-1px]"
                alt="png"
              />
            </button>
          </div>
        </div>

        {/* Messages */}
        {showChatMD && (
          <div
            style={{
              backgroundColor: colors.MessagesBG,
            }}
            className={`Messages-box-MD chat-md-animate absolute w-[80%] md:h-[28rem] mb-20 md:mx-auto overflow-y-scroll h-full shadow-inner flex-col gap-2 ${
              showChatMD ? "hidden md:flex" : "hidden"
            }`}
          >
            <img
              onClick={() => setShowChatMD(false)}
              className="w-8 rotate-180 show-absolute sticky top-[22px] left-4 top-0 z-10 rounded-xl opacity-60 mr-auto hover:opacity-95 transition-all cursor-pointer"
              src="/BackArrow.png"
              alt="back"
            />
            <h1 className="m-2 mr-4 show-absolute sticky top-4 text-lg mt-[-30px] bg-gray-950 text-white text-right pr-5 py-2 rounded-lg mb-0">
              پـــــیــــــام هـــــــــــا
            </h1>
            <div className="flex flex-col gap-0 w-full py-4 px-2 pb-18">
              {(messages[0] && renderMessages()) || (
                <h2 className="container mt-20">هنوز پیامی موجود نیست...</h2>
              )}
            </div>
            {/* Footer */}
            {selectedImage && (
              <div className="sticky bottom-14 mb-[-8px] px-2 py-1 w-[100%] bg-gray-200 flex justify-center items-center">
                <img
                  src={
                    selectedImage instanceof File
                      ? URL.createObjectURL(selectedImage)
                      : selectedImage
                  }
                  alt="پیش‌نمایش تصویر"
                  className="w-24 mx-auto rounded-lg shadow-md"
                />
                <button
                  onClick={() => setSelectedImage(null)}
                  className="absolute top-2 right-2 bg-black text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>
            )}
            <div className="bg-gray-950 show-absolute sticky bottom-0 mt-auto right-0 md:w-[100%] z-10 py-3 pb-2d px-2 flex items-center shadow-md">
              <div className="absolute w-7 h-7">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  style={{ display: "none" }}
                  id="image-picker"
                />
                <label htmlFor="image-picker">
                  <img
                    className="w-6 cursor-pointer hover:scale-105 transition-all w-8 absolute mr-1"
                    src="/image-picker.png"
                    alt="انتخاب تصویر"
                  />
                </label>
              </div>
              <input
                type="text"
                placeholder="پیام خود را بنویسید...."
                value={newMessage}
                onKeyDown={handleKeyPress}
                onPaste={handlePaste} // مدیریت پیست کردن تصویر
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-grow pr-9 pl-10 py-[7px] rounded-xl md:w-[90%] text-[16px] text-black"
              />
              <button
                onClick={handleSendMessage}
                className="bg-white absolute right-[82%] text-[#2C3C5E] px-2 py-2 rounded-full hover:bg-[#E0E0E0] transition flex items-center justify-center gap-2"
              >
                <img
                  src="/sendIcon.png"
                  className="w-5 h-5 rotate-180 "
                  alt="png"
                />
              </button>
            </div>
          </div>
        )}
      </div>
      {peerConncet && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-90 z-50"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 1,
              }}
              className="text-white text-lg flex flex-col items-center gap-4"
            >
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <span>در حال برقراری ارتباط صوتی...</span>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      {fullScreenImage && (
        <div
          className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setFullScreenImage(null)}
        >
          {/* دکمه بستن */}
          <button
            className="absolute top-6 right-6 text-white text-3xl w-10 h-10 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              setFullScreenImage(null);
            }}
          >
            ✕
          </button>

          {/* دکمه دانلود */}
          <button
            className="absolute top-5 right-16 text-white px-4 py-2 rounded-md "
            onClick={(e) => {
              e.stopPropagation();
              handleDownload(fullScreenImage);
            }}
          >
            <img
              src="/downloads.png"
              alt="png"
              className="w-6 h-6 filter invert"
            />
          </button>

          <img
            src={fullScreenImage}
            alt="تصویر کامل"
            className="max-w-full max-h-full rounded-lg shadow-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
