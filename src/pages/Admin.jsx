import { useState, useEffect } from "react";

// Mock data for all bookings (expanded dataset)
let allMockBookings = [
  //   {
  //     activity: "M",
  //     booker: "executive_team",
  //     phone: "0321987654",
  //     room: "ห้องประชุมใหญ่ 301",
  //     attendees: "12",
  //     date: "2025-08-08",
  //     startTime: "10:00",
  //     endTime: "12:00",
  //     specialRequest: "Board meeting preparation",
  //     status: "Rejected",
  //     timestamp: "27/07/2568 14:30",
  //   },
  //   {
  //     activity: "N",
  //     booker: "operations_team",
  //     phone: "0219876543",
  //     room: "ห้องประชุมเล็ก 204",
  //     attendees: "15",
  //     date: "2025-08-09",
  //     startTime: "13:30",
  //     endTime: "15:30",
  //     specialRequest: "Operations review",
  //     status: "Rejected",
  //     timestamp: "27/07/2568 16:20",
  //   }
];

const ITEMS_PER_PAGE = 5;

// Simulate API call for booking data (endpoint: /getMoreBooking/{page}?status={status})
const fetchBookingsApi = async (page, status) => {
  try {
    const newStatus = status.toLowerCase();

    const response = await fetch(
      `https://us-central1-booking-room-backend.cloudfunctions.net/app/getMoreBooking/${page}?status=${newStatus}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const json = await response.json();
    const filteredData = json.data.filter((b) => b.status === newStatus);

    const startIndex = (page - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(
          `Returning ${paginatedData.length} items for page ${page}, status: ${newStatus}`
        );
        resolve({
          paginatedData,
          totalFiltered: filteredData.length,
        });
      }, 300);
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return {
      paginatedData: [],
      totalFiltered: 0,
    };
  }
};

// Simulate API call for status numbers (endpoint: /getStatusNumber)
const fetchStatusNumbersApi = async () => {
  try {
    const response = await fetch(
      "https://us-central1-booking-room-backend.cloudfunctions.net/app/getStatusNumber"
    ); // หรือใส่ URL จริงของคุณ
    if (!response.ok) {
      throw new Error("Failed to fetch status numbers");
    }
    const data = await response.json();

    // แปลงข้อมูลจาก array เป็น object ที่มี key เป็น status เช่น { pending: 1, success: 1 }
    const counts = {};
    data.forEach((item) => {
      counts[item.status] = item.count;
    });

    return counts;
  } catch (error) {
    console.error("Error fetching status numbers:", error);
    return { pending: 0, success: 0, rejected: 0 }; // fallback เผื่อ error
  }
};

// API call to update booking status
const updateStatus = async (bookingId, status) => {
  try {
    const response = await fetch(
      `https://us-central1-booking-room-backend.cloudfunctions.net/app/updateState/${bookingId}?status=${status}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log("Status updated successfully:", result);
    return result;
  } catch (error) {
    console.error("Error updating status:", error);
    throw error;
  }
};

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Pending");
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  // Function to fetch booking data based on page and status
  const fetchData = async (page, status) => {
    console.log(`Fetching data for page: ${page}, status: ${status}`);

    const { paginatedData, totalFiltered } = await fetchBookingsApi(
      page,
      status
    );

    console.log(
      `Fetched ${paginatedData.length} bookings for page ${page}, status: ${status}`
    );

    setBookings((prev) =>
      page === 1 ? paginatedData : [...prev, ...paginatedData]
    );

    const hasMoreData = page * ITEMS_PER_PAGE < totalFiltered;
    setHasMore(hasMoreData);

    console.log(
      `Has more data: ${hasMoreData}, Total filtered: ${totalFiltered}`
    );
  };

  // Effect to load initial data and re-fetch when filterStatus changes
  useEffect(() => {
    setCurrentPage(1);
    fetchData(1, filterStatus);
  }, [filterStatus]);

  // Effect to fetch status numbers for summary cards
  useEffect(() => {
    const getStatusCounts = async () => {
      const counts = await fetchStatusNumbersApi();
      setPendingCount(counts.pending);
      setApprovedCount(counts.approved);
      setRejectedCount(counts.rejected);
    };
    getStatusCounts();
  }, [bookings]);

  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    console.log(
      `Loading more data - Next page: ${nextPage}, Current status: ${filterStatus}`
    );
    setCurrentPage(nextPage);
    fetchData(nextPage, filterStatus);
  };

  const openBookingDetails = (booking) => setSelectedBooking(booking);
  const closeBookingDetails = () => setSelectedBooking(null);

  const handleApprove = async (booking) => {
    try {
      await updateStatus(booking.id, "approved");

      // Update local state
      const updatedBookings = allMockBookings.map((b) =>
        b.id === booking.id ? { ...b, status: "Approved" } : b
      );
      allMockBookings.splice(0, allMockBookings.length, ...updatedBookings);

      // Refresh data
      fetchData(1, filterStatus);
      fetchStatusNumbersApi().then((counts) => {
        setPendingCount(counts.pending);
        setApprovedCount(counts.approved);
        setRejectedCount(counts.rejected);
      });

      closeBookingDetails();
    } catch (error) {
      console.error("Failed to approve booking:", error);
      alert("เกิดข้อผิดพลาดในการอนุมัติ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const handleReject = async (booking) => {
    try {
      await updateStatus(booking.id, "rejected");

      // Update local state
      const updatedBookings = allMockBookings.map((b) =>
        b.id === booking.id ? { ...b, status: "Rejected" } : b
      );
      allMockBookings.splice(0, allMockBookings.length, ...updatedBookings);

      // Refresh data
      fetchData(1, filterStatus);
      fetchStatusNumbersApi().then((counts) => {
        setPendingCount(counts.pending);
        setApprovedCount(counts.approved);
        setRejectedCount(counts.rejected);
      });

      closeBookingDetails();
    } catch (error) {
      console.error("Failed to reject booking:", error);
      alert("เกิดข้อผิดพลาดในการปฏิเสธ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const toDateString = (timestamp) => {
    if (!timestamp || !timestamp._seconds) return "Invalid date";
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleString(); // หรือ toLocaleDateString()
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <style>{`
        .admin-dashboard {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f0f2f5;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 15px;
          background-color: white;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          color: #333;
          font-size: 15px;
          font-weight: bold;
        }

        .header-left,
        .header-right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-left .time {
          font-weight: normal;
        }

        .header-right .icon {
          width: 20px;
          height: 20px;
          filter: invert(30%) sepia(0%) saturate(0%) hue-rotate(0deg)
            brightness(0%) contrast(100%);
        }

        .main-content {
          padding: 20px;
          flex-grow: 1;
        }

        .dashboard-title {
          background-color: #dc3545;
          color: white;
          padding: 10px 20px;
          margin: -20px -20px 20px -20px;
          font-size: 24px;
          font-weight: bold;
        }

        .summary-cards {
          display: flex;
          justify-content: space-around;
          gap: 15px;
          margin-bottom: 20px;
        }

        .card {
          background-color: white;
          border-radius: 10px;
          padding: 20px;
          text-align: center;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }

        .card .icon-wrapper {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 10px;
        }

        .pending-card .icon-wrapper {
          background-color: #ffe0b2;
        }

        .approved-card .icon-wrapper {
          background-color: #c8e6c9;
        }

        .card .icon-pending,
        .card .icon-approved {
          width: 30px;
          height: 30px;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }

        .icon-pending {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23fb8c00"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>');
        }

        .icon-approved {
          background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%234CAF50"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>');
        }

        .card .value {
          font-size: 32px;
          font-weight: bold;
          color: #333;
        }

        .card .label {
          font-size: 14px;
          color: #666;
        }

        .tabs {
          display: flex;
          margin-bottom: 20px;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .tab-button {
          flex: 1;
          padding: 12px 0;
          border: none;
          background-color: transparent;
          cursor: pointer;
          font-size: 16px;
          font-weight: 500;
          color: #555;
          transition: background-color 0.3s ease, color 0.3s ease;
          border-bottom: 3px solid transparent;
        }

        .tab-button.active {
          background-color: #dc3545;
          color: white;
          border-bottom-color: #dc3545;
        }

        .tab-button:hover:not(.active) {
          background-color: #f5f5f5;
        }

        .booking-list {
          background-color: transparent;
          border-radius: 0;
          box-shadow: none;
          padding: 0;
        }

        .booking-item {
          display: flex;
          align-items: flex-start;
          padding: 15px;
          margin-bottom: 10px;
          background-color: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-left: 4px solid transparent;
        }

        .booking-item.pending {
          border-left-color: #ffc107;
        }

        .booking-item.approved {
          border-left-color: #28a745;
        }

        .booking-item.rejected {
          border-left-color: #dc3545;
        }

        .booking-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
        }

        .booking-item:last-child {
          margin-bottom: 0;
        }

        .booking-item .avatar {
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background-color: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 20px;
          font-weight: bold;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .booking-item .details {
          flex-grow: 1;
        }

        .booking-item .name {
          font-weight: bold;
          font-size: 16px;
          color: #333;
          margin-bottom: 2px;
        }

        .booking-item .phone {
          font-size: 14px;
          color: #777;
          margin-bottom: 5px;
        }

        .booking-item .room-info,
        .booking-item .date-time,
        .booking-item .timestamp {
          font-size: 13px;
          color: #555;
          line-height: 1.4;
        }

        .booking-item .status-tag {
          padding: 5px 10px;
          border-radius: 15px;
          font-size: 12px;
          font-weight: bold;
          text-transform: capitalize;
          margin-left: 15px;
          flex-shrink: 0;
        }

        .status-tag.pending {
          background-color: #fff3cd;
          color: #856404;
        }

        .status-tag.approved {
          background-color: #d4edda;
          color: #155724;
        }

        .status-tag.rejected {
          background-color: #f8d7da;
          color: #721c24;
        }

        .no-bookings {
          text-align: center;
          color: #777;
          padding: 20px;
        }

        .load-more-button {
          display: block;
          width: 100%;
          margin: 20px 0;
          padding: 12px 20px;
          background-color: #007bff;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .load-more-button:hover {
          background-color: #0056b3;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background-color: white;
          border-radius: 10px;
          padding: 25px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
          position: relative;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #eee;
          padding-bottom: 15px;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 22px;
          color: #333;
        }

        .modal-header .close-button {
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #888;
          line-height: 1;
        }

        .modal-body {
          margin-bottom: 20px;
        }

        .detail-item {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
        }

        .avatar-modal {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background-color: #007bff;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          font-weight: bold;
          margin-right: 15px;
          flex-shrink: 0;
        }

        .name-phone-modal p {
          margin: 0;
          font-size: 15px;
          color: #555;
        }

        .name-phone-modal strong {
          font-size: 18px;
          color: #333;
        }

        .detail-row {
          display: flex;
          margin-bottom: 10px;
          font-size: 15px;
        }

        .detail-label {
          flex: 1;
          color: #666;
          font-weight: 500;
        }

        .detail-value {
          flex: 2;
          color: #333;
          font-weight: 400;
        }

        .modal-actions {
          display: flex;
          justify-content: space-around;
          gap: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .approve-button,
        .reject-button {
          flex: 1;
          padding: 12px 20px;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: bold;
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .approve-button {
          background-color: #28a745;
          color: white;
        }

        .approve-button:hover {
          background-color: #218838;
        }

        .reject-button {
          background-color: #dc3545;
          color: white;
        }

        .reject-button:hover {
          background-color: #c82333;
        }

        .settings-button {
          position: fixed;
          bottom: 20px;
          right: 20px;
          background-color: #6c757d;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          cursor: pointer;
          z-index: 999;
        }

        .settings-button img {
          width: 28px;
          height: 28px;
          filter: invert(100%);
        }
      `}</style>

      <div className="admin-dashboard">
        <div className="main-content">
          <h1 className="dashboard-title">Admin Dashboard</h1>

          <div className="summary-cards">
            <div className="card pending-card">
              <div className="icon-wrapper">
                <span className="icon-pending" />
              </div>
              <div className="value">{pendingCount || 0}</div>
              <div className="label">Pending</div>
            </div>
            <div className="card approved-card">
              <div className="icon-wrapper">
                <span className="icon-approved" />
              </div>
              <div className="value">{approvedCount || 0}</div>
              <div className="label">Approved</div>
            </div>
          </div>

          <div className="tabs">
            {["Pending", "Approved", "Rejected"].map((status) => (
              <button
                key={status}
                className={`tab-button ${
                  filterStatus === status ? "active" : ""
                }`}
                onClick={() => setFilterStatus(status)}
              >
                {status} (
                {
                  {
                    Pending: pendingCount || 0,
                    Approved: approvedCount || 0,
                    Rejected: rejectedCount || 0,
                  }[status]
                }
                )
              </button>
            ))}
          </div>

          <div className="booking-list">
            {bookings.length > 0 ? (
              bookings.map((booking, index) => (
                <div
                  key={booking.booker + index}
                  className={`booking-item ${booking.status.toLowerCase()}`}
                  onClick={() => openBookingDetails(booking)}
                >
                  <div className="avatar">
                    {booking.booker[0].toUpperCase()}
                  </div>
                  <div className="details">
                    <div className="name">{booking.booker}</div>
                    <div className="phone">{booking.phone}</div>
                    <div className="room-info">
                      ห้อง: {booking.selectedRoom || "undefined"}
                    </div>
                    <div className="date-time">
                      วันที่: {booking.date} เวลา: {booking.startTime} -{" "}
                      {booking.endTime}
                    </div>
                    <div className="timestamp">
                      จองเมื่อ: {toDateString(booking.timestamp)}
                    </div>
                  </div>
                  <div className={`status-tag ${booking.status.toLowerCase()}`}>
                    {booking.status}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-bookings">ไม่มีรายการจอง</p>
            )}

            {hasMore && (
              <button className="load-more-button" onClick={handleLoadMore}>
                Load More
              </button>
            )}
          </div>
        </div>

        {selectedBooking && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>รายละเอียดการจอง</h2>
                <button className="close-button" onClick={closeBookingDetails}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-item">
                  <span className="avatar-modal">
                    {selectedBooking.booker[0].toUpperCase()}
                  </span>
                  <div className="name-phone-modal">
                    <p>
                      <strong>{selectedBooking.booker}</strong>
                    </p>
                    <p>{selectedBooking.phone || "N/A"}</p>
                    <p>จองเมื่อ: {toDateString(selectedBooking.timestamp)}</p>
                  </div>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ห้อง:</span>
                  <span className="detail-value">
                    {selectedBooking.selectedRoom || "undefined"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">วันที่:</span>
                  <span className="detail-value">{selectedBooking.date}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">เวลา:</span>
                  <span className="detail-value">
                    {selectedBooking.startTime} - {selectedBooking.endTime}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ระยะเวลา:</span>
                  <span className="detail-value">
                    {new Date(
                      `2000/01/01 ${selectedBooking.endTime}`
                    ).getHours() -
                      new Date(
                        `2000/01/01 ${selectedBooking.startTime}`
                      ).getHours()}{" "}
                    ชั่วโมง
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">ผู้เข้าร่วม:</span>
                  <span className="detail-value">
                    {selectedBooking.attendees}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">วัตถุประสงค์:</span>
                  <span className="detail-value">
                    {selectedBooking.activity || "N/A"}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">อุปกรณ์ที่ขอ:</span>
                  <span className="detail-value">snack (ตัวอย่าง)</span>
                </div>
              </div>
              <div className="modal-actions">
                {selectedBooking.status.toLowerCase() === "pending" && (
                  <>
                    <button
                      className="approve-button"
                      onClick={() => handleApprove(selectedBooking)}
                    >
                      อนุมัติ
                    </button>
                    <button
                      className="reject-button"
                      onClick={() => handleReject(selectedBooking)}
                    >
                      ปฏิเสธ
                    </button>
                  </>
                )}
                {selectedBooking.status.toLowerCase() !== "pending" && (
                  <p
                    style={{
                      textAlign: "center",
                      width: "100%",
                      color: "#666",
                    }}
                  >
                    สถานะ: {selectedBooking.status}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
