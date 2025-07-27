import React, { useState, useEffect } from "react";
import { Calendar, Users, Projector, Tv } from "lucide-react";
import { DatePicker } from 'rsuite';

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState("27 กรกฎาคม 2568");

  const rooms = [
    {
      id: 1,
      name: "ห้องประชุมใหญ่ 812",
      capacity: "30 ที่",
      amenities: ["Projector", "TV"],
      image: "/api/placeholder/400/250",
      available: true,
    },
    {
      id: 2,
      name: "ห้องประชุมเล็ก 204",
      capacity: "12 ที่",
      amenities: ["Projector"],
      image: "/api/placeholder/400/250",
      available: true,
    },
  ];

  useEffect(() => {
    setSelectedDate("27 กรกฎาคม 2568");
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 text-white p-4 flex items-center">
        <div className="bg-yellow-400 text-red-600 rounded-full w-12 h-12 flex items-center justify-center mr-3 font-bold text-[10px] leading-tight sm:text-sm sm:leading-normal">
          BUU
          <br />
          BOOK
        </div>
        <h1 className="text-lg sm:text-xl font-semibold">จองห้องประชุม</h1>
      </header>

      <main className="p-4 space-y-6 max-w-5xl mx-auto">
        {/* Date Selection */}
        <section className="bg-white rounded-lg p-4 shadow-sm">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
            เลือกวันที่
          </h2>
          <DatePicker format="dd/MM/yyyy" />
        </section>

        {/* Room Selection */}
        <section>
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
            เลือกห้องประชุม
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden flex flex-col"
              >
                {/* Room Image */}
                <div className="h-48 bg-gray-200 relative">
                  <img
                    src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='250' viewBox='0 0 400 250'%3E%3Crect width='400' height='250' fill='%23f0f0f0'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='16' fill='%23666' text-anchor='middle' dy='.3em'%3EMeeting Room%3C/text%3E%3C/svg%3E"
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Room Details */}
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base">
                    {room.name}
                  </h3>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      <span>{room.capacity}</span>
                    </div>

                    {room.amenities.map((amenity, index) => (
                      <div
                        key={index}
                        className="flex items-center text-gray-600"
                      >
                        {amenity === "Projector" && (
                          <Projector className="w-4 h-4 mr-2" />
                        )}
                        {amenity === "TV" && <Tv className="w-4 h-4 mr-2" />}
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>

                  <button className="mt-auto w-full bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors text-sm">
                    เลือกห้องนี้
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
