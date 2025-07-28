// //////////////////////////////////////////////////////////////////////////////////
// import React, { useEffect, useState } from "react";
// import { Users, Projector, Tv, Mic, X, MapPin, Shield, Check, ChevronDown, ChevronLeft, ChevronRight, Calendar, Phone, Mail, Clock, Bold } from "lucide-react";

// export default function Booking() {
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [rooms, setRooms] = useState([]);
//   const [showCalendar, setShowCalendar] = useState(false);
//   const [calendarDate, setCalendarDate] = useState(new Date());

//   const [showModal, setShowModal] = useState(false);
//   const [selectedRoom, setSelectedRoom] = useState(null);
//   const [showSuccessModal, setShowSuccessModal] = useState(false);
//   const [bookingsForSelectedDate, setBookingsForSelectedDate] = useState([]);

//   const [startTime, setStartTime] = useState("");
//   const [endTime, setEndTime] = useState("");
//   const [activity, setActivity] = useState("");
//   const [booker, setBooker] = useState("");
//   const [phone, setPhone] = useState("");
//   const [email, setEmail] = useState("");
//   const [attendees, setAttendees] = useState("");
//   const [specialRequests, setSpecialRequests] = useState("");

//   const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
//   const thaiDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

//   useEffect(() => {
//     handleSelectRoom();
//   }, []);

//   useEffect(() => {
//     if (selectedDate) {
//       loadBookingsForDate(selectedDate);
//     }
//   }, [selectedDate]);

//   const handleSelectRoom = async () => {
//     try {
//       const response = await fetch(
//         "https://us-central1-booking-room-backend.cloudfunctions.net/app/getRooms",
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       const result = await response.json();
//       setRooms(result || []);
//     } catch (error) {
//       console.error("Booking error:", error);
//       alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
//     }
//   };

//   const loadBookingsForDate = async (date) => {
//     if (!date) return;
//     const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
//     try {
//       // Simulate API call - replace with actual endpoint
//       // const response = await fetch(`/api/bookings?date=${dateStr}`);
//       // const bookings = await response.json();
//       setBookingsForSelectedDate([]);
//     } catch (error) {
//       console.error("Error loading bookings:", error);
//       setBookingsForSelectedDate([]);
//     }
//   };

//   const openModal = (room) => {
//     setSelectedRoom(room);
//     setShowModal(true);
//     setStartTime("");
//     setEndTime("");
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setStartTime("");
//     setEndTime("");
//     setActivity("");
//     setBooker("");
//     setPhone("");
//     setEmail("");
//     setAttendees("");
//     setSpecialRequests("");
//   };

//   const formatDate = (date) => {
//     const year = date.getFullYear();
//     const month = `${date.getMonth() + 1}`.padStart(2, "0");
//     const day = `${date.getDate()}`.padStart(2, "0");
//     return `${year}-${month}-${day}`;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!selectedDate || !startTime || !endTime || !activity || !booker || !phone) {
//       alert("กรุณากรอกข้อมูลให้ครบ");
//       return;
//     }

//     if (endTime <= startTime) {
//       alert("เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น");
//       return;
//     }

//     const payload = {
//       selectedRoom: selectedRoom,
//       activity,
//       date: formatDate(selectedDate),
//       startTime,
//       endTime,
//       booker,
//       phone,
//       email,
//       attendees: parseInt(attendees),
//       specialRequests,
//     };

//     try {
//       const res = await fetch("https://us-central1-booking-room-backend.cloudfunctions.net/app/send-line-message", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res.ok) {
//         setShowModal(false);
//         setShowSuccessModal(true);
//         closeModal();
//       } else {
//         alert("ส่งข้อมูลไม่สำเร็จ");
//       }
//     } catch (error) {
//       console.error("Submit error:", error);
//       alert("เกิดข้อผิดพลาด");
//     }
//   };

//   const generateTimeOptions = () => {
//     const options = [];
//     for (let h = 8; h <= 18; h++) {
//       for (let m of ["00", "30"]) {
//         if (h === 18 && m === "30") continue;
//         const time = `${String(h).padStart(2, "0")}:${m}`;
//         options.push(time);
//       }
//     }
//     return options;
//   };

//   const generateEndTimeOptions = (selectedStartTime) => {
//     if (!selectedStartTime) return [];
//     const options = [];
//     let startReached = false;

