import React, { useState, useEffect } from "react";
import deleteButton from "./img/deleteButton.png";
import editButton from "./img/editButton.png";
import usePlanStore from "../../stores/plan.js";
import PlanModify from "./CreateModify/PlanModify"; // Import the PlanModify modal
import "./styles/CatPlanList.css";

const CatPlanList = () => {
  const {
    subPlans,
    updateSubPlanStatus,
    subCode,
    deletePlan,
    getDatePlanRequest,
    changePlanStatus,
    setSubPlans,
  } = usePlanStore(); // 상태 관리 훅에서 필요한 함수와 상태 가져오기

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

  // 현재 날짜 상태 및 계획을 불러옴
  const { date } = usePlanStore((state) => ({ date: state.date }));

  useEffect(() => {
    // 현재 선택된 과목 코드를 기반으로 계획을 불러옴
    if (subCode > 0) {
      getDatePlanRequest(date);
    }
  }, [subCode, date, getDatePlanRequest]); // 의존성 배열에 date 추가

  const formatPlanStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(remainingMinutes).padStart(2, "0")
    );
  };

  const handleCheckboxChange = async (planId) => {
    try {
      const success = await changePlanStatus(planId); // 상태 변경 요청
      if (success) {
        // 성공적으로 상태가 변경되었으면 새로운 subPlans로 상태 업데이트
        const updatedPlans = subPlans.map((plan) =>
          plan.planId === planId
            ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
            : plan
        );
        setSubPlans(updatedPlans); // subPlans 상태 갱신
      } else {
        alert("플랜 상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("플랜 상태 변경 중 오류가 발생했습니다:", error);
      alert("플랜 상태 변경 중 오류가 발생했습니다.");
    }
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
          // 데이터 갱신
          await getDatePlanRequest(date);
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
