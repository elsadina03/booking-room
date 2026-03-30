import { useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Building2,
  FileText,
  Bell,
  UserCircle2,
} from "lucide-react";
import TimePicker from "react-time-picker";
import "./App.css";

const rooms = [
  "Ruang Meeting A",
  "Ruang Meeting B",
  "Ruang Seminar 1",
  "Ruang Kelas 204",
];

const seedBookings = [
  {
    id: 1,
    date: "2026-06-12",
    room: "Ruang Meeting A",
    start: "09:00",
    end: "11:00",
    org: "HIMA Informatika",
    purpose: "Rapat divisi acara",
    status: "approved",
  },
  {
    id: 2,
    date: "2026-06-12",
    room: "Ruang Meeting B",
    start: "13:00",
    end: "15:00",
    org: "BEM Fakultas",
    purpose: "Koordinasi program kerja",
    status: "pending",
  },
  {
    id: 3,
    date: "2026-06-15",
    room: "Ruang Seminar 1",
    start: "08:00",
    end: "10:00",
    org: "UKM Musik",
    purpose: "Briefing lomba",
    status: "approved",
  },
  {
    id: 4,
    date: "2026-06-19",
    room: "Ruang Kelas 204",
    start: "15:00",
    end: "17:00",
    org: "HIMA Sistem Informasi",
    purpose: "Evaluasi bulanan",
    status: "rejected",
  },
];

const monthNames = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatHumanDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function getMonthMatrix(currentMonth) {
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const start = new Date(firstDay);
  start.setDate(firstDay.getDate() - firstDay.getDay());

  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start);
    date.setDate(start.getDate() + i);
    return date;
  });
}