//     for (let h = 8; h <= 18; h++) {
//       for (let m of ["00", "30"]) {
//         const time = `${String(h).padStart(2, "0")}:${m}`;
//         if (time === selectedStartTime) {
//           startReached = true;
//           continue;
//         }
//         if (startReached) {
//           options.push(time);
//         }
//       }
//     }
//     options.push("18:00");
//     return options;
//   };

//   const renderCalendar = () => {
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     const year = calendarDate.getFullYear();
//     const month = calendarDate.getMonth();
//     const firstDayOfMonth = new Date(year, month, 1).getDay();
//     const daysInMonth = new Date(year, month + 1, 0).getDate();
//     const days = [];

//     // Empty cells for days before the first day of the month
//     for (let i = 0; i < firstDayOfMonth; i++) {
//       days.push(<div key={`empty-${i}`} className="calendar-day other-month"></div>);
//     }

//     // Days of the month
//     for (let i = 1; i <= daysInMonth; i++) {
//       const dayDate = new Date(year, month, i);
//       const isToday = dayDate.getTime() === today.getTime();
//       const isSelected = selectedDate && dayDate.getTime() === selectedDate.getTime();
//       const isPast = dayDate < today;

//       days.push(
//         <div
//           key={i}
//           className={`calendar-day ${isPast ? 'other-month' : ''} ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
//           onClick={() => {
//             if (!isPast) {
//               setSelectedDate(dayDate);
//               setShowCalendar(false);
//             }
//           }}
//         >
//           {i}
//         </div>
//       );
//     }

//     return days;
//   };

//   const formatSelectedDate = () => {
//     if (!selectedDate) return "กรุณาเลือกวันที่";
//     return `${selectedDate.getDate()} ${thaiMonths[selectedDate.getMonth()]} ${selectedDate.getFullYear() + 543}`;
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
//       <style jsx>{`
//         .calendar-day {
//           text-align: center;
//           padding: 0.75rem 0;
//           border-radius: 50%;
//           cursor: pointer;
//           transition: background-color 0.2s;
//         }
//         .calendar-day.other-month {
//           color: #cbd5e0;
//           cursor: not-allowed;
//         }
//         .calendar-day:not(.other-month):not(.header-day):hover {
//           background-color: #fee2e2;
//         }
//         .calendar-day.selected {
//           background-color: #A12B30;
//           color: white;
//           font-weight: bold;
//         }
//         .calendar-day.today {
//           background-color: #fef2f2;
//           font-weight: bold;
//         }
//         .header-day {
//           font-weight: 600;
//           color: #718096;
//           cursor: default;
//         }
//         .form-input {
//           border: none;
//           border-bottom: 2px solid #e5e7eb;
//           background-color: transparent;
//           transition: border-color 0.2s;
//         }
//         .form-input:focus {
//           outline: none;
//           border-bottom-color: #A12B30;
//         }
//       `}</style>

//       {/* Header */}
//       <header className="bg-[#A12B30] text-white p-4 flex items-center gap-4">
//         <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
//           <span className="text-[#A12B30] font-bold text-lg">B</span>
//         </div>
//         <h4 className="text-xl font-bold">ระบบจองห้องประชุม</h4>
//       </header>

//       <div className="p-4">
//         {/* Date Selection */}
//         <div className="mb-6">
//           <label className="font-semibold text-gray-700 block mb-2">1. เลือกวันที่</label>
//           <div
//             className="p-3 bg-white rounded-lg shadow-sm flex justify-between items-center cursor-pointer"
//             onClick={() => setShowCalendar(!showCalendar)}
//           >
//             <div className="flex items-center">
//               <Calendar className="w-5 h-5 mr-3 text-red-600" />
//               <span className="font-semibold text-gray-800">{formatSelectedDate()}</span>
//             </div>
//             <ChevronDown
//               className={`w-5 h-5 text-gray-500 transition-transform ${showCalendar ? 'rotate-180' : ''}`}
//             />
//           </div>

