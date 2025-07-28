// import React, { useEffect, useState } from "react";
// import { Users, Projector, Tv, Mic, X, MapPin, Shield } from "lucide-react";
// import { DatePicker } from "rsuite";
// import "rsuite/dist/rsuite.min.css";
// import "../index.css";

// export default function Booking() {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [rooms, setRooms] = useState([]);

//   const [showModal, setShowModal] = useState(false);
//   const [selectedRoom, setSelectedRoom] = useState(null);

//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [activity, setActivity] = useState("");
//   const [booker, setBooker] = useState("");
//   const [phone, setPhone] = useState("");
//   const [attendees, setAttendees] = useState("");
//   const [specialRequests, setSpecialRequests] = useState("");

//   useEffect(() => {
//     handleSelectRoom();
//   }, [selectedDate]);

//   React.useEffect(() => {
//     const style = document.createElement("style");
//     style.textContent = `
//       .booking-container * {
//         font-family: 'TH Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
//         font-size: inherit !important;
//       }
//       .booking-title {
//         font-size: 10px !important;
//         line-height: 1.2 !important;
//       }
//       .booking-section-title {
//         font-size: 14px !important;
//         line-height: 1.3 !important;
//       }
//     `;
//     document.head.appendChild(style);
//     return () => document.head.removeChild(style);
//   }, []);

//   const handleSelectRoom = async () => {
//     try {
//       const response = await fetch(
//         "http://10.80.95.57:5001/booking-room-backend/us-central1/app/getRooms",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const result = await response.json();
//       console.log("Booking response from /getRooms:", result);
//       setRooms(result || []);
//     } catch (error) {
//       console.error("Booking error:", error);
//       alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
//     }
//   };

//   const openModal = (room) => {
//   setSelectedRoom(room);
//   setShowModal(true);
// };

// const closeModal = () => {
//   setShowModal(false);
//   setStartTime("");
//   setEndTime("");
//   setActivity("");
//   setBooker("");
//   setPhone("");
//   setAttendees("");
//   setSpecialRequests("");
// };

// const handleSubmit = async () => {
//   if (!selectedDate || !startTime || !endTime || !activity || !booker || !phone) {
//     alert("กรุณากรอกข้อมูลให้ครบ");
//     return;
//   }

//   const payload = {
//     selectedRoom: selectedRoom,
//     activity,
//     date: selectedDate.toISOString().split("T")[0], // format YYYY-MM-DD
//     startTime,
//     endTime,
//     booker,
//     phone,
//     attendees: parseInt(attendees),
//     specialRequests,
//   };

//   try {
//     const res = await fetch("http://10.80.95.57:5001/booking-room-backend/us-central1/app/send-line-message", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     if (res.ok) {
//       alert("ส่งข้อมูลเรียบร้อยแล้ว");
//       closeModal();
//     } else {
//       alert("ส่งข้อมูลไม่สำเร็จ");
//     }
//   } catch (error) {
//     console.error("Submit error:", error);
//     alert("เกิดข้อผิดพลาด");
//   }
// };


//   return (
//     <div className="min-h-screen bg-gray-50">
//       <header className="bg-[#A12B30] text-white p-4 flex items-center">
//         <img
//           src="src/assets/pollaw-buu.-logo.png"
//           alt="BUU BOOK Logo"
//           width={48}
//           height={48}
//           className="rounded-full mr-3 object-cover"
//         />
//         <h1
//           className="booking-title font-semibold text-white"
//           style={{
//             transform: "scale(0.75)",
//             transformOrigin: "left",
//             fontSize: "24px !important",
//           }}
//         >
//           จองห้องประชุม
//         </h1>
//       </header>

//       <main className="p-4 space-y-6 max-w-5xl mx-auto">
//         {/* Date Selection */}
//         <section className="bg-white rounded-lg p-4 shadow-sm">
//           <h2 className="booking-section-title font-semibold text-gray-800 mb-3">
//             เลือกวันที่
//           </h2>
//           <DatePicker
//             format="dd/MM/yyyy"
//             oneTap
//             onChange={(date) => setSelectedDate(date)}
//             placeholder="เลือกวันที่"
//             block
//           />
//         </section>

