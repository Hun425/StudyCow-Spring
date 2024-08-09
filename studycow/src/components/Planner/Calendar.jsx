import React, { useState, useEffect } from "react";
import usePlanStore from "../../stores/plan";
import "./styles/Calendar.css";

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const { date, saveDate, getDatePlanRequest } = usePlanStore((state) => ({
    date: state.date,
    saveDate: state.saveDate,
    getDatePlanRequest: state.getDatePlanRequest,
  }));

  useEffect(() => {
    if (date) {
      getDatePlanRequest(date);
    }
  }, [date, getDatePlanRequest]);

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const weekDays = ["일", "월", "화", "수", "목", "금", "토"];

  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day) => {
    const selectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    const formattedDate = formatDate(selectedDate);
    saveDate(formattedDate);
    getDatePlanRequest(formattedDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getDayStyles = (day) => {
    const isSelected =
      date ===
      formatDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      );

    return {
      "--day-bg-color": isSelected ? "#BBD0E9" : "#f8f8f8",
      "--day-color": isSelected ? "white" : isToday(day) ? "#BBD0E9" : "black",
      "--day-border": isToday(day) ? "2px solid #BBD0E9" : "none",
      "--day-hover-bg-color": isSelected ? "#BBD0E9" : "#e6f2ff",
    };
  };

  return (
    <>
      <div className="Calendar">
        <div className="calendarHeader">
          <button
            className="calendarButton"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            &lsaquo;
          </button>
          <div className="MonthYear">
            {currentDate.toLocaleString("default", {
              month: "long",
              year: "numeric",
            })}
          </div>
          <button
            className="calendarButton"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            &rsaquo;
          </button>
        </div>
        <div className="calendarGrid">
          {weekDays.map((day) => (
            <div className="DayBase WeekDay" key={day}>
              {day}
            </div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, index) => (
            <div className="DayBase Day" key={`empty-${index}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, index) => {
            const day = index + 1;
            return (
              <div
                className="DayBase Day"
                key={day}
                style={getDayStyles(day)}
                onClick={() => handleDateClick(day)}
                tabIndex={0}
                role="button"
                aria-pressed={
                  date ===
                  formatDate(
                    new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      day
                    )
                  )
                }
              >
                {day}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Calendar;