//           {/* Calendar */}
//           {showCalendar && (
//             <div className="mt-2 bg-white rounded-lg shadow-sm p-4 animate-in slide-in-from-top-2">
//               <div className="flex justify-between items-center mb-4">
//                 <button
//                   className="p-2 rounded-full hover:bg-gray-100"
//                   onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1))}
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                 </button>
//                 <h6 className="font-bold text-lg">
//                   {thaiMonths[calendarDate.getMonth()]} {calendarDate.getFullYear() + 543}
//                 </h6>
//                 <button
//                   className="p-2 rounded-full hover:bg-gray-100"
//                   onClick={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1))}
//                 >
//                   <ChevronRight className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="grid grid-cols-7 gap-2">
//                 {thaiDays.map(day => (
//                   <div key={day} className="calendar-day header-day">{day}</div>
//                 ))}
//                 {renderCalendar()}
//               </div>
//             </div>
//           )}
//         </div>

//         {/* Room Selection */}
//         <div>
//           <label className="font-semibold text-gray-700 block mb-4">2. เลือกห้องประชุม</label>

//           {!selectedDate ? (
//             <p className="text-center text-gray-500 p-4">กรุณาเลือกวันที่เพื่อแสดงห้องประชุม</p>
//           ) : (
//             <div className="space-y-4">
//               {rooms.map((room) => (
//                 <div key={room.roomID} className="bg-white rounded-xl shadow-md overflow-hidden">
//                   <img
//                     src={room.picture || `https://placehold.co/600x300/e2e8f0/4a5568?text=${encodeURIComponent(room.name)}`}
//                     alt={`รูปห้องประชุม ${room.name}`}
//                     className="w-full h-32 object-cover"
//                   />

//                   <div className="p-4">
//                     <h5 className="font-bold text-lg mb-1">{room.name}</h5>
//                     <p className="text-sm text-gray-600 mb-1 flex items-center">
//                       <MapPin className="w-4 h-4 mr-1" />
//                       {room.location}
//                     </p>
//                     <p className="text-sm text-gray-600 mb-2 flex items-center">
//                       <Users className="w-4 h-4 mr-1" />
//                       ความจุสูงสุด {room.capacity} คน
//                     </p>

//                     <div className="mt-2 pt-2 border-t border-gray-100 flex items-center text-gray-600 text-sm">
//                       {room.TV && <span className="mr-4 flex items-center"><Tv className="w-4 h-4 mr-1" />TV</span>}
//                       {room.mic && <span className="mr-4 flex items-center"><Mic className="w-4 h-4 mr-1" />Mic</span>}
//                       {room.projector && <span className="mr-4 flex items-center"><Projector className="w-4 h-4 mr-1" />Projector</span>}
//                       {!room.TV && !room.mic && !room.projector && <span>ไม่มีสิ่งอำนวยความสะดวกเพิ่มเติม</span>}
//                     </div>

//                     <button
//                       onClick={() => openModal(room)}
//                       className="w-full mt-4 py-2 rounded-lg font-semibold bg-red-700"
//                       style={{ color: "white", transition: "background-color 0.2s", marginTop: "0.5rem", borderRadius: "0.5rem"}}
//                     >
//                       <b>เลือกห้องนี้</b>
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Booking Form Modal */}
//       {showModal && selectedRoom && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
//           <div className="bg-white w-full max-w-md max-h-[90vh] rounded-2xl flex flex-direction-column overflow-hidden">
//             {/* Modal Header */}
//             <div className="p-4 border-b flex justify-between items-center">
//               <h2 className="text-lg font-bold text-gray-800">รายละเอียดการจอง</h2>
//               <button onClick={closeModal} className="text-gray-400 hover:text-gray-800 text-2xl">
//                 <X size={24} />
//               </button>
//             </div>

//             {/* Modal Content */}
//             <div className="p-6 flex-grow overflow-y-auto">
//               <div className="mb-6">
//                 <p className="font-bold text-gray-800 text-xl">{selectedRoom.name}</p>
//                 <p className="text-sm text-gray-500">วันที่ {formatSelectedDate()}</p>
//               </div>

