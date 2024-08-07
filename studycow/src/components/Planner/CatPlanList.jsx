import React, { useState } from "react";
import deleteButton from "./img/deleteButton.png";
import editButton from "./img/editButton.png";
import usePlanStore from "../../stores/plan.js";
import PlanModify from "./CreateModify/PlanModify"; // Import the PlanModify modal
import "./styles/CatPlanList.css";

const CatPlanList = () => {
  const { subPlans, updateSubPlanStatus, subCode, deletePlan } = usePlanStore(); // deletePlan 추가

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

  const [selectedPlanId, setSelectedPlanId] = useState(null); // State to store selected plan ID
  const [showModifyModal, setShowModifyModal] = useState(false); // State to manage modal visibility

  const formatPlanStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(remainingMinutes).padStart(2, "0")
    );
  };

  const handleCheckboxChange = (planId) => {
    updateSubPlanStatus(planId); // Update the plan status in the store
  };

  const handleEditClick = (planId) => {
    setSelectedPlanId(planId); // Set the selected plan ID
    setShowModifyModal(true); // Open the PlanModify modal
  };

  const handleCloseModifyModal = () => {
    setShowModifyModal(false); // Close the PlanModify modal
    setSelectedPlanId(null); // Clear the selected plan ID
  };

  const handleDeleteClick = async (planId) => {
    // 플래너 삭제 핸들러
    const confirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmed) {
      try {
        const success = await deletePlan(planId); // deletePlan 호출
        if (success) {
          alert("플래너가 성공적으로 삭제되었습니다.");
          window.location.reload(); // 새로고침하여 삭제된 데이터 반영
        } else {
          alert("플래너 삭제에 실패했습니다.");
        }
      } catch (error) {
        console.error("플래너 삭제 중 오류가 발생했습니다:", error);
        alert("플래너 삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div className="singleSubPlanBox">
      {subPlans.length === 0 && subCode > 0 ? (
        <p>해당 과목에 등록된 플랜이 없습니다.</p>
      ) : (
        subPlans.map((plan) => (
          <div
            key={plan.planId}
            className={`singleSubPlanContent ${
              plan.planStatus === 1 ? "completed" : ""
            }`}
          >
            <div className="singleSubPlanCheckboxContainer">
              <input
                type="checkbox"
                checked={plan.planStatus === 1}
                onChange={() => handleCheckboxChange(plan.planId)}
                className="singleSubPlanCheckbox"
              />
              <span className="singleSubPlanStudyTime">
                {`${formatPlanStudyTime(plan.planStudyTime)}`}{" "}
              </span>
            </div>
            <p className="singleSubPlanContentText">{`${plan.planContent}`}</p>{" "}
            {/* Display plan content */}
            <div className="singleSubButtonBox">
              <button
                className="singleSubButtonCase"
                onClick={() => handleEditClick(plan.planId)}
              >
                <img
                  className="singleSubEditButton"
                  src={editButton}
                  alt="수정버튼"
                />
              </button>
              <button
                className="singleSubButtonCase"
                onClick={() => handleDeleteClick(plan.planId)} // 삭제 버튼에 클릭 핸들러 추가
              >
                <img
                  className="singleSubDeleteButton"
                  src={deleteButton}
                  alt="삭제버튼"
                />
              </button>
            </div>
          </div>
        ))
      )}

      {/* PlanModify modal */}
      {showModifyModal && selectedPlanId && (
        <PlanModify
          planId={selectedPlanId}
          show={showModifyModal}
          onClose={handleCloseModifyModal}
        />
      )}
    </div>
  );
};

export default CatPlanList;
