import { useState } from "react";

export default function Success() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleOkClick = () => {
    setIsProcessing(true);

    if (navigator.userAgent.includes("Line")) {
      window.open("", "_self", ""); // Close the Line app
      window.close();
    }
  };

  return (
    <div
      className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen flex items-center justify-center p-4"
      style={{ fontFamily: "'Sarabun', sans-serif" }}
    >
      <div className="w-full max-w-sm mx-auto">
        <div className="bg-white rounded-3xl shadow-2xl p-8 text-center animate-fade-in">
          {/* Success Icon */}
          <div className="animate-pulse-scale mb-6">
            <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
          </div>

          {/* Success Message */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-3">
            ยกเลิกสำเร็จ
          </h1>

          <p className="text-gray-600 mb-8 leading-relaxed">
            การดำเนินการของคุณได้ถูกยกเลิกเรียบร้อยแล้ว
          </p>
        </div>
      </div>
    </div>
  );
}