//               <div className="space-y-6">
//                 <div className="relative pt-4">
//                   <label className="text-gray-700 text-sm block mb-1">กิจกรรม/หัวข้อประชุม</label>
//                   <input
//                     type="text"
//                     placeholder="เช่น ประชุมประจำเดือน"
//                     className="form-input w-full p-2"
//                     value={activity}
//                     onChange={(e) => setActivity(e.target.value)}
//                     required={true}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-6">
//                   <div className="relative pt-4">
//                     <label className="text-gray-700 text-sm block mb-1">เวลาเริ่มต้น</label>
//                     <select
//                       className="form-input w-full p-2"
//                       value={startTime}
//                       onChange={(e) => {
//                         setStartTime(e.target.value);
//                         setEndTime(""); // Reset end time when start time changes
//                       }}
//                       required={true}
//                     >
//                       <option value="">เลือกเวลา</option>
//                       {generateTimeOptions().map(time => (
//                         <option key={time} value={time}>{time}</option>
//                       ))}
//                     </select>
//                   </div>
//                   <div className="relative pt-4">
//                     <label className="text-gray-700 text-sm block mb-1">เวลาสิ้นสุด</label>
//                     <select
//                       className="form-input w-full p-2"
//                       value={endTime}
//                       onChange={(e) => setEndTime(e.target.value)}
//                       disabled={!startTime}
//                       required={true}
//                     >
//                       <option value="">{startTime ? "เลือกเวลา" : "กรุณาเลือกเวลาเริ่มต้นก่อน"}</option>
//                       {generateEndTimeOptions(startTime).map(time => (
//                         <option key={time} value={time}>{time}</option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>

//                 <div className="relative pt-4">
//                   <label className="text-gray-700 text-sm block mb-1">ชื่อผู้จอง</label>
//                   <input
//                     type="text"
//                     placeholder="ชื่อ-นามสกุล"
//                     className="form-input w-full p-2"
//                     value={booker}
//                     onChange={(e) => setBooker(e.target.value)}
//                     required={true}
//                   />
//                 </div>

//                 <div className="relative pt-4">
//                   <label className="text-gray-700 text-sm block mb-1">เบอร์โทรศัพท์</label>
//                   <input
//                     type="tel"
//                     placeholder="08X-XXX-XXXX"
//                     className="form-input w-full p-2"
//                     value={phone}
//                     onChange={(e) => setPhone(e.target.value)}
//                     required={true}
//                   />
//                 </div>

//                 <div className="relative pt-4">
//                   <label className="text-gray-700 text-sm block mb-1">อีเมล (ไม่บังคับ)</label>
//                   <input
//                     type="email"
//                     placeholder="example@email.com"
//                     className="form-input w-full p-2"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                   />
//                 </div>

//                 <div className="relative pt-4">
//                   <label className="text-gray-700 text-sm block mb-1">จำนวนผู้เข้าร่วม</label>
//                   <input
//                     type="number"
//                     placeholder={`สูงสุด ${selectedRoom.capacity} คน`}
//                     className="form-input w-full p-2"
//                     value={attendees}
//                     onChange={(e) => setAttendees(e.target.value)}
//                     min="1"
//                     max={selectedRoom.capacity}
//                     required={true}
//                   />
//                 </div>

