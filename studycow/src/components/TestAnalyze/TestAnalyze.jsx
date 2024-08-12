import React, { useState, useEffect } from "react";
import useInfoStore from "../../stores/infos";
import "./styles/TestAnalyze.css";
import GradeAnalyzeBox from "./GradeAnalyzeBox";
import useGradeStore from "../../stores/grade";
import useSubjectStore from "../../stores/subjectStore";
import ScoreRegist from "../ScoreRegist/ScoreRegist"; // ScoreRegist 컴포넌트 가져오기
import UserGradeImage from "../GradeImg/GradeImg";

const TestAnalyze = () => {
  const { userInfo, updateUserPublicStatus } = useInfoStore(); // updateUserPublicStatus 추가
  const { selectedSubject, setSelectedSubject } = useGradeStore();
  const { subjects, fetchSubjects } = useSubjectStore();

  const [showScoreRegistModal, setShowScoreRegistModal] = useState(false); // 모달을 열고 닫는 상태

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubjectChange = (subjectCode) => {
    // 이미 선택된 과목이 다시 선택되었을 때 처리
    if (selectedSubject === subjectCode) {
      setSelectedSubject(""); // 일시적으로 선택을 해제
      setTimeout(() => setSelectedSubject(subjectCode), 0); // 바로 다시 선택된 과목으로 설정
    } else {
      setSelectedSubject(subjectCode);
    }
    // console.log(subjectCode); // selectedSubject 변경 시 콘솔에 출력
  };

  const openModal = () => {
    setShowScoreRegistModal(true);
  };

  const closeModal = () => {
    setShowScoreRegistModal(false);
  };

  const handleScoreSubmit = (registeredSubjectCode) => {
    closeModal(); // 모달을 닫고
    handleSubjectChange(registeredSubjectCode); // 방금 등록한 과목으로 새로고침
  };

  const handlePublicToggle = async () => {
    const newPublicStatus = !userInfo.userPublic; // 현재 공개여부를 반전시킴
    const success = await updateUserPublicStatus(newPublicStatus);
  };

  return (
    <div className="analyzeTotalContainer">
      <div className="analyzeHeader">
        <h1>{userInfo.userNickName}님 어서오세요</h1>

        <div className="analyzeSideNav">
          <button
            className="analyzeScoreRegistButton"
            onClick={handlePublicToggle}
          >
            {userInfo.userPublic ? "비공개로 설정" : "공개로 설정"}
          </button>

          {/* 성적 등록 버튼 */}
          <button className="analyzeScoreRegistButton" onClick={openModal}>
            성적 등록
          </button>

          <div className="gradeSubjectSelect">
            <select
              name="subject"
              onChange={(e) => handleSubjectChange(e.target.value)}
              value={selectedSubject}
              className="form-control ml-2"
            >
              <option value="" disabled hidden>
                과목 선택
              </option>
              {subjects.map((subject) => (
                <option key={subject.subCode} value={subject.subCode}>
                  {subject.subName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="analyzeBody">
        <div className="analyzeCowStatus">
          <UserGradeImage />
        </div>
        <div className="analyzeGradeStatus">
          <GradeAnalyzeBox subject={selectedSubject} />
        </div>
      </div>

      {/* 모달 영역 */}
      {showScoreRegistModal && (
        <div className="analyzeModal-overlay">
          <div className="analyzeModal-content">
            <ScoreRegist
              onCancel={closeModal}
              onSubmit={handleScoreSubmit} // onSubmit으로 handleScoreSubmit을 전달
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TestAnalyze;
