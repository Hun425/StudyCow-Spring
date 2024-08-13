import React, { useEffect } from "react";
import useFriendStatusStore from "../../stores/friendStatus"; // 학습 상태 관리를 위한 zustand 스토어
import useGradeStore from "../../stores/grade"; // 과목 선택 상태 관리를 위한 zustand 스토어
import "./styles/FriendLearningStatus.css"; // CSS 파일 가져오기

const FriendLearningStatus = ({ userId }) => {
  // 학습 상태 스토어에서 상태와 함수를 가져오기
  const { subjectInfo, fetchSubjectInfo, error } = useFriendStatusStore();

  // 과목 선택 스토어에서 selectedSubject 가져오기
  const { selectedSubject } = useGradeStore();

  // 컴포넌트가 마운트될 때 학습 상태 데이터를 가져오기 위해 useEffect 사용
  useEffect(() => {
    fetchSubjectInfo(userId, selectedSubject);
  }, [fetchSubjectInfo, userId, selectedSubject]);

  return (
    <div className="learningStatusMain">
      <h1 className="learningStatusTitle">학습 현황</h1>
      <div className="learningStatusContainer">
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* 오류 메시지 표시 */}
        {selectedSubject && subjectInfo ? (
          <>
            <div className="learningStatusTable">
              <div className="learningStatusRow">
                <span className="learningStatusLabel">
                  플래너 누적 학습 시간
                </span>
                <span className="learningStatusValue">
                  {subjectInfo.sumStudyTime} 분
                </span>
              </div>
              <div className="learningStatusRow">
                <span className="learningStatusLabel">현재 점수</span>
                <span className="learningStatusValue">
                  {subjectInfo.nowScore} 점
                </span>
              </div>
              <div className="learningStatusRow">
                <span className="learningStatusLabel">최근 점수 변화</span>
                <span className="learningStatusValue">
                  {subjectInfo.diffScore} 점
                </span>
              </div>
            </div>
          </>
        ) : (
          <p>과목을 선택하세요.</p>
        )}
      </div>
    </div>
  );
};

export default FriendLearningStatus;