//         {/* Room Selection */}
//         <section>
//           <h2 className="booking-section-title font-semibold text-gray-800 mb-4">
//             เลือกห้องประชุม
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//             {rooms.map((room) => (
//               <div
//                 key={room.roomID}
//                 className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
//               >
//                 {/* Room Image */}
//                 <div className="h-48 bg-gray-200 relative">
//                   <img
//                     src={room.picture}
//                     alt={room.name}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>

//                 {/* Room Details */}
//                 <div className="p-4 flex flex-col flex-grow">
//                   <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
//                     {room.name}
//                   </h3>

//                   <div className="text-sm text-gray-600 mb-1 flex items-center">
//                     <span className="mr-2">📍</span> {room.location}
//                   </div>

//                   <div className="text-sm text-gray-600 mb-2 flex items-center">
//                     <Users className="w-4 h-4 mr-2" />
//                     ความจุ: {room.capacity} ที่
//                   </div>

//                   <div className="space-y-1 mb-4 text-sm">
//                     {room.projector && (
//                       <div className="flex items-center text-gray-600">
//                         <Projector className="w-4 h-4 mr-2" />
//                         <span>Projector</span>
//                       </div>
//                     )}
//                     {room.TV && (
//                       <div className="flex items-center text-gray-600">
//                         <Tv className="w-4 h-4 mr-2" />
//                         <span>TV</span>
//                       </div>
//                     )}
//                     {room.mic && (
//                       <div className="flex items-center text-gray-600">
//                         <Mic className="w-4 h-4 mr-2" />
//                         <span>Microphone</span>
//                       </div>
//                     )}
//                   </div>

//                   <button
//                     onClick={() => openModal(room)}
//                     className="mt-auto w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
//                   >
//                     เลือกห้องนี้
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>
//       </main>
//       {showModal && selectedRoom && (
//   <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
//     <div className="bg-white max-w-md w-full rounded-lg overflow-y-auto max-h-screen relative">
//       <div className="relative">
//         <img src={selectedRoom.picture} alt="Room" className="w-full h-48 object-cover rounded-t-lg" />
//         <button onClick={closeModal} className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2">
//           <X size={20} />
//         </button>
//       </div>

//       <div className="p-4">
//         <h1 className="text-xl font-bold text-gray-800 mb-2">{selectedRoom.name}</h1>
//         <p className="text-gray-600 mb-4">{selectedDate?.toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}</p>

//         <div className="space-y-3 mb-4">
//           <div className="flex items-center gap-3"><Users size={20} /><span>รองรับ {selectedRoom.capacity} คน</span></div>
//           <div className="flex items-center gap-3"><MapPin size={20} /><span>{selectedRoom.location}</span></div>
//           <div className="flex items-center gap-3">
//             <Shield size={20} />
//             <span>{["projector", "mic", "TV"].map(key => selectedRoom[key] ? key : null).filter(Boolean).join(", ")}</span>
//           </div>
//         </div>

//         {/* Form fields */}
//         <div className="flex gap-3 mb-4">
//           <input type="text" placeholder="เวลาเริ่ม" className="w-1/2 p-2 border rounded" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
//           <input type="text" placeholder="เวลาสิ้นสุด" className="w-1/2 p-2 border rounded" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
//         </div>
//         <input type="text" placeholder="กิจกรรม/หัวข้อ" className="w-full p-2 mb-3 border rounded" value={activity} onChange={(e) => setActivity(e.target.value)} />
//         <input type="text" placeholder="ชื่อผู้จอง" className="w-full p-2 mb-3 border rounded" value={booker} onChange={(e) => setBooker(e.target.value)} />
//         <input type="tel" placeholder="เบอร์โทรศัพท์" className="w-full p-2 mb-3 border rounded" value={phone} onChange={(e) => setPhone(e.target.value)} />
//         <input type="number" placeholder="จำนวนผู้เข้าร่วม" className="w-full p-2 mb-3 border rounded" value={attendees} onChange={(e) => setAttendees(e.target.value)} />
//         <input type="text" placeholder="ความต้องการพิเศษ (ไม่บังคับ)" className="w-full p-2 mb-5 border rounded" value={specialRequests} onChange={(e) => setSpecialRequests(e.target.value)} />

