import React from "react";
import usePlanStore from "../../stores/plan.js";
import './styles/RoomPlanner.css';

function RoomPlanner() {
  const { todayPlans, updateTodayPlanStatus } = usePlanStore();

  const sub_code_dic = {
    1: "국어",
    2: "수학",
    3: "영어",
    4: "한국사",
    5: "사회탐구",
    6: "과학탐구",
    7: "직업탐구",
    8: "제2외국어/한문",
  };

  const formatPlanStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return String(hours).padStart(2, '0') + ':' + String(remainingMinutes).padStart(2, '0');
  };

  const handleCheckboxChange = (planId) => {
    updateTodayPlanStatus(planId); // 스토어에 상태 업데이트 요청
  };


  return (
    <div className="singleTodayPlanBox">
      <div className="todayPlanTitle">
        <p>오늘의 플랜</p>
      </div>
      {todayPlans.map((plan) => (
        <div key={plan.planId}>
          {!plan.planStatus && (
            <div className="singleTodayPlanContent">
              <label>
                <input
                  type="checkbox"
                  checked={plan.planStatus === 1}
                  onChange={() => handleCheckboxChange(plan.planId)}
                />
                {`${formatPlanStudyTime(plan.planStudyTime)}`} {/* 입력된 시간 표시 */}
              </label>
              <p>
                {`${plan.planContent}`} {/* 세부내용 표시 */}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default RoomPlanner;
