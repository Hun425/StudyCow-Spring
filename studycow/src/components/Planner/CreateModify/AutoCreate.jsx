// AutoCreate.jsx

import React, { useState } from "react";
import useOpenAiStore from "../../../stores/openAi"; // openAi 스토어 가져오기
import AIPlannerModal from "./AIPlannerModal"; // AIPlannerModal 컴포넌트 임포트
import "./styles/AutoCreate.css"; // 스타일 임포트

const AutoCreate = ({ show, onClose }) => {
  const { generatePlanner } = useOpenAiStore(); // AI 플래너 생성 함수 가져오기

  const [requestDay, setRequestDay] = useState(5);
  const [startDay, setStartDay] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [studyTime, setStudyTime] = useState(300);

  const [aiPlans, setAiPlans] = useState([]); // AI 플래너 계획 저장 상태
  const [analysis, setAnalysis] = useState(""); // AI 분석 결과 저장 상태
  const [showAIPlannerModal, setShowAIPlannerModal] = useState(false); // AIPlannerModal 표시 여부 상태

  const handleCreate = async () => {
    const result = await generatePlanner(requestDay, startDay, studyTime);
    if (result) {
      setAnalysis(result.analysis);
      setAiPlans(result.plans);
      setShowAIPlannerModal(true); // AIPlannerModal 열기
    } else {
      alert("플래너 생성에 실패했습니다.");
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="AutoCreateModalOverlay">
        <div className="AutoCreateModalContent">
          <h2>AI 플래너 자동 생성</h2>
          <div className="AutoCreate-form-group">
            <label>몇일치 생성할까요?</label>
            <input
              type="number"
              value={requestDay}
              onChange={(e) => setRequestDay(Number(e.target.value))}
              min="1"
              max="7"
            />
          </div>
          <div className="AutoCreate-form-group">
            <label>시작 날짜</label>
            <input
              type="date"
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
            />
          </div>
          <div className="AutoCreate-form-group">
            <label>하루 공부 시간 (분)</label>
            <input
              type="number"
              value={studyTime}
              onChange={(e) => setStudyTime(Number(e.target.value))}
              min="60"
              max="1440"
            />
          </div>
          <div className="AutoCreate-form-buttons">
            <button
              onClick={handleCreate}
              className="AutoCreate-register-button"
            >
              생성
            </button>
            <button onClick={onClose} className="AutoCreateCloseButton">
              취소
            </button>
          </div>
        </div>
      </div>

      {/* AIPlannerModal 컴포넌트 */}
      <AIPlannerModal
        show={showAIPlannerModal}
        onClose={() => setShowAIPlannerModal(false)}
        analysis={analysis}
        plans={aiPlans}
      />
    </>
  );
};

export default AutoCreate;
