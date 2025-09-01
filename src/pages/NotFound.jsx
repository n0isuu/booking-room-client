import React from 'react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-8">
      {/* Error Icon */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-red-800 rounded-full flex items-center justify-center shadow-lg">
          <svg 
            className="w-12 h-12 text-white" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
        </div>
      </div>

      {/* Error Code */}
      <h1 className="text-6xl font-bold text-red-800 mb-4 tracking-tight">
        404
      </h1>

      {/* Main Message */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-3 text-center">
        ไม่พบหน้าที่คุณต้องการ
      </h2>
      
      <p className="text-gray-600 text-center mb-8 leading-relaxed max-w-sm">
        ขออภัย หน้าที่คุณกำลังค้นหาไม่มีอยู่ หรือคุณอาจไม่มีสิทธิ์ในการเข้าถึง
      </p>

      {/* Decorative Elements */}
      <div className="absolute top-8 left-8 w-4 h-4 bg-red-200 rounded-full opacity-60"></div>
      <div className="absolute top-16 right-12 w-6 h-6 bg-red-100 rounded-full opacity-40"></div>
      <div className="absolute bottom-20 left-6 w-5 h-5 bg-red-300 rounded-full opacity-30"></div>
      <div className="absolute bottom-32 right-8 w-3 h-3 bg-red-400 rounded-full opacity-50"></div>

      {/* Footer */}
      <div className="absolute bottom-6 text-center">
        <p className="text-gray-400 text-sm">
          หากปัญหายังคงอยู่ กรุณาติดต่อผู้ดูแลระบบ
        </p>
      </div>
    </div>
  );
}