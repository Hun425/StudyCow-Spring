import React from "react";
import { useNavigate } from "react-router-dom";
import deleteButton from "./img/deleteButton.png";
import editButton from "./img/editButton.png";
import usePlanStore from "../../stores/plan.js";
import './styles/CatPlanList.css'

const CatPlanList = () => {
  const navigate = useNavigate();
  const { subPlans, updateSubPlanStatus, subCode } = usePlanStore();

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
    updateSubPlanStatus(planId); // 스토어에 상태 업데이트 요청
  };

  const handleEditClick = (planId) => {
    navigate(`/Modify/${planId}`); // 수정 페이지로 이동
  };

  return (
    <div className="singleSubPlanBox">
      {subPlans.length === 0 && subCode > 0 ? (
        <p>해당 과목에 등록된 플랜이 없습니다.</p>
      ) : 
      (subPlans.map((plan) => (
        <div key={plan.planId}>
          {!plan.planStatus && (
            <div className="singleSubPlanContent">
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

export default CatPlanList;
