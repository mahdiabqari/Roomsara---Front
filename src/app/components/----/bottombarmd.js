import { useState } from "react";

const MobileMenu = ({
  setShowres,
  setSelectedUser,
  setShowsetting,
  setIsCreateModalOpen,
}) => {
  const [activeTab, setActiveTab] = useState("none");

  const NavigateHome = () => {
    setActiveTab("home");
    setSelectedUser(false);
    setShowsetting(false);
    setShowres(true);
  };

  const NavigateSetting = (e) => {
    setActiveTab("settings");
    setShowres(false);
    setShowsetting(true);
  };

  const NavigateMessages = () => {
    setActiveTab("messages");
    setShowres(false);
    setShowsetting(false);
  };

  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#1b2034fe] filter blur-10 shadow-lg flex justify-around items-center py-2 px-2 z-50 border-t border-[#005f73]/20">
      <li
        onClick={NavigateHome}
        className={`list-none flex flex-col cursor-pointer items-center gap-1 py-2 px-8 rounded-xl transition-all duration-300 ${
          activeTab === "home" ? "text-[#ee9b00]" : "text-[#CCCCCC]"
        }`}
      >
        <img
          src="/home.png"
          alt="home"
          className="w-8 transition-transform hover:scale-110 filter invert"
        />
      </li>

      <li
        onClick={() => setIsCreateModalOpen(true)}
        className={`list-none rs-modal-btn flex flex-col cursor-pointer items-center gap-1 py-2 px-8 rounded-xl transition-all duration-300 ${
          activeTab === "home" ? "text-[#ee9b00] " : "text-[#CCCCCC]"
        }`}
      >
        <img
          src="/add.png"
          alt="home"
          className="w-8 transition-transform hover:scale-110 filter invert"
        />
      </li>

      <li
        onClick={NavigateMessages}
        className={`list-none  flex flex-col cursor-pointer items-center gap-1 py-2 px-8 rounded-xl transition-all duration-300 ${
          activeTab === "messages" ? "text-[#ee9b00] " : "text-[#CCCCCC]"
        }`}
      >
        <img
          src="/message.png"
          alt="message"
          className="w-8 transition-transform hover:scale-110 filter invert"
        />
      </li>

      <li
        data-action="settings"
        onClick={NavigateSetting}
        className={`list-none flex flex-col cursor-pointer items-center gap-1 py-2 px-8 rounded-xl transition-all duration-300 ${
          activeTab === "settings" ? "text-[#ee9b00]" : "text-[#CCCCCC]"
        }`}
      >
        <img
          src="/setting.png"
          alt="setting"
          className="w-8 transition-transform hover:scale-110 filter invert"
        />
      </li>
    </div>
  );
};

export default MobileMenu;