//                 <div className="relative pt-4">
//                   <label className="text-gray-700 text-sm block mb-1">ความต้องการพิเศษ (ไม่บังคับ)</label>
//                   <input
//                     type="text"
//                     placeholder="เช่น ขอโปรเจคเตอร์, ปากกาไวท์บอร์ด"
//                     className="form-input w-full p-2"
//                     value={specialRequests}
//                     onChange={(e) => setSpecialRequests(e.target.value)}
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* Modal Footer */}
//             <div className="p-4 border-t">
//               <button
//                 onClick={handleSubmit}
//                 className="w-full bg-[#A12B30] text-white py-3 rounded-lg font-semibold hover:bg-[#921911] transition-colors"
//               >
//                 ยืนยันการจอง
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Success Modal */}
//       {showSuccessModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
//           <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
//             <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Check className="w-8 h-8 text-green-600" />
//             </div>
//             <h3 className="text-2xl font-bold text-gray-800 mb-2">จองสำเร็จ!</h3>
//             <p className="text-gray-600 mb-6">ระบบได้บันทึกข้อมูลการจองของท่านเรียบร้อยแล้ว</p>
//             <button
//               onClick={() => setShowSuccessModal(false)}
//               className="w-full bg-[#A12B30] text-white py-2 rounded-lg font-semibold hover:bg-[#921911] transition-colors"
//             >
//               ปิด
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  Users,
  Projector,
  Tv,
  Mic,
  X,
  MapPin,
  Shield,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
  Mail,
  Clock,
  Bold,
} from "lucide-react";

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  // const [setBookingsForSelectedDate] = useState([]);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activity, setActivity] = useState("");
  const [booker, setBooker] = useState("");
  const [phone, setPhone] = useState("");
  const [attendees, setAttendees] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];
  const thaiDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  useEffect(() => {
    handleSelectRoom();
  }, []);

  // useEffect(() => {
  //   if (selectedDate) {
  //     loadBookingsForDate(selectedDate);
  //   }
  // }, [selectedDate]);

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
      setRooms(result || []);
    } catch (error) {
      console.error("Booking error:", error);
      alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
    }
  };

  // const loadBookingsForDate = async (date) => {
  //   if (!date) return;
  //   // const dateStr = `${date.getFullYear()}-${String(
  //   //   date.getMonth() + 1
  //   // ).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  //   try {
  //     // Simulate API call - replace with actual endpoint
  //     // const response = await fetch(`/api/bookings?date=${dateStr}`);
  //     // const bookings = await response.json();
  //     setBookingsForSelectedDate([]);
  //   } catch (error) {
  //     console.error("Error loading bookings:", error);
  //     setBookingsForSelectedDate([]);
  //   }
  // };

  const openModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setStartTime("");
    setEndTime("");
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !selectedDate ||
      !startTime ||
      !endTime ||
      !activity ||
      !booker ||
      !phone
    ) {
      alert("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    if (endTime <= startTime) {
      alert("เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น");
      return;
    }

    const payload = {
      selectedRoom: selectedRoom,
      activity,
      date: formatDate(selectedDate),
      startTime,
      endTime,
      booker,
      phone,
      attendees: parseInt(attendees),
      specialRequests,
    };

    try {
      const res = await fetch(
        "https://us-central1-booking-room-backend.cloudfunctions.net/app/send-line-message",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (res.ok) {
        setShowModal(false);
        setShowSuccessModal(true);
        closeModal();
      } else {
        alert("ส่งข้อมูลไม่สำเร็จ");
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("เกิดข้อผิดพลาด");
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let h = 8; h <= 18; h++) {
      for (let m of ["00", "30"]) {
        if (h === 18 && m === "30") continue;
        const time = `${String(h).padStart(2, "0")}:${m}`;
        options.push(time);
      }
    }
    return options;
  };

  const generateEndTimeOptions = (selectedStartTime) => {
    if (!selectedStartTime) return [];
    const options = [];
    let startReached = false;

    for (let h = 8; h <= 18; h++) {
      for (let m of ["00", "30"]) {
        const time = `${String(h).padStart(2, "0")}:${m}`;
        if (time === selectedStartTime) {
          startReached = true;
          continue;
        }
        if (startReached) {
          options.push(time);
        }
      }
    }
    options.push("18:00");
    return options;
  };

  const renderCalendar = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day other-month"></div>
      );
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      const isToday = dayDate.getTime() === today.getTime();
      const isSelected =
        selectedDate && dayDate.getTime() === selectedDate.getTime();
      const isPast = dayDate < today;

      days.push(
        <div
          key={i}
          className={`calendar-day ${isPast ? "other-month" : ""} ${
            isSelected ? "selected" : ""
          } ${isToday ? "today" : ""}`}
          onClick={() => {
            if (!isPast) {
              setSelectedDate(dayDate);
              setShowCalendar(false);
            }
          }}
        >
          {i}
        </div>
      );
    }

    return days;
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return "กรุณาเลือกวันที่";
    return `${selectedDate.getDate()} ${thaiMonths[selectedDate.getMonth()]} ${
      selectedDate.getFullYear() + 543
    }`;
  };

  return (
    <div className="min-h-screen bg-gray-50 max-w-md mx-auto">
      <style jsx>{`
        .calendar-day {
          text-align: center;
          padding: 0.75rem 0;
          border-radius: 50%;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        .calendar-day.other-month {
          color: #cbd5e0;
          cursor: not-allowed;
        }
        .calendar-day:not(.other-month):not(.header-day):hover {
          background-color: #fee2e2;
        }
        .calendar-day.selected {
          background-color: #A12B30;
          color: white;
          font-weight: bold;
        }
        .calendar-day.today {
          background-color: #fef2f2;
          font-weight: bold;
        }
        .header-day {
          font-weight: 600;
          color: #718096;
          cursor: default;
        }
        .form-input {
          border: none;
          border-bottom: 2px solid #e5e7eb;
          background-color: transparent;
          transition: border-color 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-bottom-color: #A12B30;
        }
      `}</style>

      {/* Header */}
      <header className="bg-[#A12B30] text-white p-4 flex items-center gap-4">
        <div className="w-10 h-10 bg-white rounded-full overflow-hidden flex items-center justify-center">
          <img
            src="https://cdn-b.heylink.me/media/users/og_image/b67194e53285485b9c71322c8e1605f5.webp"
            alt="Logo"
            className="w-8 h-8 object-contain"
          />
        </div>
        <h4 className="text-xl font-bold">ระบบจองห้องประชุม</h4>
      </header>

      <div className="p-4">
        {/* Date Selection */}
        <div className="mb-6">
          <label className="font-semibold text-gray-700 block mb-2">
            1. เลือกวันที่
          </label>
          <div
            className="p-3 bg-white rounded-lg shadow-sm flex justify-between items-center cursor-pointer"
            onClick={() => setShowCalendar(!showCalendar)}
          >
            <div className="flex items-center">
              <Calendar className="w-5 h-5 mr-3 text-red-600" />
              <span className="font-semibold text-gray-800">
                {formatSelectedDate()}
              </span>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-gray-500 transition-transform ${
                showCalendar ? "rotate-180" : ""
              }`}
            />
          </div>

          {/* Calendar */}
          {showCalendar && (
            <div className=" mt-2 bg-white rounded-lg shadow-sm p-4 animate-in slide-in-from-top-2">
              <div className="flex justify-between items-center mb-4">
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() =>
                    setCalendarDate(
                      new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() - 1
                      )
                    )
                  }
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h6 className="font-bold text-lg">
                  {thaiMonths[calendarDate.getMonth()]}{" "}
                  {calendarDate.getFullYear() + 543}
                </h6>
                <button
                  className="p-2 rounded-full hover:bg-gray-100"
                  onClick={() =>
                    setCalendarDate(
                      new Date(
                        calendarDate.getFullYear(),
                        calendarDate.getMonth() + 1
                      )
                    )
                  }
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-2">
                {thaiDays.map((day) => (
                  <div key={day} className="calendar-day header-day">
                    {day}
                  </div>
                ))}
                {renderCalendar()}
              </div>
            </div>
          )}
        </div>

        {/* Room Selection */}
        <div>
          <label className="font-semibold text-gray-700 block mb-4">
            2. เลือกห้องประชุม
          </label>

          {!selectedDate ? (
            <p className="text-center text-gray-500 p-4">
              กรุณาเลือกวันที่เพื่อแสดงห้องประชุม
            </p>
          ) : (
            <div className="space-y-4">
              {rooms.map((room) => (
                <div
                  key={room.roomID}
                  className="bg-white rounded-xl shadow-md overflow-hidden"
                >
                  <img
                    src={
                      room.picture ||
                      `https://placehold.co/600x300/e2e8f0/4a5568?text=${encodeURIComponent(
                        room.name
                      )}`
                    }
                    alt={`รูปห้องประชุม ${room.name}`}
                    className="w-full h-32 object-cover"
                  />

                  <div className="p-4">
                    <h5 className="font-bold text-lg mb-1">{room.name}</h5>
                    <p className="text-sm text-gray-600 mb-1 flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {room.location}
                    </p>
                    <p className="text-sm text-gray-600 mb-2 flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      ความจุสูงสุด {room.capacity} คน
                    </p>

                    <div className="mt-2 pt-2 border-t border-gray-100 flex items-center text-gray-600 text-sm">
                      {room.TV && (
                        <span className="mr-4 flex items-center">
                          <Tv className="w-4 h-4 mr-1" />
                          TV
                        </span>
                      )}
                      {room.mic && (
                        <span className="mr-4 flex items-center">
                          <Mic className="w-4 h-4 mr-1" />
                          Mic
                        </span>
                      )}
                      {room.projector && (
                        <span className="mr-4 flex items-center">
                          <Projector className="w-4 h-4 mr-1" />
                          Projector
                        </span>
                      )}
                      {!room.TV && !room.mic && !room.projector && (
                        <span>ไม่มีสิ่งอำนวยความสะดวกเพิ่มเติม</span>
                      )}
                    </div>

                    <button
                      onClick={() => openModal(room)}
                      className="bg-[#A12B30] w-full mt-4 py-2 rounded-lg font-semibold bg-red-700"
                      style={{
                        color: "white",
                        transition: "background-color 0.2s",
                        marginTop: "0.5rem",
                        borderRadius: "0.5rem",
                        backgroundColor: "#A12B30",
                      }}
                    >
                      <b>เลือกห้องนี้</b>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showModal && selectedRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md max-h-[90vh] rounded-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h4 className="text-lg font-bold text-gray-800">
                รายละเอียดการจอง
              </h4>
              <button
                onClick={closeModal}
                className="text-gray-100 hover:text-gray-800 text-2xl"
              >
                <X size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="mb-6">
                <p className="font-bold text-gray-800 text-xl">
                  {selectedRoom.name}
                </p>
                <p className="text-sm text-gray-500">
                  วันที่ {formatSelectedDate()}
                </p>
              </div>

              <div className="space-y-6">
                {/* กิจกรรม/หัวข้อประชุม */}
                <div className="relative pt-4">
                  <label className="text-gray-700 text-sm block mb-1">
                    กิจกรรม/หัวข้อประชุม
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ประชุมประจำเดือน"
                    className="form-input w-full p-2"
                    value={activity}
                    onChange={(e) => setActivity(e.target.value)}
                    required={true}
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  {/* เวลาเริ่มต้น */}
                  <div className="w-1/2">
                    <label className="text-gray-700 text-sm block mb-1">
                      เวลาเริ่มต้น
                    </label>
                    <select
                      className="form-input w-full p-2"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        setEndTime(""); // Reset end time when start time changes
                      }}
                      required={true}
                    >
                      <option value="">เลือกเวลา</option>
                      {generateTimeOptions().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* เวลาสิ้นสุด */}
                  <div className="w-1/2">
                    <label className="text-gray-700 text-sm block mb-1">
                      เวลาสิ้นสุด
                    </label>
                    <select
                      className="form-input w-full p-2"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      disabled={!startTime}
                      required={true}
                    >
                      <option value="">
                        {startTime ? "เลือกเวลา" : "กรุณาเลือกเวลาเริ่มต้นก่อน"}
                      </option>
                      {generateEndTimeOptions(startTime).map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ชื่อผู้จอง */}
                <div className="relative pt-4">
                  <label className="text-gray-700 text-sm block mb-1">
                    ชื่อผู้จอง
                  </label>
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    className="form-input w-full p-2"
                    value={booker}
                    onChange={(e) => setBooker(e.target.value)}
                    required={true}
                  />
                </div>

                {/* เบอร์โทรศัพท์ */}
                <div className="relative pt-4">
                  <label className="text-gray-700 text-sm block mb-1">
                    เบอร์โทรศัพท์
                  </label>
                  <input
                    type="tel"
                    placeholder="08X-XXX-XXXX"
                    className="form-input w-full p-2"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required={true}
                  />
                </div>

                {/* จำนวนผู้เข้าร่วม */}
                <div className="relative pt-4">
                  <label className="text-gray-700 text-sm block mb-1">
                    จำนวนผู้เข้าร่วม
                  </label>
                  <input
                    type="number"
                    placeholder={`สูงสุด ${selectedRoom.capacity} คน`}
                    className="form-input w-full p-2"
                    value={attendees}
                    onChange={(e) => setAttendees(e.target.value)}
                    min="1"
                    max={selectedRoom.capacity}
                    required={true}
                  />
                </div>

                {/* ความต้องการพิเศษ */}
                <div className="relative pt-4">
                  <label className="text-gray-700 text-sm block mb-1">
                    ความต้องการพิเศษ (ไม่บังคับ)
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ขอโปรเจคเตอร์, ปากกาไวท์บอร์ด"
                    className="form-input w-full p-2"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                className="w-full mt-4 py-2 rounded-lg font-semibold bg-red-700"
                style={{
                  color: "white",
                  transition: "background-color 0.2s",
                  borderRadius: "0.5rem",
                  backgroundColor: "#A12B30",
                }}
              >
                ยืนยันการจอง
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">จองสำเร็จ!</h4>
            <p className="text-gray-600 mb-6">
              ระบบได้บันทึกข้อมูลการจองของท่านเรียบร้อยแล้ว
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full mt-4 py-2 rounded-lg font-semibold bg-red-700"
              style={{
                color: "white",
                transition: "background-color 0.2s",
                borderRadius: "0.5rem",
                borderTop: "2px",
                backgroundColor: "#A12B30",
              }}
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
