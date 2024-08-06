import React, { useEffect } from "react";
import useLearningStatusStore from "../../stores/learningStatus"; // 학습 상태 관리를 위한 zustand 스토어
import useInfoStore from "../../stores/infos"; // 사용자 정보 및 로그인 상태 관리를 위한 zustand 스토어
import "./styles/LearningStatus.css"; // CSS 파일 가져오기

const LearningStatus = ({ subCode }) => {
  // 학습 상태 스토어에서 상태와 함수를 가져오기
  const { subjectInfo, fetchSubjectInfo, error } = useLearningStatusStore();

  // 사용자 정보 스토어에서 로그인 상태와 사용자 정보를 가져오기
  const { isLogin, userInfo } = useInfoStore();

  // 컴포넌트가 마운트될 때 학습 상태 데이터를 가져오기 위해 useEffect 사용
  useEffect(() => {
    if (isLogin && userInfo.userId !== 0 && subCode) {
      // 로그인 상태일 때만 데이터 가져오기
      fetchSubjectInfo(subCode);
    }
  }, [fetchSubjectInfo, subCode, isLogin, userInfo.userId]);

  return (
    <div className="learning-status-container">
      <h1 className="learning-status-title">학습 현황</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}{" "}
      {/* 오류 메시지 표시 */}
      {subjectInfo && (
        <div className="learning-status-table">
          <div className="learning-status-row">
            <span className="learning-status-label">목표</span>
            <span className="learning-status-value">
              {subjectInfo.targetScore} 점
            </span>
          </div>
          <div className="learning-status-row">
            <span className="learning-status-label">플래너 계획 시간</span>
            <span className="learning-status-value">
              시간 {/* 추가할 데이터 */}
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
      )}
    </div>
  );
};

export default LearningStatus;