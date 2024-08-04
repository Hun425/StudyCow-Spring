import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/PlanList.css";
import deleteButton from "./img/deleteButton.png";
import editButton from "./img/editButton.png";
import usePlanStore from "../../stores/plan";

const PlanList = () => {
  const navigate = useNavigate();
  const { plans, updatePlanStatus } = usePlanStore();

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

  const handleCheckboxChange = (planId) => {
    updatePlanStatus(planId); // 스토어에 상태 업데이트 요청
  };

  const handleEditClick = (planId) => {
    navigate(`/Modify/${planId}`); // 수정 페이지로 이동
  };

  const formatPlanStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return String(hours).padStart(2, '0') + ':' + String(remainingMinutes).padStart(2, '0');
  };

  return (
    <div className="singlePlanBox">
      {plans.length === 0 ? (
        <p>플랜을 등록하세요.</p>
      ) : 
      (plans.map((plan) => (
        <div key={plan.planId}>
          {!plan.planStatus && (
            <div className="singlePlanContent">
              <label>
                <input
                  type="checkbox"
                  checked={plan.planStatus === 1}
                  onChange={() => handleCheckboxChange(plan.planId)}
                />
                {`${formatPlanStudyTime(plan.planStudyTime)}`} {/* 입력된 시간 표시 */}
              </label>
              <p>
                {`${sub_code_dic[`${plan.subCode}`]}`} {/* 과목 표시 */}
              </p>
              <div className="buttonBox">
                <button
                  className="buttonCase"
                  onClick={() => handleEditClick(plan.planId)}
                >
                  <img className="editButton" src={editButton} alt="수정버튼" />
                </button>
                <button className="buttonCase">
                  <img
                    className="deleteButton"
                    src={deleteButton}
                    alt="삭제버튼"
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      )))}
    </div>
  );
};

export default PlanList;