function App() {
  const [bookings, setBookings] = useState(seedBookings);
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 5, 1));
  const [selectedDate, setSelectedDate] = useState(new Date(2026, 5, 12));
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [form, setForm] = useState({
    room: "",
    start: "",
    end: "",
    org: "",
    purpose: "",
  });
  const [message, setMessage] = useState("");

  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const matrix = useMemo(() => getMonthMatrix(currentMonth), [currentMonth]);
  const selectedKey = formatDateKey(selectedDate);

  const yearOptions = [];
  for (let year = 2024; year <= 2035; year++) {
    yearOptions.push(year);
  }

  const dayBookings = useMemo(() => {
    return bookings
      .filter((b) => b.date === selectedKey)
      .sort((a, b) => a.start.localeCompare(b.start));
  }, [bookings, selectedKey]);

  const counts = useMemo(() => {
    return {
      approved: bookings.filter((b) => b.status === "approved").length,
      pending: bookings.filter((b) => b.status === "pending").length,
      rejected: bookings.filter((b) => b.status === "rejected").length,
    };
  }, [bookings]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMonthChange = (monthIndex) => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), Number(monthIndex), 1));
    setShowMonthPicker(false);
  };

  const handleYearChange = (year) => {
    setCurrentMonth(new Date(Number(year), currentMonth.getMonth(), 1));
    setShowMonthPicker(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.room || !form.start || !form.end || !form.org || !form.purpose) {
      setMessage("Lengkapi semua field dulu.");
      return;
    }

    if (form.start >= form.end) {
      setMessage("Jam selesai harus lebih besar dari jam mulai.");
      return;
    }

    const conflict = bookings.find(
      (b) =>
        b.date === selectedKey &&
        b.room === form.room &&
        b.status !== "rejected" &&
        form.start < b.end &&
        form.end > b.start
    );

    if (conflict) {
      setMessage(
        `Bentrok dengan booking ${conflict.room} pukul ${conflict.start}-${conflict.end}.`
      );
      return;
    }

    const newBooking = {
      id: bookings.length + 1,
      date: selectedKey,
      room: form.room,
      start: form.start,
      end: form.end,
      org: form.org,
      purpose: form.purpose,
      status: "pending",
    };

    setBookings([...bookings, newBooking]);
    setForm({
      room: "",
      start: "",
      end: "",
      org: "",
      purpose: "",
    });
    setMessage("Pengajuan booking berhasil dibuat dengan status pending.");
  };

  const getStatusClass = (status) => {
    if (status === "approved") return "approved";
    if (status === "pending") return "pending";
    return "rejected";
  };

  return (
    <div className="app">
      <div className="container">
        <div className="topbar">
          <div>
            <h1>Booking Ruangan Kampus</h1>
            <p>Dashboard user untuk cek jadwal dan ajukan booking ruangan</p>
          </div>

          <div className="topbar-right">
            <Bell size={20} />
            <div className="user-box">
              <UserCircle2 size={24} />
              <span>Daffa</span>
            </div>
          </div>
        </div>

        <div className="dashboard">
          <div className="calendar-card">
            <div className="card-header">
              <div className="title-row">
                <CalendarDays size={20} />
                <h2>Kalender Booking</h2>
              </div>

              <div className="month-nav">
                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() - 1,
                        1
                      )
                    )
                  }
                >
                  <ChevronLeft size={18} />
                </button>

                <div className="month-picker-wrapper">
                  <button
                    type="button"
                    className="month-display-btn"
                    onClick={() => setShowMonthPicker(!showMonthPicker)}
                  >
                    {monthNames[currentMonth.getMonth()]}{" "}
                    {currentMonth.getFullYear()}
                  </button>

                  {showMonthPicker && (
                    <div className="month-picker-popup">
                      <div className="form-group">
                        <label>Bulan</label>
                        <select
                          value={currentMonth.getMonth()}
                          onChange={(e) => handleMonthChange(e.target.value)}
                        >
                          {monthNames.map((month, index) => (
                            <option key={index} value={index}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Tahun</label>
                        <select
                          value={currentMonth.getFullYear()}
                          onChange={(e) => handleYearChange(e.target.value)}
                        >
                          {yearOptions.map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCurrentMonth(
                      new Date(
                        currentMonth.getFullYear(),
                        currentMonth.getMonth() + 1,
                        1
                      )
                    )
                  }
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="day-labels">
              {days.map((day) => (
                <div key={day} className="day-label">
                  {day}
                </div>
              ))}
            </div>

            <div className="calendar-grid">
              {matrix.map((date) => {
                const key = formatDateKey(date);
                const dayEvents = bookings.filter((b) => b.date === key);
                const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
                const isSelected = key === selectedKey;

                return (
                  <button
                    type="button"
                    key={key}
                    className={`calendar-cell ${isSelected ? "selected" : ""} ${
                      !isCurrentMonth ? "muted" : ""
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className="date-number">{date.getDate()}</div>

                    <div className="cell-events">
                      {dayEvents.slice(0, 2).map((event) => (
                        <div
                          key={event.id}
                          className={`event-pill ${getStatusClass(event.status)}`}
                          title={event.room}
                        >
                          {event.room}
                        </div>
                      ))}

                      {dayEvents.length > 2 && (
                        <div className="more-events">
                          +{dayEvents.length - 2} lainnya
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="sidebar">
            <div className="panel">
              <h3>Ringkasan</h3>

              <div className="summary approved">
                <span>Approved</span>
                <strong>{counts.approved}</strong>
              </div>

              <div className="summary pending">
                <span>Pending</span>
                <strong>{counts.pending}</strong>
              </div>

              <div className="summary rejected">
                <span>Rejected</span>
                <strong>{counts.rejected}</strong>
              </div>
            </div>

            <div className="panel">
              <h3>Detail Tanggal</h3>
              <p className="selected-date">{formatHumanDate(selectedDate)}</p>

              {dayBookings.length === 0 ? (
                <div className="empty-box">
                  Belum ada booking pada tanggal ini.
                </div>
              ) : (
                dayBookings.map((booking) => (
                  <div key={booking.id} className="booking-item">
                    <div className="booking-top">
                      <div>
                        <h4>{booking.room}</h4>
                        <p className="time-row">
                          <Clock3 size={15} /> {booking.start} - {booking.end}
                        </p>
                      </div>

                      <span
                        className={`status-badge ${getStatusClass(
                          booking.status
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="info-row">
                      <Building2 size={15} /> {booking.org}
                    </p>
                    <p className="info-row">
                      <FileText size={15} /> {booking.purpose}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="panel">
              <h3>Ajukan Booking</h3>

              <form onSubmit={handleSubmit} className="booking-form">
                <div className="form-group">
                  <label>Tanggal</label>
                  <input type="text" value={selectedKey} disabled />
                </div>

                <div className="form-group">
                  <label>Ruangan</label>
                  <select name="room" value={form.room} onChange={handleChange}>
                    <option value="">Pilih ruangan</option>
                    {rooms.map((room) => (
                      <option key={room} value={room}>
                        {room}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Jam Mulai</label>
                    <input
                      type="time"
                      name="start"
                      value={form.start}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Jam Selesai</label>
                    <input
                      type="time"
                      name="end"
                      value={form.end}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Organisasi</label>
                  <input
                    type="text"
                    name="org"
                    placeholder="Contoh: HIMA Informatika"
                    value={form.org}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Keperluan</label>
                  <textarea
                    name="purpose"
                    placeholder="Contoh: Rapat persiapan seminar"
                    value={form.purpose}
                    onChange={handleChange}
                  />
                </div>

                {message && <div className="message-box">{message}</div>}

                <button type="submit" className="submit-btn">
                  Kirim Pengajuan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;