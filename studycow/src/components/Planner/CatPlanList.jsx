import React, { useState, useEffect } from "react";
import deleteButton from "./img/deleteButton.png";
import editButton from "./img/editButton.png";
import usePlanStore from "../../stores/plan.js";
import useSubjectStore from "../../stores/subjectStore"; // subject store import
import PlanModify from "./CreateModify/PlanModify"; // Import the PlanModify modal
import "./styles/CatPlanList.css";

const CatPlanList = () => {
  const {
    plans,
    subPlans,
    changePlanStatus,
    deletePlan,
    getSubjectPlans, // 과목별 플랜을 가져오는 함수
    setSubPlans,
    subCode,
    date,
  } = usePlanStore();

  const { subjects } = useSubjectStore();

  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [showModifyModal, setShowModifyModal] = useState(false);

  const getSubjectName = (subCode) => {
    const subject = subjects.find((s) => s.subCode === subCode);
    return subject ? subject.subName : "알 수 없는 과목";
  };

  const fetchPlans = async () => {
    if (!subCode) {
      return;
    }
    const plans = await getSubjectPlans(subCode);
    if (plans) {
      const filteredPlans = plans.filter((plan) => plan.planDate === date); // 날짜로 필터링
      setSubPlans(filteredPlans);
    } else {
      setSubPlans([]);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [subCode, date]); // date와 subCode가 변경될 때마다 fetchPlans 호출

  const formatPlanStudyTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${String(hours).padStart(2, "0")}:${String(
      remainingMinutes
    ).padStart(2, "0")}`;
  };

  const handleCheckboxChange = async (planId) => {
    try {
      const success = await changePlanStatus(planId);
      if (success) {
        const updatedPlans = subPlans.map((plan) =>
          plan.planId === planId
            ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
            : plan
        );
        setSubPlans(updatedPlans);
      } else {
        alert("플랜 상태 변경에 실패했습니다.");
      }
    } catch (error) {
      console.error("플랜 상태 변경 중 오류가 발생했습니다:", error);
      alert("플랜 상태 변경 중 오류가 발생했습니다.");
    }
  };

  const handleEditClick = (planId) => {
    setSelectedPlanId(planId);
    setShowModifyModal(true);
  };

  const handleCloseModifyModal = () => {
    setShowModifyModal(false);
    setSelectedPlanId(null);
  };

  const handleDeleteClick = async (planId) => {
    const confirmed = window.confirm("정말로 삭제하시겠습니까?");
    if (confirmed) {
      try {
        const success = await deletePlan(planId);
        if (success) {
          alert("플래너가 성공적으로 삭제되었습니다.");
          const filteredPlans = subPlans.filter(
            (plan) => plan.planId !== planId
          );
          setSubPlans(filteredPlans);
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
      {Array.isArray(subPlans) && subPlans.length === 0 && subCode > 0 ? (
        <p className="singleSubNoPlan">해당 과목에 등록된 플랜이 없습니다.</p>
      ) : (
        Array.isArray(subPlans) &&
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
                {`${plan.planDate}`}{" "}
                {`${formatPlanStudyTime(plan.planStudyTime)}`}{" "}
              </span>
            </div>
            <p className="singleSubPlanContentText">{`${plan.planContent}`}</p>{" "}
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
                onClick={() => handleDeleteClick(plan.planId)}
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
