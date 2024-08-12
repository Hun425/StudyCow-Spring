import React, { useState, useEffect } from "react";
import Calendar from "./Calendar.jsx";
import PlanList from "./PlanList";
import CatPlanList from "./CatPlanList.jsx";
import usePlanStore from "../../stores/plan.js";
import useSubjectStore from "../../stores/subjectStore"; // subject store import
import addButton from "./img/createButton.png"; // 기존 추가 버튼 이미지
import autoButton from "./img/autoAddButton.png"; // 자동 생성 버튼 이미지 경로
import AutoCreate from "./CreateModify/AutoCreate.jsx"; // AutoCreate 모달 컴포넌트 불러오기
import PlanCreate from "./CreateModify/PlanCreate"; // PlanCreate 모달 컴포넌트
import "./styles/MyPlanner.css"; // 스타일 파일 import

const MyPlanner = () => {
  // usePlanStore에서 date, subCode, filterPlansBySubCode, saveDate를 가져옵니다.
  const { date, subCode, filterPlansBySubCode, saveDate } = usePlanStore(
    (state) => ({
      date: state.date,
      subCode: state.subCode,
      filterPlansBySubCode: state.filterPlansBySubCode,
      saveDate: state.saveDate,
    })
  );

  const { subjects, fetchSubjects } = useSubjectStore(); // subject store 상태와 함수 가져오기

  const [selectedSubject, setSelectedSubject] = useState("");
  const [showAutoCreate, setShowAutoCreate] = useState(false); // AutoCreate 모달 가시성 상태 관리
  const [showPlanCreate, setShowPlanCreate] = useState(false); // PlanCreate 모달 가시성 상태 관리

  // 컴포넌트가 마운트될 때 과목 데이터를 가져옴
  useEffect(() => {
    fetchSubjects(); // 과목 데이터를 서버에서 가져옴
  }, [fetchSubjects]);

  // 페이지가 로드될 때 date 상태를 항상 오늘 날짜로 설정
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0"); // 월은 0부터 시작하므로 1을 더함
    const day = String(today.getDate()).padStart(2, "0");
    const formattedToday = `${year}-${month}-${day}`;

    saveDate(formattedToday); // 오늘 날짜로 설정
  }, [saveDate]); // 페이지가 로드될 때마다 실행

  // 선택된 과목에 따라 플랜 필터링
  useEffect(() => {
    const foundCode = subjects.find(
      (subject) => subject.subName === selectedSubject
    )?.subCode;
    filterPlansBySubCode(foundCode);
    const catPlanContent = document.querySelector(".MyPlanCatPlanContent");
    if (catPlanContent) {
      catPlanContent.scrollTop = 0; // 세부 과목 목록 스크롤 위치 초기화
    }
  }, [selectedSubject, filterPlansBySubCode, subjects]);

  // AutoCreate 모달 열기
  const handleOpenAutoCreate = () => {
    setShowAutoCreate(true);
  };

  // AutoCreate 모달 닫기
  const handleCloseAutoCreate = () => {
    setShowAutoCreate(false);
  };

  // PlanCreate 모달 열기
  const handleOpenPlanCreate = () => {
    setShowPlanCreate(true);
  };

  // PlanCreate 모달 닫기
  const handleClosePlanCreate = () => {
    setShowPlanCreate(false);
  };

  return (
    <>
    <div className="MyPlannerMain">
      <div className="MyPlanDatePlanContainer">
        <div className="MyPlanDateCalendar">
          <Calendar />
        </div>
        <div className="MyPlanDatePlanbox">
          <div className="MyPlanDatePlanDate">
            <div className="MyPlanEmptyCase" />
            <div className="MyPlanDateCase">
              <p>{date}</p> {/* 전역 상태의 날짜를 표시 */}
            </div>

            <div className="MyPlanButtonContainer">
              {/* 자동 생성 버튼 */}
              <button onClick={handleOpenAutoCreate}>
                <div className="MyPlanAutoButton">
                  <img
                    className="MyPlanIconImage"
                    src={autoButton} // 올바른 경로로 변경
                    alt="자동생성 버튼"
                  />
                </div>
              </button>

              {/* 플래너 추가 버튼 (모달 열기) */}
              <button onClick={handleOpenPlanCreate}>
                <img
                  className="MyPlanAddButton"
                  src={addButton}
                  alt="추가버튼"
                />
              </button>
            </div>
          </div>
          <div className="MyPlanDatePlanContent">
            <PlanList className="MyPlanPlanListItem" />
          </div>
        </div>
      </div>
      <div className="MyPlanCatPlanContainer">
        <div className="MyPlanCatPlanHeader">
          <div className="MyPlanCatSelectbar">
            <select
              id="subject"
              name="subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
              value={selectedSubject}
              className="form-control ml-2 MyPlanCatSelectControl"
            >
              <option value="" disabled hidden>
                과목 선택
              </option>
              {subjects.map((subject) => (
                <option key={subject.subCode} value={subject.subName}>
                  {subject.subName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="MyPlanCatPlanTitle">
          <p>
            {subCode
              ? subjects.find((s) => s.subCode === subCode)?.subName ||
                "과목을 선택하세요"
              : "과목을 선택하세요"}
          </p>
        </div>
        <div className="MyPlanCatPlanbox">
          <div className="MyPlanCatPlanContent">
            <CatPlanList />
          </div>
        </div>
      </div>

      {/* AutoCreate 모달 창 */}
      <AutoCreate show={showAutoCreate} onClose={handleCloseAutoCreate} />

      {/* PlanCreate 모달 창 */}
      <PlanCreate show={showPlanCreate} onClose={handleClosePlanCreate} />
    </div>
    </>
  );
};

export default MyPlanner;
