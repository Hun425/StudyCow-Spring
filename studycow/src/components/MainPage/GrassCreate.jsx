import moment from "moment";
import "./styles/GrassCreate.css"; // 스타일을 추가할 수 있습니다.

const GrassCreate = ({ year, month, plans }) => {
  const daysInMonth = moment(`${year}-${month}`, "YYYY-MM").daysInMonth();
  const startDay = moment(`${year}-${month}-01`).day(); // 월의 시작 요일
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // 월의 날짜와 관련된 계획 개수를 색깔로 표시하기 위한 함수
  const getDayColor = (day) => {
    const planCount = plans[day.toString().padStart(2, "0")] || 0;
    if (planCount === 0) return "#f3f8f3"; // 기본 색상
    if (planCount <= 2) return "#f1f8f1"; // 연한 연두
    if (planCount <= 4) return "#B4C8BB"; // 조금 진한 연두
    return "#778c86"; // 진한 초록
  };

  return (
    <div className="grassCalendar">
      <h1>{`${moment(`${year}-${month}`, "YYYY-MM").format(
        "YYYY년 MM월"
      )} Plans`}</h1>
      <div className="grassCalendar-grid">
        {Array.from({ length: startDay }).map((_, i) => (
          <div
            key={`emptyGrass-${i}`}
            className="grassCalendar-day emptyGrass"
          ></div>
        ))}
        {days.map((day) => (
          <div
            key={day}
            className="grassCalendar-day"
            style={{ backgroundColor: getDayColor(day) }}
          >
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GrassCreate;
