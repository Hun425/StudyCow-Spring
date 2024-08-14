import React, { useState, useEffect } from "react";
import "./styles/PlanList.css";
import deleteButton from "./img/deleteButton.png";
import editButton from "./img/editButton.png";
import usePlanStore from "../../stores/plan";
import useSubjectStore from "../../stores/subjectStore"; // subject store import
import PlanModify from "./CreateModify/PlanModify"; // PlanModify 모달 컴포넌트
import Notiflix from "notiflix";
import { Confirm } from "notiflix"; // Notiflix import 추가

const PlanList = () => {
  const { plans, changePlanStatus, deletePlan, setPlans } = usePlanStore(); // changePlanStatus 가져오기
  const { subjects, fetchSubjects } = useSubjectStore(); // Subject store 상태와 함수 가져오기

  const [selectedPlanId, setSelectedPlanId] = useState(null); // 수정할 계획의 ID
  const [showModifyModal, setShowModifyModal] = useState(false); // 모달 가시성 상태

  // 과목 데이터를 가져오는 useEffect
  useEffect(() => {
    fetchSubjects(); // 컴포넌트가 마운트될 때 과목 데이터 가져오기
  }, [fetchSubjects]);

  // 상태 업데이트 핸들러를 changePlanStatus로 대체
  const handleCheckboxChange = async (planId) => {
    try {
      const success = await changePlanStatus(planId); // 상태 변경 요청
      if (!success) {
        Notiflix.Notify.failure("플랜 상태 변경에 실패했습니다.");
      }
    } catch (error) {
      Notiflix.Notify.failure("플랜 상태 변경에 실패했습니다.");
    }
  };

  const handleEditClick = (planId) => {
    setSelectedPlanId(planId); // 수정할 계획 ID 설정
    setShowModifyModal(true); // PlanModify 모달 열기
  };

  const handleCloseModifyModal = () => {
    setShowModifyModal(false); // PlanModify 모달 닫기
    setSelectedPlanId(null); // 선택된 계획 ID 초기화
  };

  // 삭제 핸들러 함수
  const handleDeleteClick = async (planId) => {
    Confirm.init({
      titleColor: "#ff5549", // 빨간색 (빨간색은 #ff5549, 초록색은 #008000)
      okButtonBackground: "#ff5549", // 빨간색
      cancelButtonBackground: "#a9a9a9", // 회색
      titleFontSize: "20px", // 제목 폰트 크기 증가
      width: "300px", // 대화상자 너비 설정
      messageColor: "#1e1e1e", // 메시지 색상 설정
      messageFontSize: "16px", // 메시지 폰트 크기 설정
      buttonsFontSize: "14px", // 버튼 폰트 크기 설정
      borderRadius: "20px",
    });

    Notiflix.Confirm.show(
      "플랜 삭제",
      "정말로 삭제하시겠습니까?",
      "예",
      "아니오",
      async () => {
        try {
          const success = await deletePlan(planId);
          if (success) {
            Notiflix.Notify.success("플랜이 성공적으로 삭제되었습니다.");
            setPlans(plans.filter((plan) => plan.planId !== planId)); // 상태 갱신
          } else {
            Notiflix.Notify.failure("플랜 삭제에 실패했습니다.");
          }
        } catch (error) {
          Notiflix.Notify.failure("플랜 삭제에 실패했습니다.");
        }
      },
      () => {
        Notiflix.Notify.info("플랜 삭제가 취소되었습니다.");
      }
    );
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

  const getSubjectName = (subCode) => {
    const subject = subjects.find((s) => s.subCode === subCode);
    return subject ? subject.subName : "알 수 없는 과목";
  };

  return (
    <div className="singlePlanBox">
      {plans.length === 0 ? (
        <p>플랜을 등록하세요.</p>
      ) : (
        plans.map((plan) => (
          <div
            key={plan.planId}
            className={`singlePlanContent ${
              plan.planStatus === 1 ? "singlePlanContentCompleted" : ""
            }`}
          >
            <div className="singlePlanCheckboxContainer">
              <input
                type="checkbox"
                className="singlePlanCheckbox"
                checked={plan.planStatus === 1}
                onChange={() => handleCheckboxChange(plan.planId)} // 상태 변경 함수 사용
              />
              <span className="singlePlanStudyTime">
                {`${formatPlanStudyTime(plan.planStudyTime)}`}{" "}
              </span>
            </div>
            <p>{getSubjectName(plan.subCode)}</p> {/* 과목 표시 */}
            <div className="singlePlanButtonBox">
              <button
                className="singlePlanButtonCase"
                onClick={() => handleEditClick(plan.planId)}
              >
                <img
                  className="singlePlanEditButton"
                  src={editButton}
                  alt="수정버튼"
                />
              </button>
              <button
                className="singlePlanButtonCase"
                onClick={() => handleDeleteClick(plan.planId)} // 삭제 클릭 핸들러 추가
              >
                <img
                  className="singlePlanDeleteButton"
                  src={deleteButton}
                  alt="삭제버튼"
                />
              </button>
            </div>
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
