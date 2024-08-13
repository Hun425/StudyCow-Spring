import React, { useState, useEffect } from "react";
import useOpenAiStore from "../../../stores/openAi"; // openAi 스토어 가져오기
import usePlanStore from "../../../stores/plan"; // usePlanStore 임포트
import AIPlannerModal from "./AIPlannerModal"; // AIPlannerModal 컴포넌트 임포트
import LoadingPage from "../../../views/LoadingPage"; // 로딩 페이지 임포트
import "./styles/AutoCreate.css"; // 스타일 임포트
import Notiflix from "notiflix";

const AutoCreate = ({ show, onClose }) => {
  const { date } = usePlanStore((state) => ({
    date: state.date,
  }));

  const { generatePlanner } = useOpenAiStore(); // AI 플래너 생성 함수 가져오기
  const [startDay, setStartDay] = useState(date); // date로 초기화
  const [studyTime, setStudyTime] = useState(300);

  const [aiPlans, setAiPlans] = useState([]); // AI 플래너 계획 저장 상태
  const [analysis, setAnalysis] = useState(""); // AI 분석 결과 저장 상태
  const [showAIPlannerModal, setShowAIPlannerModal] = useState(false); // AIPlannerModal 표시 여부 상태
  const [loading, setLoading] = useState(false); // 로딩 상태

  useEffect(() => {
    setStartDay(date); // date가 변경될 때마다 startDay 업데이트
  }, [date]);

  const handleStudyTimeChange = (e) => {
    const value = Number(e.target.value);
    if (value < 60) {
      setStudyTime(60);
      Notiflix.Notify.warning("시간은 60분 이상으로 입력해 주세요.");
    } else if (value > 1440) {
      setStudyTime(1440);
      Notiflix.Notify.warning("시간은 1440분 이하로 입력해 주세요.");
    } else {
      setStudyTime(value);
    }
  };

  const handleCreate = async () => {
    setLoading(true); // 로딩 시작
    const result = await generatePlanner(startDay, studyTime);
    setLoading(false); // 로딩 종료
    if (result) {
      setAnalysis(result.analysis);
      setAiPlans(result.plans);
      setShowAIPlannerModal(true); // AIPlannerModal 열기
    } else {
      Notiflix.Notify.failure("생성에 실패하였습니다");
    }
  };

  if (!show) return null;

  return (
    <>
      {loading && <LoadingPage />} {/* 로딩 화면 표시 */}
      <div className="auto-create-modal-overlay">
        <div className="auto-create-modal-content">
          <h2>AI 플래너 자동 생성</h2>
          <div className="auto-create-form-group">
            <label>시작 날짜</label>
            <input
              type="date"
              value={startDay}
              onChange={(e) => setStartDay(e.target.value)}
            />
          </div>
          <div className="auto-create-form-group">
            <label>하루 공부 시간 (분)</label>
            <input
              type="number"
              value={studyTime}
              onChange={handleStudyTimeChange}
              min="60"
              max="1440"
            />
          </div>
          <div className="auto-create-form-buttons">
            <button
              onClick={handleCreate}
              className="auto-create-register-button"
            >
              생성
            </button>
            <button onClick={onClose} className="auto-create-close-button">
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
