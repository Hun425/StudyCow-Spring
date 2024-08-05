// AIPlannerModal.jsx

import React from "react";
import useOpenAiStore from "../../../stores/openAi"; // openAi 스토어 가져오기
import usePlanStore from "../../../stores/plan"; // PlanStore 가져오기
import "./styles/AIPlannerModal.css"; // 스타일 임포트

const AIPlannerModal = ({ show, onClose, analysis, plans }) => {
  const { registerPlans } = useOpenAiStore(); // AI 플래너 등록 함수 가져오기
  const { getDatePlanRequest } = usePlanStore(); // 데이터 갱신 함수 가져오기

  const handleRegister = async () => {
    const success = await registerPlans(plans); // 플래너 등록
    if (success) {
      alert("플래너가 성공적으로 등록되었습니다.");
      await getDatePlanRequest(plans[0].planDate); // 첫 번째 플랜 날짜 기준으로 데이터 갱신
      onClose(); // 모달 닫기
    } else {
      alert("플래너 등록에 실패했습니다.");
    }
  };

  if (!show) return null;

  return (
    <div className="AIPlannerModalOverlay">
      <div className="AIPlannerModalContent">
        <h2>AI 플래너 분석 결과</h2>
        <p>{analysis}</p> {/* AI 분석 결과 표시 */}
        <ul>
          {plans.map((plan, index) => (
            <li key={index}>
              <strong>날짜:</strong> {plan.planDate} /{" "}
              <strong>과목 코드:</strong> {plan.subCode} /{" "}
              <strong>내용:</strong> {plan.planContent} / <strong>시간:</strong>{" "}
              {plan.planStudyTime}분
            </li>
          ))}
        </ul>
        <div className="AIPlannerModalButtons">
          <button
            onClick={handleRegister}
            className="AIPlannerModalRegisterButton"
          >
            등록
          </button>
          <button onClick={onClose} className="AIPlannerModalCloseButton">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPlannerModal;
