import React from "react";

export default function Terms({ setCurrentSetting }) {
  return (
    <div dir="rtl" className="mx-auto  w-[100%] h-[100%]  shadow-lg px-5 py-4">
      <img
        onClick={() => setCurrentSetting("main")}
        className="w-8 rotate-180 rounded-xl opacity-60 mr-auto hover:opacity-95 transition-all cursor-pointer"
        src="/BackArrow.png"
        alt="back"
      />
      {/* عنوان بخش */}
      <div className="flex items-center mb-6">
        <i className="fas fa-file-contract text-2xl text-blue-600 ml-3"></i>
        <h1 className="text-2xl font-bold text-gray-300">شرایط و قوانین</h1>
      </div>

      {/* متن قوانین */}
      <div className="space-y-4">
        {/* قانون ۱ */}
        <div className="flex items-start">
          <img src="/verified.png" alt="ver" className="w-5 mt-2 mx-2" />
          <p className="text-gray-400">
            کاربران موظفند از اطلاعات شخصی خود محافظت کنند و آن را در اختیار
            دیگران قرار ندهند.
          </p>
        </div>

        {/* قانون ۲ */}
        <div className="flex items-start">
          <img src="/verified.png" alt="ver" className="w-5 mt-2 mx-2" />
          <p className="text-gray-400">
            هرگونه سوء‌استفاده از پلتفرم ممنوع است و منجر به مسدودی حساب کاربری
            می‌شود.
          </p>
        </div>

        {/* قانون ۴ */}
        <div className="flex items-start">
          <img src="/verified.png" alt="ver" className="w-5 mt-2 mx-2" />
          <p className="text-gray-400">
            در صورت مشاهده هرگونه مشکل یا باگ، آن را از طریق پشتیبانی گزارش
            دهید.
          </p>
        </div>

        {/* قانون ۵ */}
        <div className="flex items-start">
          <img src="/verified.png" alt="ver" className="w-5 mt-2 mx-2" />
          <p className="text-gray-400">
            پیام ها هر ماه و اتاق ها هر روز به صورت خودکار پاک می شوند لطفا از
            اطلاعات مهم خود مواظبت کنید.
          </p>
        </div>

        {/* قانون ۶ */}
        <div className="flex items-start">
          <img src="/verified.png" alt="ver" className="w-5 mt-2 mx-2" />
          <p className="text-gray-400">
            کاربران موظفند قوانین و مقررات را به‌طور کامل مطالعه و رعایت کنند.
          </p>
        </div>
      </div>

      {/* دکمه بستن (اختیاری) */}
      <button
        onClick={() => setCurrentSetting("main")}
        className="mt-8 w-full bg-blue-600 text-white flex justify-center items-center py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
      >
        بستن
        <i className="fas fa-times mr-2 "></i>
      </button>
    </div>
  );
}
