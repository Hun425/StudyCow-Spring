import React, { useEffect, useState } from "react";
import useLearningStatusStore from "../../stores/learningStatus"; // 학습 상태 관리를 위한 zustand 스토어
import useInfoStore from "../../stores/infos"; // 사용자 정보 및 로그인 상태 관리를 위한 zustand 스토어
import useGradeStore from "../../stores/grade"; // 과목 선택 상태 관리를 위한 zustand 스토어
import useOpenAiStore from "../../stores/openAi"; // OpenAI 관련 zustand 스토어
import "./styles/LearningStatus.css"; // CSS 파일 가져오기

const LearningStatus = () => {
  // 학습 상태 스토어에서 상태와 함수를 가져오기
  const { subjectInfo, fetchSubjectInfo, clearSubjectInfo, error } =
    useLearningStatusStore();

  // 사용자 정보 스토어에서 로그인 상태와 사용자 정보를 가져오기
  const { isLogin, userInfo } = useInfoStore();

  // 과목 선택 스토어에서 selectedSubject 가져오기
  const { selectedSubject } = useGradeStore();

  // OpenAI 스토어에서 조언 생성 함수 가져오기
  const { generateAdvice } = useOpenAiStore();

  // 조언 요청 결과 상태 관리
  const [adviceResult, setAdviceResult] = useState(null);

  // 컴포넌트가 마운트될 때 학습 상태 데이터를 가져오기 위해 useEffect 사용
  useEffect(() => {
    if (isLogin && userInfo.userId !== 0 && selectedSubject) {
      // 로그인 상태 및 선택된 과목이 있을 때만 데이터 가져오기
      fetchSubjectInfo(selectedSubject);
    } else {
      // 선택된 과목이 없으면 정보를 초기화
      clearSubjectInfo();
    }
  }, [
    fetchSubjectInfo,
    selectedSubject,
    isLogin,
    userInfo.userId,
    clearSubjectInfo,
  ]);

  // 과목 변경 시 성적 조언 초기화
  useEffect(() => {
    setAdviceResult(null);
  }, [selectedSubject]);

  // 조언 생성 요청 함수
  const handleGenerateAdvice = async () => {
    if (subjectInfo) {
      const result = await generateAdvice(subjectInfo);
      if (result) {
        setAdviceResult(result.advice);
      } else {
        setAdviceResult("조언을 생성하는 데 실패했습니다.");
      }
    }
  };

  return (
    <div className="learning-status-container">
      <h1 className="learning-status-title">학습 현황</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* 오류 메시지 표시 */}
      {selectedSubject && subjectInfo ? (
        <>
          <div className="learning-status-table">
            <div className="learning-status-row">
              <span className="learning-status-label">
                플래너 누적 학습 시간
              </span>
              <span className="learning-status-value">
                {subjectInfo.sumStudyTime} 분
              </span>
            </div>
            <div className="learning-status-row">
              <span className="learning-status-label">현재 점수</span>
              <span className="learning-status-value">
                {subjectInfo.nowScore} 점
              </span>
            </div>
            <div className="learning-status-row">
              <span className="learning-status-label">최근 점수 변화</span>
              <span className="learning-status-value">
                {subjectInfo.diffScore} 점
              </span>
            </div>
          </div>

          {/* 조언 요청 버튼과 결과 표시 */}
          <div className="learning-status-advice-section">
            {!adviceResult && (
              <button
                onClick={handleGenerateAdvice}
                className="learning-status-advice-button"
              >
                성적 조언 받기
              </button>
            )}
            {adviceResult && (
              <div className="learning-status-advice-result">
                <p>{adviceResult}</p>
              </div>
            )}
          </div>
        </>
      ) : (
        <p>과목을 선택하세요.</p>
      )}
    </div>
  );
};

export default LearningStatus;
