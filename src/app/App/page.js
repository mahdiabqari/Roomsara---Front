"use client";
import { io } from "socket.io-client";
import React, { useState, useEffect, useRef } from "react";
import Menu_left_D from "@/app/components/messenger/Menu";
import ChatPage from "@/app/components/messenger/Home";
import Link from "next/link";
import MobileMenu from "@/app/components/----/bottombarmd";
import Head from "next/head";
let socket;

export default function Messenger() {
  // States --------------------------------------------
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedUserInfo, setSelectedUserInfo] = useState(null);
  const [selectShow, setSelectShow] = useState(false);
  const [suggest, setSuggest] = useState([]);
  const [showres, setShowres] = useState(true);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 });
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyingTo, setReplyingTo] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});
  const [usersStatus, setUsersStatus] = useState({});
  const [menuitem, setMenuitem] = useState(false);
  const [showsetting, setShowsetting] = useState(false);
  const [isloadingMs, setIsloadingMs] = useState(false);
  const [Auth, setAuth] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("AuthorizationRoomSara") || "";
    }
    return "";
  });
  const [userId, setUserId] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("RoomSaraID") || "";
    }
    return "";
  });
  const [me, setMe] = useState("");
  const [users, setUsers] = useState([]);
  const socketRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const api = "";
  const [routing, setRouting] = useState(false);
  const [err, setErr] = useState();
  const [showError, setShowError] = useState(true);
  const [progressE, setProgressE] = useState(0);
  const [lastMessageTimes, setLastMessageTimes] = useState({});
  const [showprofile, setShowprofile] = useState(false);
  const [checkinfo, setCheckinfo] = useState(false);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // آیا پیام بیشتری وجود دارد؟

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("AuthorizationRoomSara");

      socket = io("", {
        auth: {
          token: token || "",
        },
      });

      socket.on("connect", () => {
        setSocketConnected(true);
      });

      socket.on("disconnect", () => {
        setSocketConnected(false);
      });

      // Clean up on unmount
      return () => {
        socket.disconnect();
      };
    }
  }, []);

  useEffect(() => {
    if (!("Notification" in window)) {
      console.log("This browser does not support notifications.");
      return;
    }

    if (Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        if (permission === "granted") {
        } else {
        }
      });
    } else if (Notification.permission === "granted") {
    }
  }, []);

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

  //back btn
  useEffect(() => {
    if (selectShow) {
      // اضافه کردن یه حالت به history موقع باز شدن مُدال
      window.history.pushState({ modal: "chat" }, "", window.location.href);

      // گوش دادن به رویداد popstate
      const handlePopState = (event) => {
        event.preventDefault();
        setSelectedUser(null); // بستن مُدال
        setShowres(false);
        setSelectShow(false);
        setNewMessage("");
        setReplyingTo("");
      };

      window.addEventListener("popstate", handlePopState);

      // پاکسازی موقع بسته شدن مُدال یا اتمام کامپوننت
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    } else if (showsetting) {
      // اضافه کردن یه حالت به history موقع باز شدن مُدال
      window.history.pushState({ modal: "chat" }, "", window.location.href);

      // گوش دادن به رویداد popstate
      const handlePopState = (event) => {
        event.preventDefault();
        setShowsetting(null);
      };

      window.addEventListener("popstate", handlePopState);

      // پاکسازی موقع بسته شدن مُدال یا اتمام کامپوننت
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    } else if (routing) {
      // اضافه کردن یه حالت به history موقع باز شدن مُدال
      window.history.pushState({ modal: "chat" }, "", window.location.href);

      // گوش دادن به رویداد popstate
      const handlePopState = (event) => {
        event.preventDefault();
        setRouting(null);
      };

      window.addEventListener("popstate", handlePopState);

      // پاکسازی موقع بسته شدن مُدال یا اتمام کامپوننت
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [selectShow, showsetting, showres, routing]);

  //PWA
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
  }, []);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      const dismissed = localStorage.getItem("pwa-install-dismissed");
      if (dismissed === "true") return;

      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("کاربر نصب رو قبول کرد");
        } else {
          console.log("کاربر نصب رو رد کرد");
          localStorage.setItem("pwa-install-dismissed", "true");
        }
        setDeferredPrompt(null);
        setShowInstallButton(false);
      });
    }
  };

  const handleDismissClick = () => {
    setShowInstallButton(false);
    localStorage.setItem("pwa-install-dismissed", "true");
  };

  // -----------------------------------------------------

  //Fetch userInfo --------------------------------------------------------------------
  useEffect(() => {
    if (!userId) return;
    try {
      socket.emit(`join`, userId);
    } catch (err) {
      setCheckinfo(false);
      return;
    }
    console.error = () => {};
    console.warn = () => {};

    return () => {
      socket.off(`join`);
    };
  }, [userId]);

  useEffect(() => {
    const findMe = async () => {
      // اول از localStorage بخون
      const localMe = localStorage.getItem(`me_${userId}`);
      if (localMe) {
        setMe(JSON.parse(localMe));
        setCheckinfo(true);
        return;
      }

      // اگه نبود، از سرور بگیر
      try {
        const res = await fetch(`${api}/users/GetByUserId/${userId}`, {
          method: "GET",
          headers: {
            Authorization: `${Auth}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setMe(data);
          setCheckinfo(true);
          // ذخیره در localStorage
          localStorage.setItem(`me_${userId}`, JSON.stringify(data));
        } else {
          setErr({ message: "خطا در دریافت اطلاعات" });
        }
      } catch (err) {
        console.error(err);
      }
    };

    findMe();

    console.error = () => {};
    console.warn = () => {};
  }, [userId, Auth]);

  //Friends & usersList
  // Load friends list from LocalStorage or server
  useEffect(() => {
    if (!Auth) {
      setErr({ message: "خطا در دریافت اطلاعات" });
      return;
    }

    const fetchFriends = async () => {
      try {
        const response = await fetch(`${api}/users/friends/${userId}`, {
          headers: { Authorization: `${Auth}` },
        });
        const data = await response.json();
        const friends =
          data.length === 0
            ? [{ id: userId, name: me.name, profile_image: me.profile_image }]
            : data;

        setUsers(friends);
        setLoading(false);
        localStorage.setItem(`friends_${userId}`, JSON.stringify(friends));
      } catch (error) {
        setErr({ message: "خطا در دریافت کاربران" });
      }
    };

    fetchFriends();
  }, [userId, Auth, me]);

  // Add self to list if not present
  useEffect(() => {
    if (me && !users.find((user) => user.id === me.id)) {
      setUsers((prevUsers) => {
        const updated = [...prevUsers, me];
        localStorage.setItem(`friends_${userId}`, JSON.stringify(updated));
        return updated;
      });
    }
  }, [me, users, userId]);

  // Update friends list on new messages via socket
  useEffect(() => {
    const handleUpdateFriends = (newMessage) => {
      setUsers((prevUsers) => {
        const exists = prevUsers.find(
          (u) =>
            u.id === newMessage.sender_id || u.id === newMessage.receiver_id
        );
        let updated = [...prevUsers];

        // اگر کاربر جدید بود، اضافه کن
        if (!exists) {
          const newUser = {
            id:
              newMessage.sender_id === userId
                ? newMessage.receiver_id
                : newMessage.sender_id,
            name: newMessage.sender_name,
            profile_image: newMessage.sender_image,
            unread: true,
          };
          updated = [newUser, ...updated];
        } else {
          // اگر بود، جابه‌جا کن به بالا و وضعیت unread را بروزرسانی کن
          updated = updated.map((u) => {
            if (
              u.id === newMessage.sender_id ||
              u.id === newMessage.receiver_id
            ) {
              return { ...u, unread: true };
            }
            return u;
          });
          updated = updated.sort(
            (a, b) => (b.unread ? 1 : 0) - (a.unread ? 1 : 0)
          ); // unread اول
        }

        localStorage.setItem(`friends_${userId}`, JSON.stringify(updated));
        return updated;
      });
    };

    socket.on("update_friends", handleUpdateFriends);

    return () => {
      socket.off("update_friends", handleUpdateFriends);
    };
  }, [userId]);

  //Search and select users -------------------------------------------------------------
  const handleSearchUsers = async () => {
    if (searchTerm.length < 3) {
      setSuggest([]);
      return;
    }

    try {
      const response = await fetch(`${api}/users/search?name=${searchTerm}`, {
        method: "GET",
        headers: {
          Authorization: `${Auth}`,
        },
      });
      const data = await response.json();
      setSuggest(data);
    } catch (error) {
      console.error("Error searching users");
    }
    console.error = () => {};
    console.warn = () => {};
  };

  const sortedUsers = users.sort((a, b) => {
    const unreadA = unreadMessages[a.id] || 0;
    const unreadB = unreadMessages[b.id] || 0;

    // اگر تعداد پیام‌های خوانده نشده متفاوت است
    if (unreadB !== unreadA) {
      return unreadB - unreadA;
    }

    // اگر تعداد پیام‌های خوانده نشده برابر است، زمان آخرین پیام را مقایسه کنید
    const timeA = lastMessageTimes[a.id] || 0;
    const timeB = lastMessageTimes[b.id] || 0;

    return timeB - timeA;
  });

  const handleSelectUser = (user) => {
    if (selectedUser === user.id) {
      return;
    } else {
      setMessages([]);
      setSuggest([]);
      setSelectedUser(user.id);
      setSelectedUserInfo(user);
      setSelectShow(true);
      setShowres(true);
      setNewMessage("");
      setReplyingTo("");

      if (unreadMessages[user.id]) {
        // ارسال درخواست خوانده شدن پیام‌های این کاربر
        socket.emit("mark_all_messages_as_read", {
          sender_id: user.id, // پیام‌ها از این کاربر به شما رسیده‌اند
          receiver_id: userId, // شما دریافت‌کننده هستید
        });

        // پاک کردن شمارش پیام‌های خوانده نشده
        setUnreadMessages((prev) => {
          const updated = { ...prev };
          delete updated[user.id];
          return updated;
        });
      }
    }
  };

  const enterSearch = (e) => {
    if (e.key == "Enter") {
      handleSearchUsers(e);
    }
  };

  //Menu setting -------------------------------------------------------------------------
  const menuRef = useRef(null);

  const handleMenuItemClick = (e) => {
    const action = e.currentTarget.getAttribute("data-action");

    switch (action) {
      case "settings":
        setShowsetting(true);
        break;
      case "createRoom":
        setSelectedUser(false);
        setShowres(true);
        setSelectShow(false);
        break;
      case "reloadPage":
        window.location.reload();
        break;
      case "savedMessages":
        handleSelectUser(me);
        break;
      default:
        console.warn("Unknown action:", action);
    }

    // بستن منو بعد از هر کلیک
    setMenuitem(false);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      // بررسی اگر کلیک بیرون از منو انجام شده باشد
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuitem(false); // بستن منو
      }
    };

    if (menuitem) {
      document.addEventListener("click", handleOutsideClick); // اضافه کردن رویداد کلیک
    } else {
      document.removeEventListener("click", handleOutsideClick); // حذف رویداد کلیک
    }

    // پاک کردن رویداد هنگام unmount
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [menuitem]);

  //Messages ------------------------------------------------------------------------------
  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && selectedUser) {
      const messageData = {
        sender_id: userId,
        receiver_id: selectedUser,
        message: newMessage,
        reply_to: replyingTo ? replyingTo.id : null,
        reply_to_text: replyingTo ? replyingTo.message.substring(0, 20) : null,
      };

      socket.emit("send_message", messageData);

      setNewMessage("");
      setReplyingTo(null);
    }
  };

  const fetchPreviousMessages = async () => {
    if (!selectedUser || !hasMore) return;

    setIsLoadingMore(true);

    const chatContainer = document.getElementById("chat-container");
    const prevScrollTop = chatContainer ? chatContainer.scrollTop : 0;
    const prevScrollHeight = chatContainer ? chatContainer.scrollHeight : 0;

    const cacheKey = `chat_${userId}_${selectedUser}`;
    const cachedData = JSON.parse(localStorage.getItem(cacheKey) || "[]");

    // حالت 1: گرفتن پیام‌ها از کش
    if (cachedData.length > messages.length) {
      const moreFromCache = cachedData.slice(
        cachedData.length - messages.length - 15,
        cachedData.length - messages.length
      );
      if (moreFromCache.length > 0) {
        setMessages((prev) => [...moreFromCache, ...prev]);
        setIsLoadingMore(false);
        setTimeout(() => {
          if (chatContainer) {
            const newScrollHeight = chatContainer.scrollHeight;
            chatContainer.scrollTop =
              newScrollHeight - prevScrollHeight + prevScrollTop;
          }
        }, 0);
        return;
      }
    }

    // حالت 2: گرفتن پیام‌ها از سرور
    try {
      const response = await fetch(
        `${api}/messages/get/${userId}/${selectedUser}?limit=15&offset=${messages.length}`,
        { headers: { Authorization: Auth } }
      );

      if (!response.ok) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }

      const data = await response.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        const enhancedMessages = data
          .map((msg) => ({
            ...msg,
            replyToMessage: msg.reply_to
              ? data.find((m) => m.id === msg.reply_to)?.message ||
                "Message not found"
              : null,
          }))
          .reverse();

        setMessages((prev) => [...enhancedMessages, ...prev]);

        // ذخیره در LocalStorage
        const updatedCache = [...enhancedMessages, ...messages];
        localStorage.setItem(cacheKey, JSON.stringify(updatedCache));
        // حفظ اسکرول
        setTimeout(() => {
          if (chatContainer) {
            const newScrollHeight = chatContainer.scrollHeight;
            chatContainer.scrollTop =
              newScrollHeight - prevScrollHeight + prevScrollTop;
          }
        }, 0);
      }
    } catch (error) {
      console.error("Error fetching previous messages:", error);
    }

    setIsLoadingMore(false);
  };

  // مرتب‌سازی پیام‌ها بر اساس timestamp
  const sortMessagesByTime = (messages) => {
    return messages.sort(
      (a, b) => new Date(a.timestamp) - new Date(b.timestamp) // یا timestamp
    );
  };

  useEffect(() => {
    const chatContainer = document.getElementById("chat-container");
    if (!chatContainer) return;

    const handleScroll = () => {
      if (chatContainer.scrollTop <= 50 && !isLoadingMore && hasMore) {
        const prevScrollHeight = chatContainer.scrollHeight; // ارتفاع قبلی

        setIsLoadingMore(true);

        fetchPreviousMessages(messages.length).then(() => {
          // بعد از رندر شدن پیام‌ها:
          requestAnimationFrame(() => {
            const newScrollHeight = chatContainer.scrollHeight;
            chatContainer.scrollTop =
              newScrollHeight - prevScrollHeight + chatContainer.scrollTop;
            setIsLoadingMore(false);
          });
        });
      }
    };

    chatContainer.addEventListener("scroll", handleScroll);
    return () => chatContainer.removeEventListener("scroll", handleScroll);
  }, [isLoadingMore, hasMore, messages.length]);

  useEffect(() => {
    const fetchPreviousMessagesT = async () => {
      if (selectedUser) {
        setIsloadingMs(true);
        try {
          const response = await fetch(
            `${api}/messages/get/${userId}/${selectedUser}`,
            {
              headers: {
                Authorization: `${Auth}`,
              },
            }
          );
          const data = await response.json();

          // افزودن پیام مرجع به هر پیام
          const enhancedMessages = data.map((msg) => ({
            ...msg,
            replyToMessage: msg.reply_to
              ? data.find((m) => m.id === msg.reply_to)?.message ||
                "Message not found"
              : null,
          }));

          setMessages(sortMessagesByTime(enhancedMessages));

          // به‌روزرسانی lastMessageTimes بر اساس آخرین پیام‌های دریافت شده
          const lastMessageTimesUpdate = {};
          data.forEach((msg) => {
            lastMessageTimesUpdate[msg.sender_id] = new Date(
              msg.created_at
            ).getTime();
          });
          setLastMessageTimes((prev) => ({
            ...prev,
            ...lastMessageTimesUpdate,
          }));

          setIsloadingMs(false);
        } catch (error) {
          console.error("Error fetching previous messages:", error);
          setIsloadingMs(false);
        }
      }
    };

    fetchPreviousMessagesT();

    // گوش دادن به پیام‌های جدید
    socket.on(`receive_message`, (data) => {
      const cacheKey = `chat_${userId}_${selectedUser}`;

      if (data.sender_id === selectedUser || data.sender_id === userId) {
        // وقتی چت بازه، اضافه کردن پیام به لیست
        setMessages((prev) => {
          const newMessage = {
            ...data,
            replyToMessage: data.reply_to
              ? prev.find((m) => m.id === data.reply_to)?.message ||
                "Message not found"
              : null,
          };
          const updatedMessages = [...prev, newMessage];

          // ذخیره در LocalStorage
          localStorage.setItem(cacheKey, JSON.stringify(updatedMessages));

          return updatedMessages;
        });

        setLastMessageTimes((prev) => ({
          ...prev,
          [data.sender_id]: new Date(data.created_at).getTime(),
        }));

        // علامت خوانده شده
        socket.emit("mark_message_as_read", {
          messageId: data.id,
          receiver_id: userId,
        });
      } else {
        setUnreadMessages((prev) => ({
          ...prev,
          [data.sender_id]: (prev[data.sender_id] || 0) + 1,
        }));

        setLastMessageTimes((prev) => ({
          ...prev,
          [data.sender_id]: new Date(data.created_at).getTime(),
        }));

        // نمایش نوتیفیکیشن مرورگر
        if (Notification.permission === "granted") {
          const notification = new Notification("پیام جدید", {
            body: `${data.name || "یک کاربر"}: ${data.message}`,
            icon: `${api}/${data.profile_image}`,
          });

          notification.onclick = () => {
            window.focus();
            // اینجا میشه مستقیم به چت کاربر رفت
          };
        }
      }
    });

    return () => {
      socket.off(`receive_message`);
    };
  }, [selectedUser, userId]);

  useEffect(() => {
    // اتصال به سوکت با ارسال شناسه کاربر
    socketRef.current = io(api, {
      query: { userId },
    });

    // گوش دادن به وضعیت آنلاین/آفلاین شدن کاربران
    const handleUserStatus = (data) => {
      setUsersStatus((prevStatus) => ({
        ...prevStatus,
        [data.userId]: data.status === "online",
      }));
    };

    socketRef.current.on("user_online_status", handleUserStatus);

    // پاکسازی رویداد هنگام جدا شدن
    return () => {
      socketRef.current.off("user_online_status", handleUserStatus);
    };
  }, [userId]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage(e);
    }
  };

  const handleRightClick = (e, message) => {
    e.preventDefault(); // جلوگیری از رفتار پیش‌فرض راست‌کلیک
    setSelectedMessage(message); // ذخیره پیام انتخاب شده

    // تنظیم موقعیت منو
    setContextMenuPos({
      x: e.clientX, // برای فاصله منو از موس در سمت راست
      y: e.clientY, // برای فاصله منو از موس در سمت پایین
    });

    setContextMenuVisible(true); // نمایش منو
  };

  const scrollToBottom = () => {
    const chatContainer = document.getElementById("chat-container");
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // اینو فقط وقتی پیام جدید به انتهای لیست اضافه میشه اجرا کن
  useEffect(() => {
    if (messages.length > 0 && !isLoadingMore) {
      scrollToBottom();
    }
  }, [messages, isLoadingMore]);

  // تابع برای بستن منو در صورت کلیک خارج از منو
  const handleClickOutside = (e) => {
    if (!e.target.closest(".context-menu") && !e.target.closest(".message")) {
      setContextMenuVisible(false); // مخفی کردن منو
    }
    if (!e.target.closest(".p") && !e.target.closest(".imgimg"))
      setShowprofile(false);
    if (
      !e.target.closest(".rs-modal-content") &&
      !e.target.closest(".rs-modal-btn")
    ) {
      setIsCreateModalOpen(false);
      setIsJoinModalOpen(false);
    }
  };

  //Delete Message & Update
  const handleDeleteMessage = (e) => {
    e.preventDefault();
    if (selectedMessage.sender_id !== userId) {
      setContextMenuVisible(false); // بستن منو
      return;
    }

    try {
      const messageId = selectedMessage.id;
      const sender_id = userId;
      const receiver_id = selectedUser.id;
      // ارسال درخواست حذف به سرور از طریق سوکت
      socket.emit("delete_message", { messageId, sender_id, receiver_id });
      setContextMenuVisible(false);
    } catch (error) {
      alert("Error deleting message");
      setErr({ message: "خطا در حذف پیام" });
      setContextMenuVisible(false);
    }
  };
  useEffect(() => {
    socket.on("message_deleted", ({ messageId }) => {
      // حذف پیام از لیست پیام‌ها
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== messageId)
      );
    });
    return () => {
      socketRef.current.off("message_deleted");
    };
  }, []);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(selectedMessage.message); // کپی پیام
    setContextMenuVisible(false); // بستن منو بعد از کپی
  };

  const fetchUnreadMessages = async (userId, Auth) => {
    try {
      const response = await fetch(`${api}/messages/unread/${userId}`, {
        method: "GET",
        headers: {
          Authorization: `${Auth}`, // استفاده از توکن برای احراز هویت
        },
      });

      if (!response.ok) {
        setErr({ message: "خطا در دریافت پیام ها" });
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return {}; // در صورت بروز خطا، شیء خالی برمی‌گرداند
    }
  };

  useEffect(() => {
    const loadUnreadMessages = async () => {
      const data = await fetchUnreadMessages(userId, Auth);
      setUnreadMessages(data);
    };

    if (userId && Auth) {
      loadUnreadMessages();
    }
  }, [userId, Auth]);

  //هدایت به ریپلای شده
  const handleScrollToMessage = (messageId) => {
    const element = document.getElementById(`message-${messageId}`);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
    }
  };

  const handleReply = (msg) => {
    setReplyingTo(msg);
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside); // افزودن رویداد
    return () => {
      document.removeEventListener("click", handleClickOutside); // حذف رویداد هنگام ترک کامپوننت
    };
  }, []);

  //loading things ------------------------------------------------------------------------------
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [dots, setDots] = useState("...");

  // پروگرس با تایمر ثابت
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        return 100;
      });
    }, 10);

    // شروع انیمیشن خروج و تأخیر
    if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsExiting(true); // شروع محو شدن
        setTimeout(() => {
          setIsComplete(true); // حذف کامل لودینگ
        }, 500); // مدت انیمیشن (0.5 ثانیه)
      }, 1000); // تأخیر 1 ثانیه قبل از شروع انیمیشن
      return () => clearTimeout(timeout);
    }

    return () => clearInterval(interval);
  }, [progress]);

  // انیمیشن نقطه‌ها
  useEffect(() => {
    const dotsInterval = setInterval(() => {
      setDots((prev) => {
        if (prev === "...") return ".";
        if (prev === "..") return "...";
        if (prev === ".") return "..";
        return "...";
      });
    }, 500);

    return () => clearInterval(dotsInterval);
  }, []);

  // Join and Create room ---------------------------------------------------------------
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomJoinName, setRoomJoinName] = useState("");
  //Create Room
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setRouting(true);
    try {
      const response = await fetch(`${api}/rooms/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${Auth}`,
        },
        body: JSON.stringify({ name: roomName, ownerId: userId }),
      });

      const data = await response.json();
      if (response.ok) {
        window.location.href = data.link;
      } else {
        setRouting(false);
        console.error("Error creating room:", data.message);
      }
    } catch (error) {
      setRouting(false);
      console.error("Error creating room:", error);
    }
  };
  //Join in Room
  const HandleNavigateToRoom = (e) => {
    e.preventDefault();
    setRouting(true);

    const regex = /^https:\/\/roomsara\.liara\.run\/Room\/[a-zA-Z0-9_-]+$/;

    if (roomJoinName && regex.test(roomJoinName)) {
      window.location.href = roomJoinName;
    } else {
      setErr({ message: "لینک وارد شده صحیح نیست." });
      setRouting(false);
    }
  };
  useEffect(() => {
    if (isJoinModalOpen || isCreateModalOpen) {
      // اضافه کردن یه حالت به history موقع باز شدن مُدال
      window.history.pushState({ modal: "join" }, "", window.location.href);

      // گوش دادن به رویداد popstate
      const handlePopState = (event) => {
        event.preventDefault();
        setIsJoinModalOpen(false); // بستن مُدال
        setIsCreateModalOpen(false);
      };

      window.addEventListener("popstate", handlePopState);

      // پاکسازی موقع بسته شدن مُدال یا اتمام کامپوننت
      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isJoinModalOpen, isCreateModalOpen]);

  // رندر لودینگ
  if (!isComplete || !Auth || !userId || !checkinfo) {
    return (
      <div
        className={`flex fixed top-0 left-0 flex-col pt-[-40px] items-center justify-center w-full h-screen bg-gradient-to-br from-gray-800 to-blue-900 z-50 transition-opacity duration-500 ${
          isExiting ? "opacity-0" : "opacity-100"
        }`}
      >
        <img
          className="w-[15rem] rounded-full mx-auto md:w-[11rem]"
          src="/logo.png"
          alt="logo"
          style={{ filter: "drop-shadow(0 0 10px rgba(255, 147, 0, 0.3))" }}
        />
        <h1 className="text-4xl md:text-3xl font-bold text-orange-200 mt-4 tracking-wider">
          روم‌ســــــرا
        </h1>
        <div className="w-72 h-3 md:h-2 md:w-70 mt-6 bg-gray-400 rounded-full overflow-hidden shadow-xl relative">
          <div
            className="h-full bg-orange-300 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-900/20 to-transparent animate-shimmer" />
        </div>
        <p
          dir="rtl"
          className="text-base md:text-sm text-gray-300 mt-4 text-center font-medium"
        >
          در حـال بارگــذاری {dots}
        </p>
      </div>
    );
  }
  return (
    <main className="chat-page rmoverflow h-screen w-full bg-message">
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f97316" />
      </Head>

      {showprofile && (
        <div className="w-full h-screen absolute top-0 profile-bg flex justify-center items-center">
          <img
            className="w-[10rem] h-[10rem] md:w-[8rem] md:h-[8rem] bg-gray-600 rounded-full object-cover"
            src={
              selectedUserInfo?.profile_image
                ? `${api}/${selectedUserInfo.profile_image}`
                : "/noneProfile.png"
            }
            alt="profile"
          />
        </div>
      )}

      {/*Home page*/}
      <div
        dir="ltr"
        className="container hidden gap-5 py-2 md:p-0 h-screen w-[95%] md:w-full mx-auto md:gap-0"
      >
        <Menu_left_D
          Auth={Auth}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          enterSearch={enterSearch}
          handleSearchUsers={handleSearchUsers}
          suggest={suggest}
          setSuggest={setSuggest}
          handleSelectUser={handleSelectUser}
          users={sortedUsers}
          showres={showres}
          unreadMessages={unreadMessages}
          menuitem={menuitem}
          setMenuitem={setMenuitem}
          showsetting={showsetting}
          setShowsetting={setShowsetting}
          me={me}
          userId={userId}
          setMe={setMe}
          api={api}
          loading={loading}
          setShowprofile={setShowprofile}
        />
        <ChatPage
          isLoadingMore={isLoadingMore}
          setIsCreateModalOpen={setIsCreateModalOpen}
          setIsJoinModalOpen={setIsJoinModalOpen}
          Auth={Auth}
          selectShow={selectShow}
          setSelectShow={setSelectShow}
          selectedUserInfo={selectedUserInfo}
          messages={messages}
          handleScrollToMessage={handleScrollToMessage}
          userId={userId}
          handleRightClick={handleRightClick}
          replyingTo={replyingTo}
          setReplyingTo={setReplyingTo}
          newMessage={newMessage}
          handleKeyPress={handleKeyPress}
          setNewMessage={setNewMessage}
          handleSendMessage={handleSendMessage}
          showres={showres}
          setShowres={setShowres}
          usersStatus={usersStatus}
          selectedUser={selectedUser}
          me={me}
          api={api}
          isloadingMs={isloadingMs}
          setSelectedUser={setSelectedUser}
          setRouting={setRouting}
          setErr={setErr}
          setShowprofile={setShowprofile}
          showprofile={showprofile}
          setRoomJoinName={setRoomJoinName}
          roomJoinName={roomJoinName}
          setRoomName={setRoomName}
          roomName={roomName}
          HandleNavigateToRoom={HandleNavigateToRoom}
          handleCreateRoom={handleCreateRoom}
        />
      </div>
      {/* منوی راست کلیک */}
      {contextMenuVisible && selectedMessage && (
        <div
          className="context-menu-chat"
          style={{
            position: "absolute",
            top: `${contextMenuPos.y}px`,
            left: `${
              contextMenuPos.x + 200 > window.innerWidth
                ? window.innerWidth - 220
                : contextMenuPos.x
            }px`,
            borderRadius: "12px",
            padding: "3px 10px",
            zIndex: 9999,
            maxWidth: "calc(100% - 20px)",
            background: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ul className="menu-list w-full">
            {selectedMessage.sender_id === userId && (
              <li
                onClick={handleDeleteMessage}
                className={`menu-item flex items-center gap-8 py-0 px-4 rounded hover:bg-gray-400 transition ${
                  selectedMessage.sender_id !== userId && "hidden"
                }`}
              >
                <img
                  src="/delete.png"
                  className="w-5 filter invert "
                  alt="set"
                />
                <span className="text-right text-[14px]">حــذف</span>
              </li>
            )}

            {/* دکمه کپی */}
            <li
              onClick={handleCopyMessage}
              className="menu-item flex items-center gap-8 py-0 px-4 rounded hover:bg-gray-400 transition"
            >
              <img src="/copy.png" className="w-5 filter invert " alt="set" />{" "}
              <span className="text-right text-[14px]">کـپـی</span>
            </li>

            {/* دکمه ریپلای */}
            <li
              onClick={() => handleReply(selectedMessage)}
              className="menu-item flex items-center gap-8 py-0 px-4 rounded hover:bg-gray-400 transition"
            >
              <img src="/reply.png" className="w-5 filter invert " alt="set" />{" "}
              <span className="text-right text-[14px]">ریـپـلـای</span>
            </li>
          </ul>
        </div>
      )}

      {/*منو آیتم ها*/}
      {menuitem && (
        <div
          ref={menuRef}
          className={`menu-container md:w-[195px] md:px-2 md:left-14 md:top-16 ${
            menuitem ? "open" : ""
          }`}
        >
          <ul className="menu-list">
            <li
              className="menu-item"
              data-action="settings"
              onClick={(e) => handleMenuItemClick(e)}
            >
              <img
                src="/setting.png"
                className="w-6 mr-3 filter invert "
                alt="set"
              />{" "}
              {/* آیکون تنظیمات */}
              <span className="menu-text md:text-[14.5px]">تنظیمات</span>
            </li>
            <li
              className="menu-item"
              data-action="createRoom"
              onClick={(e) => handleMenuItemClick(e)}
            >
              <img
                src="/add.png"
                className="w-6 mr-3 filter invert "
                alt="set"
              />{" "}
              {/* آیکون ساخت اتاق */}
              <span className="menu-text md:text-[14.5px]">ساخت اتاق</span>
            </li>
            <Link
              href="/"
              className="menu-item"
              data-action="reloadPage"
              onClick={(e) => handleMenuItemClick(e)}
            >
              <img
                src="/sync.png"
                className="w-5 mr-3 filter invert "
                alt="set"
              />
              {/* آیکون بارگذاری مجدد */}
              <span className="menu-text md:text-[14.5px]">بارگذاری مجدد</span>
            </Link>
            <li
              className="menu-item"
              data-action="savedMessages"
              onClick={(e) => handleMenuItemClick(e)}
            >
              <img
                src="/tool.png"
                className="w-7 mr-2 filter invert "
                alt="set"
              />{" "}
              {/* آیکون پیام‌های ذخیره شده */}
              <span className="menu-text md:text-[14.5px]">
                پیام های ذخیره شده
              </span>
            </li>
          </ul>
        </div>
      )}
      {!selectShow && (
        <div className="hidden md:flex">
          <MobileMenu
            setShowres={setShowres}
            setSelectShow={setSelectShow}
            handleMenuItemClick={handleMenuItemClick}
            setSelectedUser={setSelectedUser}
            setShowsetting={setShowsetting}
            setIsCreateModalOpen={setIsCreateModalOpen}
          />
        </div>
      )}
      {routing && (
        <div
          dir="rtl"
          className="w-full bgRoute h-screen container absolute top-0"
        >
          <h1 className="text-3xl md:text-2xl font-bold loading-text">
            در حال پردازش اطلاعات
          </h1>
        </div>
      )}

      {/* مُدال ساخت اتاق */}
      {isCreateModalOpen && (
        <div
          dir="rtl"
          className="rs-modal hidden fixed inset-0 p-0 z-50 flex items-end justify-end bg-black/50 backdrop-blur-sm md:block"
        >
          <div className="rs-modal-content bg-start-card absolute bottom-0 w-full mx-auto h-[75vh] overflow-y-auto rounded-t-2xl p-6 flex flex-col items-center gap-5 md:animate-slide-up">
            <div className="flex justify-center items-center rounded-[10px] h-10 w-[90%]">
              <h2 className="text-xl px-4 py-2 mt-3 font-bold text-[#CCCCCC] rounded-xl text-right absolute right-8">
                ساخت اتاق جدید
              </h2>
              <img
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 rotate-180 absolute mt-4 left-9 mb-4 rounded-xl opacity-60 mr-auto hover:opacity-95 transition-all cursor-pointer"
                src="/BackArrow.png"
                alt="back"
              />
            </div>
            <form
              className="flex flex-col items-center w-full gap-5"
              onSubmit={(e) => {
                handleCreateRoom(e);
                setIsCreateModalOpen(false);
              }}
            >
              <input
                type="text"
                placeholder="نام اتاق را وارد کنید"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full border-0 bg-[#333333]/90 text-[#c3c3c3] text-lg px-6 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#005f73]/50 placeholder-[#CCCCCC]/70 shadow-inner"
              />
              <div className="flex w-full gap-4">
                <button
                  type="button"
                  className="flex-1 bg-[#333333]/90 text-[#CCCCCC] text-lg font-medium px-6 py-3 rounded-xl hover:bg-[#444444] transition-all duration-300"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  لغو
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ee9b00] text-white text-lg font-medium px-6 py-3 rounded-xl hover:bg-[#005f73] transition-all duration-300"
                >
                  ساخت اتاق
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* مُدال پیوستن به اتاق */}
      {isJoinModalOpen && (
        <div
          dir="rtl"
          className="rs-modal hidden fixed inset-0 p-0 z-50 flex items-end justify-end bg-black/50 backdrop-blur-sm md:block"
        >
          <div className="rs-modal-content bg-start-card absolute bottom-0 w-full mx-auto py-6 h-[75vh] overflow-y-auto rounded-t-2xl flex flex-col items-center gap-5 md:animate-slide-up">
            <div className="flex justify-center items-center rounded-[10px] h-10 w-[90%]">
              <h2 className="text-xl px-4 py-2 mt-3 font-bold text-[#CCCCCC] rounded-xl text-right absolute right-8">
                پیوستن به اتاق
              </h2>
              <img
                onClick={() => setIsJoinModalOpen(false)}
                className="w-8 rotate-180 absolute mt-4 left-9 mb-4 rounded-xl opacity-60 mr-auto hover:opacity-95 transition-all cursor-pointer"
                src="/BackArrow.png"
                alt="back"
              />
            </div>

            <form
              className="flex flex-col items-center w-full gap-5 px-6"
              onSubmit={(e) => {
                HandleNavigateToRoom(e);
                setIsJoinModalOpen(false);
              }}
            >
              <input
                type="text"
                placeholder="لینک اتاق را وارد کنید"
                value={roomJoinName}
                onChange={(e) => setRoomJoinName(e.target.value)}
                className="w-full border-0 bg-[#333333]/90 text-[#c3c3c3] text-lg px-6 py-3 rounded-xl focus:outline-none focus:ring-4 focus:ring-[#005f73]/50 placeholder-[#CCCCCC]/70 shadow-inner"
              />
              <div className="flex w-full gap-4">
                <button
                  type="button"
                  className="flex-1 bg-[#333333]/90 text-[#CCCCCC] text-lg font-medium px-6 py-3 rounded-xl hover:bg-[#444444] transition-all duration-300"
                  onClick={() => setIsJoinModalOpen(false)}
                >
                  لغو
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#ee9b00] text-white text-lg font-medium px-6 py-3 rounded-xl hover:bg-[#005f73] transition-all duration-300"
                >
                  پیوستن
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showInstallButton && (
        <div className="fixed bottom-4 md:bottom-20 left-4 right-4 mx-auto max-w-md bg-white dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-2xl shadow-xl p-4 flex items-center justify-between space-x-4 animate-fade-in">
          <div className="flex-1 text-sm text-slate-900 dark:text-white">
            آیا مایل به نصب برنامه روی دستگاه هستید؟
          </div>
          <div className="flex space-x-2">
            <button
              onClick={handleInstallClick}
              className="bg-orange-500 hover:bg-orange-600 text-white text-sm px-3 py-1 rounded-xl transition"
            >
              نصب برنامه
            </button>
            <button
              onClick={handleDismissClick}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-sm px-3 py-1 rounded-xl transition"
            >
              بعدا
            </button>
          </div>
        </div>
      )}

      {err && showError && (
        <div
          dir="rtl"
          className="suggestLinkk md:w-[85%] top-3 left-[37rem] md:left-8 md:top-[1rem] absolute px-4 py-2 rounded-lg bg-alert-errr shadow-md w-[24rem]"
        >
          <div className="container gap-2">
            <h1 className="text-lg font-semibold mb-2 md:text-[17px]">خطا:</h1>
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
    </main>
  );
}
