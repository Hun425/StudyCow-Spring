import React, { useState } from "react";
import "./styles/PlanList.css";
import deleteButton from "./img/deleteButton.png";
import editButton from "./img/editButton.png";
import usePlanStore from "../../stores/plan";
import PlanModify from "./CreateModify/PlanModify"; // PlanModify 모달 컴포넌트

const PlanList = () => {
  const { plans, updatePlanStatus, deletePlan } = usePlanStore();

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

  const [selectedPlanId, setSelectedPlanId] = useState(null); // 수정할 계획의 ID
  const [showModifyModal, setShowModifyModal] = useState(false); // 모달 가시성 상태

  const handleCheckboxChange = (planId) => {
    updatePlanStatus(planId); // 스토어에 상태 업데이트 요청
  };

  const handleEditClick = (planId) => {
    setSelectedPlanId(planId); // 수정할 계획 ID 설정
    setShowModifyModal(true); // PlanModify 모달 열기
  };

  const handleCloseModifyModal = () => {
    setShowModifyModal(false); // PlanModify 모달 닫기
    setSelectedPlanId(null); // 선택된 계획 ID 초기화
  };

  const handleDeleteClick = async (planId) => {
    const confirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmed) {
      try {
        const success = await deletePlan(planId);
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

  const formatPlanStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return (
      String(hours).padStart(2, "0") +
      ":" +
      String(remainingMinutes).padStart(2, "0")
    );
  };

  return (
    <div className="singlePlanBox">
      {plans.length === 0 ? (
        <p>플랜을 등록하세요.</p>
      ) : (
        plans.map((plan) => (
          <div key={plan.planId}>
            {!plan.planStatus && (
              <div className="singlePlanContent">
                <label>
                  <input
                    type="checkbox"
                    checked={plan.planStatus === 1}
                    onChange={() => handleCheckboxChange(plan.planId)}
                  />
                  {`${formatPlanStudyTime(plan.planStudyTime)}`}{" "}
                  {/* 입력된 시간 표시 */}
                </label>
                <p>{`${sub_code_dic[`${plan.subCode}`]}`}</p> {/* 과목 표시 */}
                <div className="buttonBox">
                  <button
                    className="buttonCase"
                    onClick={() => handleEditClick(plan.planId)}
                  >
                    <img
                      className="editButton"
                      src={editButton}
                      alt="수정버튼"
                    />
                  </button>
                  <button
                    className="buttonCase"
                    onClick={() => handleDeleteClick(plan.planId)} // 삭제 클릭 핸들러 추가
                  >
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
        ))
      )}

      {/* PlanModify 모달 */}
      {showModifyModal && (
        <PlanModify
          planId={selectedPlanId}
          show={showModifyModal}
          onClose={handleCloseModifyModal}
        />
      )}
    </div>
  );
};

export default PlanList;
