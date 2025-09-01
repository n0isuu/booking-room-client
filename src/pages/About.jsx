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
  const [showCalendar, setShowCalendar] = useState(true);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  
  // LIFF และ User ID states
  const [liffReady, setLiffReady] = useState(false);
  const [lineUserId, setLineUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [liffError, setLiffError] = useState(null);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [activity, setActivity] = useState("");
  const [booker, setBooker] = useState("");
  const [phone, setPhone] = useState("");
  const [attendees, setAttendees] = useState("");
  const [specialRequests, setSpecialRequests] = useState("");
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
  ];
  const thaiDays = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];

  // Initialize LIFF
  useEffect(() => {
    initializeLiff();
  }, []);

  useEffect(() => {
    if (liffReady) {
      handleSelectRoom();
    }
  }, [liffReady]);

  const initializeLiff = async () => {
    try {
      // Check if LIFF SDK is loaded
      if (typeof window.liff === 'undefined') {
        setLiffError('LIFF SDK not loaded. Please access through LINE app.');
        return;
      }

      // Initialize LIFF
      await window.liff.init({ liffId: '2007708896-L4l12Bxb' }); // แทนที่ด้วย LIFF ID จริง
      
      if (window.liff.isLoggedIn()) {
        // Get user profile
        const profile = await window.liff.getProfile();
        setUserProfile(profile);
        setLineUserId(profile.userId);
        setBooker(profile.displayName); // Auto-fill booker name
        setLiffReady(true);
        console.log('LIFF initialized successfully');
        console.log('User ID:', profile.userId);
      } else {
        // Login if not logged in
        window.liff.login();
      }
    } catch (error) {
      console.error('LIFF initialization failed:', error);
      setLiffError('Failed to initialize LIFF: ' + error.message);
    }
  };

  const handleSelectRoom = async () => {
    if (!lineUserId) {
      console.log('User ID not available yet');
      return;
    }

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
      console.error("Error fetching rooms:", error);
      alert("เกิดข้อผิดพลาดในการโหลดข้อมูลห้อง");
    }
  };

  const openModal = (room) => {
    setSelectedRoom(room);
    setShowModal(true);
    setStartTime("");
    setEndTime("");
    setValidationErrors({});
  };

  const closeModal = () => {
    setShowModal(false);
    setStartTime("");
    setEndTime("");
    setActivity("");
    setPhone("");
    setAttendees("");
    setSpecialRequests("");
    setValidationErrors({});
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const validateForm = () => {
    const errors = {};

    if (!activity.trim()) {
      errors.activity = "กรุณากรอกกิจกรรม/หัวข้อประชุม";
    }

    if (!startTime) {
      errors.startTime = "กรุณาเลือกเวลาเริ่มต้น";
    }

    if (!endTime) {
      errors.endTime = "กรุณาเลือกเวลาสิ้นสุด";
    }

    if (!booker.trim()) {
      errors.booker = "กรุณากรอกชื่อผู้จอง";
    }

    if (!phone.trim()) {
      errors.phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^\d{10}$/.test(phone.replace(/-/g, ""))) {
      errors.phone = "เบอร์โทรศัพท์ต้องมี 10 หลักเท่านั้น";
    }

    if (endTime && startTime && endTime <= startTime) {
      errors.endTime = "เวลาสิ้นสุดต้องอยู่หลังเวลาเริ่มต้น";
    }

    // Validate attendees
    if (attendees && (parseInt(attendees) < 1 || parseInt(attendees) > selectedRoom.capacity)) {
      errors.attendees = `จำนวนผู้เข้าร่วมต้องอยู่ระหว่าง 1-${selectedRoom.capacity} คน`;
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return; // Prevent double submission
    
    if (!lineUserId) {
      alert('ไม่พบข้อมูลผู้ใช้ กรุณาเข้าใช้งานผ่าน LINE อีกครั้ง');
      return;
    }
    
    const errors = validateForm();
    
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);

    const payload = {
      userId: lineUserId, // ส่ง Line User ID ไปด้วย
      selectedRoom: selectedRoom,
      activity,
      date: formatDate(selectedDate),
      startTime,
      endTime,
      booker,
      phone,
      attendees: attendees ? parseInt(attendees) : null,
      specialRequests,
      userProfile: userProfile // ส่งข้อมูล profile ไปด้วย
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

      const result = await res.json();

      if (res.ok) {
        setShowModal(false);
        setShowSuccessModal(true);
        closeModal();
      } else {
        alert("ส่งข้อมูลไม่สำเร็จ: " + (result.error || 'Unknown error'));
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("เกิดข้อผิดพลาด: " + error.message);
    } finally {
      setIsSubmitting(false);
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

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day other-month"></div>
      );
    }

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

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      if (validationErrors.phone && value.length === 10) {
        setValidationErrors(prev => ({...prev, phone: null}));
      }
    }
  };

  // Show loading or error state if LIFF is not ready
  if (liffError) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-6 text-center">
          <div className="text-red-500 mb-4">⚠️</div>
          <h3 className="text-lg font-bold mb-2">ไม่สามารถเชื่อมต่อ LINE ได้</h3>
          <p className="text-gray-600">{liffError}</p>
        </div>
      </div>
    );
  }

  if (!liffReady) {
    return (
      <div className="min-h-screen bg-gray-50 max-w-md mx-auto flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A12B30] mx-auto mb-4"></div>
          <p>กำลังเชื่อมต่อ LINE...</p>
        </div>
      </div>
    );
  }

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
        .form-input.error {
          border-bottom-color: #ef4444;
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
        <div>
          <h4 className="text-xl font-bold">ระบบจองห้องประชุม</h4>
          {userProfile && (
            <p className="text-sm opacity-80">สวัสดี, {userProfile.displayName}</p>
          )}
        </div>
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
            <div className="mt-2 bg-white rounded-lg shadow-sm p-4 animate-in slide-in-from-top-2">
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
                      className="bg-[#A12B30] w-full !mt-4 py-2 !rounded-lg !font-semibold !text-white hover:bg-red-800 transition-colors"
                    >
                      เลือกห้องนี้
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
        <div className="fixed inset-0 bg-[rgba(128,128,128,0.5)] flex justify-center items-center z-50 p-4">
          <div className="bg-white w-full max-w-md max-h-[90vh] rounded-2xl flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <h4 className="text-lg font-bold text-gray-800">
                รายละเอียดการจอง
              </h4>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-800 text-2xl"
                disabled={isSubmitting}
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
                    กิจกรรม/หัวข้อประชุม <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="เช่น ประชุมประจำเดือน"
                    className={`form-input w-full p-2 ${validationErrors.activity ? 'error' : ''}`}
                    value={activity}
                    onChange={(e) => {
                      setActivity(e.target.value);
                      if (validationErrors.activity && e.target.value.trim()) {
                        setValidationErrors(prev => ({...prev, activity: null}));
                      }
                    }}
                    disabled={isSubmitting}
                    required
                  />
                  {validationErrors.activity && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.activity}</p>
                  )}
                </div>

                <div className="flex gap-4 pt-4">
                  {/* เวลาเริ่มต้น */}
                  <div className="w-1/2">
                    <label className="text-gray-700 text-sm block mb-1">
                      เวลาเริ่มต้น <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`form-input w-full p-2 ${validationErrors.startTime ? 'error' : ''}`}
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        setEndTime("");
                        if (validationErrors.startTime && e.target.value) {
                          setValidationErrors(prev => ({...prev, startTime: null}));
                        }
                      }}
                      disabled={isSubmitting}
                      required
                    >
                      <option value="">เลือกเวลา</option>
                      {generateTimeOptions().map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                    {validationErrors.startTime && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.startTime}</p>
                    )}
                  </div>

                  {/* เวลาสิ้นสุด */}
                  <div className="w-1/2">
                    <label className="text-gray-700 text-sm block mb-1">
                      เวลาสิ้นสุด <span className="text-red-500">*</span>
                    </label>
                    <select
                      className={`form-input w-full p-2 ${validationErrors.endTime ? 'error' : ''}`}
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        if (validationErrors.endTime && e.target.value && e.target.value > startTime) {
                          setValidationErrors(prev => ({...prev, endTime: null}));
                        }
                      }}
                      disabled={!startTime || isSubmitting}
                      required
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
                    {validationErrors.endTime && (
                      <p className="text-red-500 text-xs mt-1">{validationErrors.endTime}</p>
                    )}
                  </div>
                </div>

                {/* ชื่อผู้จอง */}
                <div className="relative pt-4">
                  <label className="text-gray-700 text-sm block mb-1">
                    ชื่อผู้จอง <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="ชื่อ-นามสกุล"
                    className={`form-input w-full p-2 ${validationErrors.booker ? 'error' : ''}`}
                    value={booker}
                    onChange={(e) => {
                      setBooker(e.target.value);
                      if (validationErrors.booker && e.target.value.trim()) {
                        setValidationErrors(prev => ({...prev, booker: null}));
                      }
                    }}
                    disabled={isSubmitting}
                    required
                  />
                  {validationErrors.booker && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.booker}</p>
                  )}
                </div>

                {/* เบอร์โทรศัพท์ */}
                <div className="relative pt-4">
                  <label className="text-gray-700 text-sm block mb-1">
                    เบอร์โทรศัพท์ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="0812345678"
                    className={`form-input w-full p-2 ${validationErrors.phone ? 'error' : ''}`}
                    value={phone}
                    onChange={handlePhoneChange}
                    disabled={isSubmitting}
                    required
                  />
                  {validationErrors.phone && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                {/* จำนวนผู้เข้าร่วม */}
                <div className="relative pt-4">
                  <label className="text-gray-700 text-sm block mb-1">
                    จำนวนผู้เข้าร่วม
                  </label>
                  <input
                    type="number"
                    placeholder={`สูงสุด ${selectedRoom.capacity} คน`}
                    className={`form-input w-full p-2 ${validationErrors.attendees ? 'error' : ''}`}
                    value={attendees}
                    onChange={(e) => {
                      setAttendees(e.target.value);
                      if (validationErrors.attendees) {
                        setValidationErrors(prev => ({...prev, attendees: null}));
                      }
                    }}
                    min="1"
                    max={selectedRoom.capacity}
                    disabled={isSubmitting}
                  />
                  {validationErrors.attendees && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.attendees}</p>
                  )}
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
                    disabled={isSubmitting}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-200">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-3 !rounded-lg !font-semibold bg-[#A12B30] !text-white hover:bg-red-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ยืนยันการจอง'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-[rgba(128,128,128,0.5)] bg-opacity-50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h4 className="text-xl font-bold text-gray-800 mb-2">จองสำเร็จ!</h4>
            <p className="text-gray-600 mb-6">
              ระบบได้บันทึกข้อมูลการจองของท่านเรียบร้อยแล้ว รอการอนุมัติจากผู้ดูแลระบบ
            </p>
            <button
              onClick={() => setShowSuccessModal(false)}
              className="w-full py-3 !rounded-lg !font-semibold bg-[#A12B30] !text-white hover:bg-red-800 transition-colors"
            >
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
}