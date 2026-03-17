import React, { useState, useEffect, useRef } from "react";

const DAYS = ["Lu", "Ma", "Mi", "Jo", "Vi", "Sâ", "Du"];
const MONTHS = [
  "Ianuarie",
  "Februarie",
  "Martie",
  "Aprilie",
  "Mai",
  "Iunie",
  "Iulie",
  "August",
  "Septembrie",
  "Octombrie",
  "Noiembrie",
  "Decembrie",
];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  const day = new Date(year, month, 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  return day === 0 ? 6 : day - 1;
}

export function CustomDatePicker({
  value,
  onChange,
  placeholder = "Selectează data",
  required = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(
    value ? new Date(value) : new Date(),
  );

  const selectedDate = value ? new Date(value) : null;
  const popupRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDayClick = (day) => {
    const newDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    // Format to YYYY-MM-DD to match standard HTML5 input[type="date"]
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const d = String(newDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${d}`;

    onChange({ target: { value: formattedDate } });
    setIsOpen(false);
  };

  const prevMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const nextMonth = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const daysInMonth = getDaysInMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );
  const firstDay = getFirstDayOfMonth(
    currentDate.getFullYear(),
    currentDate.getMonth(),
  );

  const days = [];
  // Empty blocks for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  // Real days
  for (let day = 1; day <= daysInMonth; day++) {
    const isSelected =
      selectedDate &&
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentDate.getMonth() &&
      selectedDate.getFullYear() === currentDate.getFullYear();

    const isToday =
      day === new Date().getDate() &&
      currentDate.getMonth() === new Date().getMonth() &&
      currentDate.getFullYear() === new Date().getFullYear();

    days.push(
      <button
        key={day}
        type="button"
        onClick={() => handleDayClick(day)}
        style={{
          width: "36px",
          height: "36px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "50%",
          background: isSelected ? "var(--color-primary)" : "transparent",
          color: isSelected ? "white" : "inherit",
          fontWeight: isSelected ? "600" : isToday ? "600" : "400",
          cursor: "pointer",
          margin: "auto",
          transition: "all 0.2s ease",
          boxShadow: isSelected ? "0 4px 10px rgba(0,0,0,0.1)" : "none",
          border:
            isToday && !isSelected ? "1px solid var(--color-primary)" : "none",
        }}
        onMouseEnter={(e) => {
          if (!isSelected) e.currentTarget.style.background = "#f0efed";
        }}
        onMouseLeave={(e) => {
          if (!isSelected) e.currentTarget.style.background = "transparent";
        }}
      >
        {day}
      </button>,
    );
  }

  return (
    <div style={{ position: "relative", width: "100%" }} ref={popupRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: "100%",
          padding: "16px",
          borderRadius: "12px",
          border: "1px solid var(--color-border)",
          backgroundColor: "#fff",
          cursor: "pointer",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          color: value ? "#000" : "#888",
          fontSize: "1rem",
          transition: "border-color 0.2s ease",
          boxShadow: isOpen ? "0 0 0 2px var(--color-primary-light)" : "none",
        }}
      >
        <span>
          {value
            ? new Date(value).toLocaleDateString("ro-RO", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })
            : placeholder}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ color: "var(--color-primary)" }}
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
          <line x1="16" y1="2" x2="16" y2="6"></line>
          <line x1="8" y1="2" x2="8" y2="6"></line>
          <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
      </div>

      {/* Hidden input to keep required HTML5 validation native integration */}
      <input
        type="date"
        value={value}
        onChange={() => {}}
        style={{ display: "none" }}
        required={required}
      />

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            right: 0,
            zIndex: 1000,
            backgroundColor: "#fff",
            borderRadius: "16px",
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0,0,0,0.05)",
            padding: "20px",
            animation: "fadeIn 0.2s ease",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <button
              type="button"
              onClick={prevMonth}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0efed")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <span style={{ fontWeight: "600", fontSize: "1.1rem" }}>
              {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "8px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f0efed")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "transparent")
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "8px",
              textAlign: "center",
              marginBottom: "10px",
            }}
          >
            {DAYS.map((d) => (
              <span
                key={d}
                style={{
                  fontSize: "0.85rem",
                  color: "#888",
                  fontWeight: "500",
                }}
              >
                {d}
              </span>
            ))}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "8px",
            }}
          >
            {days}
          </div>

          <style>
            {`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(-5px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}
          </style>
        </div>
      )}
    </div>
  );
}
