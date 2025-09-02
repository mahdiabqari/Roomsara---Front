import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { FaComments, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { motion } from "framer-motion";

const AudioCall = ({
  setPeerConnect,
  roomId,
  userId,
  socket,
  setErr,
  setShowChatMD,
  showChatMD,
  users,
  api,
  noneprofile,
  mutedUsers,
}) => {
  const [peerId, setPeerId] = useState("");
  const [peers, setPeers] = useState({});
  const [isMicOn, setIsMicOn] = useState(true);
  const peerInstance = useRef(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const localStreamRef = useRef(null);
  const audioRefs = useRef({});
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const retryCount = useRef(0);
  const retryTimer = useRef(null);

  const iceServers = [
    // اکانت اول Xirsys
    {
      urls: ["stun:fr-turn8.xirsys.com"],
    },
    {
      urls: [
        "turn:fr-turn8.xirsys.com:80?transport=udp",
        "turn:fr-turn8.xirsys.com:3478?transport=udp",
        "turn:fr-turn8.xirsys.com:80?transport=tcp",
        "turn:fr-turn8.xirsys.com:3478?transport=tcp",
        "turns:fr-turn8.xirsys.com:443?transport=tcp",
        "turns:fr-turn8.xirsys.com:5349?transport=tcp",
      ],
      username:
        "huQdYD_2fypk-VGdH8acPeDPWJ3s5htqFWSjgadLAi2L1Rw5venRj7m4Mu_co89QAAAAAGe-_mJyb29tc2FyYQ==",
      credential: "e651e106-f436-11ef-b9cd-0242ac120004",
    },
    // سرورهای Metered.ca
    {
      urls: ["stun:stun.relay.metered.ca:80"],
    },
    {
      urls: [
        "turn:global.relay.metered.ca:80",
        "turn:global.relay.metered.ca:80?transport=tcp",
        "turn:global.relay.metered.ca:443",
        "turns:global.relay.metered.ca:443?transport=tcp",
      ],
      username: "a793621ac26ee7573fda62f2",
      credential: "vpvqnTszBScTGwzl",
    },
    // اکانت دوم Xirsys
    {
      urls: ["stun:fr-turn2.xirsys.com"],
    },
    {
      urls: [
        "turn:fr-turn2.xirsys.com:80?transport=udp",
        "turn:fr-turn2.xirsys.com:3478?transport=udp",
        "turn:fr-turn2.xirsys.com:80?transport=tcp",
        "turn:fr-turn2.xirsys.com:3478?transport=tcp",
        "turns:fr-turn2.xirsys.com:443?transport=tcp",
        "turns:fr-turn2.xirsys.com:5349?transport=tcp",
      ],
      username:
        "3usWtzxiR1GgNSEa3Cv4E2iYWy64x9h8qoTYIqYHdMu3iE4oP712wTDvGZYpz1moAAAAAGe_R-RtYWhkaWFicWFyaQ==",
      credential: "b6bc0f4e-f462-11ef-91ed-0242ac120004",
    },
    // سرورهای Metered.ca (اکانت دوم)
    {
      urls: ["stun:stun.relay.metered.ca:80"],
    },
    {
      urls: [
        "turn:global.relay.metered.ca:80",
        "turn:global.relay.metered.ca:80?transport=tcp",
        "turn:global.relay.metered.ca:443",
        "turns:global.relay.metered.ca:443?transport=tcp",
      ],
      username: "42c12eb104f76fd9267244f3",
      credential: "voME4hW5cqjcDTO+",
    },
  ];

  const setupVoiceDetection = (stream) => {
    audioContextRef.current = new (window.AudioContext ||
      window.webkitAudioContext)();
    analyserRef.current = audioContextRef.current.createAnalyser();
    const source = audioContextRef.current.createMediaStreamSource(stream);
    source.connect(analyserRef.current);
    analyserRef.current.fftSize = 2048;
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const checkVoice = () => {
      analyserRef.current.getByteFrequencyData(dataArray);
      const average =
        dataArray.reduce((sum, val) => sum + val, 0) / dataArray.length;
      setIsSpeaking(average > 10 && isMicOn); // آستانه صدا
      requestAnimationFrame(checkVoice);
    };
    checkVoice();
  };

  const createPeer = () => {
    cleanup();
    const peer = new Peer(undefined, {
      config: { iceServers },
    });

    peer.on("error", (error) => {
      setErr({ message: "خطا در برقراری ارتباط صوتی" });
      handleRetry();
    });

    peer.on("iceConnectionStateChange", (state) => {
      if (state === "failed" || state === "disconnected") {
        handleRetry();
      }
    });

    return peer;
  };

  // مدیریت تلاش مجدد برای اتصال
  const handleRetry = () => {
    if (retryCount.current >= 3) {
      setErr({ message: "ارتباط صوتی برقرار نشد!" });
      return;
    }

    retryCount.current += 1;
    console.log(`🔄 Retrying connection... (Attempt ${retryCount.current})`);

    retryTimer.current = setTimeout(() => {
      initializeConnection();
    }, 2000 * retryCount.current); // تاخیر تصاعدی
  };

  // راه‌اندازی اولیه اتصال
  const initializeConnection = async () => {
    try {
      peerInstance.current = createPeer();
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 8000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      localStreamRef.current = stream;
      setupVoiceDetection(stream);
      setupEventListeners();
      setPeerConnect(false);
      retryCount.current = 0;

      // چک کردن وضعیت میوت کاربر
      if (mutedUsers[userId]) {
        localStreamRef.current
          .getAudioTracks()
          .forEach((track) => (track.enabled = false));
        setIsMicOn(false);
      } else {
        localStreamRef.current
          .getAudioTracks()
          .forEach((track) => (track.enabled = true));
        setIsMicOn(true);
      }
    } catch (error) {
      console.error("❌ Initialization Error:", error);
      handleRetry();
    }
  };

  // تنظیم رویدادهای Peer
  const setupEventListeners = () => {
    const peer = peerInstance.current;

    peer.on("open", (id) => {
      console.log("🔹 Peer ID:", id);
      setPeerId(id);
      socket.emit("peer_id", { roomId, userId, peerId: id });
    });

    peer.on("call", (call) => {
      call.answer(localStreamRef.current);
      call.on("stream", (remoteStream) =>
        handleRemoteStream(call.peer, remoteStream)
      );
    });

    socket.on("peer_id", ({ senderId, peerId }) => {
      if (senderId !== userId) {
        connectToPeer(peerId);
      }
    });
  };

  // اتصال به یک Peer جدید
  const connectToPeer = (peerId) => {
    if (!peers[peerId] && localStreamRef.current) {
      const call = peerInstance.current.call(peerId, localStreamRef.current);
      call.on("stream", (remoteStream) =>
        handleRemoteStream(peerId, remoteStream)
      );
      setPeers((prev) => ({ ...prev, [peerId]: call }));
    }
  };

  // مدیریت استریم‌های دریافتی
  const handleRemoteStream = (peerId, remoteStream) => {
    if (!audioRefs.current[peerId]) {
      const audio = new Audio();
      audio.srcObject = remoteStream;
      audio.autoplay = true;
      audioRefs.current[peerId] = audio;

      audio.play().catch((error) => {
        audio.muted = true;
        audio.play();
      });
    }
  };

  // پاکسازی منابع
  const cleanup = () => {
    if (peerInstance.current) {
      peerInstance.current.destroy();
      peerInstance.current = null;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    Object.values(audioRefs.current).forEach((audio) => {
      audio.pause();
      audio.srcObject = null;
    });
    clearTimeout(retryTimer.current);
  };

  // کنترل میکروفون
  const toggleMic = () => {
    if (mutedUsers[userId]) {
      setErr({
        message: "میکروفون شما توسط مدیر قطع شده است",
      });
      return;
    }
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicOn((prev) => !prev);
      socket.emit("toggleMic", { roomId, userId });
    }
  };

  // شروع اتصال هنگام لود شدن کامپوننت
  useEffect(() => {
    if (roomId && userId && socket) {
      initializeConnection();
    }

    return cleanup;
  }, [roomId, userId, socket]);

  useEffect(() => {
    if (localStreamRef.current && mutedUsers[userId] !== undefined) {
      const isMuted = mutedUsers[userId];
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
      setIsMicOn(!isMuted);
    }
  }, [mutedUsers, userId]);

  return (
    <div className="relative w-full h-full">
      <div className="flex flex-col h-full">
        <div className="flex-1 p-4 md:pb-7 container flex-wrap items-center mx-auto w-full gap-4 overflow-auto">
          {users.map((user) => {
            const isCurrentUser = user.peerId === peerId;
            return (
              <motion.div
                key={user.peerId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`relative users-profile-audio rounded-xl p-3 py-7 md:py-4 flex w-[28%] md:w-[47%] flex-col items-center ${
                  isCurrentUser && isSpeaking ? "speaking" : ""
                }`}
              >
                {user.profile_image ? (
                  <img
                    src={`${api}/${user.profile_image}`}
                    alt={user.name}
                    className="w-20 h-20 rounded-full mb-3 md:mb-1 object-cover"
                  />
                ) : (
                  <img
                    src={`${noneprofile}`}
                    alt={user.name}
                    className="w-20 h-20 rounded-full mb-1 md:mb-1 object-cover"
                  />
                )}
                <span className="text-white font-medium text-center">
                  {user.name || "کاربر ناشناس"}
                </span>
                <div className="absolute top-3 right-2 flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-gray-500 animate-pulse" />
                </div>
              </motion.div>
            );
          })}
        </div>
        <div className="fixed bottom-0 left-0 right-0 md:w-full md:m-0 w-[53.5%] ml-[24.8%] flex justify-center rounded-t-[90%] gap-6 p-4 bg-black bg-opacity-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMic}
            className={`p-4 rounded-full shadow-lg transition-colors ${
              isMicOn
                ? "bg-blue-500 hover:bg-blue-600"
                : "bg-red-400 hover:bg-red-500"
            }`}
          >
            {isMicOn ? (
              <FaMicrophone className="text-2xl text-white" />
            ) : (
              <FaMicrophoneSlash className="text-2xl text-white" />
            )}
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowChatMD(!showChatMD)}
            className="p-4 rounded-full bg-slate-500 hover:bg-slate-600 shadow-lg hidden md:flex"
          >
            <FaComments className="text-2xl text-white" />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default AudioCall;