//         <button onClick={handleSubmit} className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
//           ยืนยันการจอง
//         </button>
//       </div>
//     </div>
//   </div>
// )}

//     </div>
//   );
  
// }


//---------------------------------------------------------------------------------------/////
import React, { useEffect, useState } from "react";
import { Users, Projector, Tv, Mic, X, MapPin, Shield, Check } from "lucide-react";
import { DatePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import "../index.css";

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [rooms, setRooms] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activity, setActivity] = useState("");
  const [booker, setBooker] = useState("");
  const [phone, setPhone] = useState("");
  const [attendees, setAttendees] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  useEffect(() => {
    handleSelectRoom();
  }, [selectedDate]);

  React.useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .booking-container * {
        font-family: 'TH Sarabun', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
        font-size: inherit !important;
      }
      .booking-title {
        font-size: 10px !important;
        line-height: 1.2 !important;
      }
      .booking-section-title {
        font-size: 14px !important;
        line-height: 1.3 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const handleSelectRoom = async () => {
    try {
      const response = await fetch(
        "https://us-central1-booking-room-backend.cloudfunctions.net/app/getRooms",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const result = await response.json();
      console.log("Booking response from /getRooms:", result);
      setRooms(result || []);
    } catch (error) {
      console.error("Booking error:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  const openModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setStartTime("");
    setEndTime("");
    setActivity("");
    setBooker("");
    setPhone("");
    setAttendees("");
    setSpecialRequests("");
  };

  const formatDate = (date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

  const handleSubmit = async () => {
    if (!selectedDate || !startTime || !endTime || !activity || !booker || !phone) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    console.log("Selected Date:", selectedDate);

    const payload = {
      selectedRoom: selectedRoom,
      activity,
      date: formatDate(selectedDate), // format YYYY-MM-DD
      startTime,
      endTime,
      booker,
      phone,
      attendees: parseInt(attendees),
      specialRequests,
    };

    console.log("Payload:", payload);

    try {
      const res = await fetch("https://us-central1-booking-room-backend.cloudfunctions.net/app/send-line-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setShowModal(false);
        setShowSuccessModal(true);
        // Clear form data
        setStartTime("");
        setEndTime("");
        setActivity("");
        setBooker("");
        setPhone("");
        setAttendees("");
        setSpecialRequests("");
      } else {
        alert("ส่งข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#A12B30] text-white p-4 flex items-center">
        <img
          src="src/assets/pollaw-buu.-logo.png"
          alt="BUU BOOK Logo"
          width={48}
          height={48}
          className="rounded-full mr-3 object-cover"
        />
        <h1
          className="booking-title font-semibold text-white"
          style={{
            transform: "scale(0.75)",
            transformOrigin: "left",
            fontSize: "24px !important",
          }}
        >
          จองห้องประชุม
        </h1>
      </header>

      <main className="p-4 space-y-6 max-w-5xl mx-auto">
        {/* Date Selection */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="booking-section-title font-semibold text-gray-800 mb-3">
            เลือกวันที่
          </h2>
          <DatePicker
            format="dd/MM/yyyy"
            oneTap
            onChange={(date) => setSelectedDate(date)}
            placeholder="เลือกวันที่"
            block
          />
        </section>

        {/* Room Selection */}
        <section>
          <h2 className="booking-section-title font-semibold text-gray-800 mb-4">
            เลือกห้องประชุม
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.roomID}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                {/* Room Image */}
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src={room.picture}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Room Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 mb-2 text-sm sm:text-base">
                    {room.name}
                  </h3>

                  <div className="text-sm text-gray-600 mb-1 flex items-center">
                    <span className="mr-2">📍</span> {room.location}
                  </div>

                  <div className="text-sm text-gray-600 mb-2 flex items-center">
                    <Users className="w-4 h-4 mr-2" />
                    ความจุ: {room.capacity} ที่
                  </div>

                  <div className="space-y-1 mb-4 text-sm">
                    {room.projector && (
                      <div className="flex items-center text-gray-600">
                        <Projector className="w-4 h-4 mr-2" />
                        <span>Projector</span>
                      </div>
                    )}
                    {room.TV && (
                      <div className="flex items-center text-gray-600">
                        <Tv className="w-4 h-4 mr-2" />
                        <span>TV</span>
                      </div>
                    )}
                    {room.mic && (
                      <div className="flex items-center text-gray-600">
                        <Mic className="w-4 h-4 mr-2" />
                        <span>Microphone</span>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => openModal(room)}
                    className="mt-auto w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
                  >
                    เลือกห้องนี้
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Booking Form Modal */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white max-w-md w-full rounded-lg overflow-y-auto max-h-screen relative">
            <div className="relative">
              <img src={selectedRoom.picture} alt="Room" className="w-full h-48 object-cover rounded-t-lg" />
              <button onClick={closeModal} className="absolute top-4 right-4 bg-red-500 text-white rounded-full p-2">
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <h1 className="text-xl font-bold text-gray-800 mb-2">{selectedRoom.name}</h1>
              <p className="text-gray-600 mb-4">{selectedDate?.toLocaleDateString("th-TH", { year: 'numeric', month: 'long', day: 'numeric' })}</p>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3"><Users size={20} /><span>รองรับ {selectedRoom.capacity} คน</span></div>
                <div className="flex items-center gap-3"><MapPin size={20} /><span>{selectedRoom.location}</span></div>
                <div className="flex items-center gap-3">
                  <Shield size={20} />
                  <span>{["projector", "mic", "TV"].map(key => selectedRoom[key] ? key : null).filter(Boolean).join(", ")}</span>
                </div>
              </div>

              {/* Form Header */}
              <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">รายละเอียดการจอง</h2>

              {/* Form fields with labels matching the image */}
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 font-medium mb-1">กิจกรรม/หัวข้อประชุม</label>
                  <input 
                    type="text" 
                    placeholder="เช่น ประชุมประจำเดือน"
                    className="w-full p-3 border border-gray-300 rounded-lg" 
                    value={activity} 
                    onChange={(e) => setActivity(e.target.value)} 
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">เวลาเริ่มต้น</label>
                    <input 
                      type="text" 
                      placeholder="เลือกเวลา"
                      className="w-full p-3 border border-gray-300 rounded-lg" 
                      value={startTime} 
                      onChange={(e) => setStartTime(e.target.value)} 
                    />
                  </div>
                  <div>
                    <label className="block text-gray-700 font-medium mb-1">เวลาสิ้นสุด</label>
                    <input 
                      type="text" 
                      placeholder="เลือกเวลา"
                      className="w-full p-3 border border-gray-300 rounded-lg" 
                      value={endTime} 
                      onChange={(e) => setEndTime(e.target.value)} 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">ชื่อผู้จอง</label>
                  <input 
                    type="text" 
                    placeholder="ชื่อ-นามสกุล"
                    className="w-full p-3 border border-gray-300 rounded-lg" 
                    value={booker} 
                    onChange={(e) => setBooker(e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">เบอร์โทรศัพท์</label>
                  <input 
                    type="tel" 
                    placeholder="08X-XXX-XXXX"
                    className="w-full p-3 border border-gray-300 rounded-lg" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">จำนวนผู้เข้าร่วม</label>
                  <input 
                    type="number" 
                    placeholder="สูงสุด 15 คน"
                    className="w-full p-3 border border-gray-300 rounded-lg" 
                    value={attendees} 
                    onChange={(e) => setAttendees(e.target.value)} 
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-1">ความต้องการพิเศษ (ไม่บังคับ)</label>
                  <textarea 
                    placeholder="เช่น อุปกรณ์เพิ่มเติม, การจัดโต๊ะ"
                    className="w-full p-3 border border-gray-300 rounded-lg h-20 resize-none" 
                    value={specialRequests} 
                    onChange={(e) => setSpecialRequests(e.target.value)} 
                  />
                </div>
              </div>

              <button 
                onClick={handleSubmit} 
                className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors mt-6"
              >
                ยืนยันการจอง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">จองสำเร็จ!</h3>
            <p className="text-gray-600 mb-6">ระบบได้บันทึกข้อมูลการจองของท่านแล้ว</p>
            <button 
              onClick={() => setShowSuccessModal(false)}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              เรียบร้อย
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
