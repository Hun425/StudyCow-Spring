import React, { useState, useEffect } from "react";
import Calendar from "./Calendar.jsx";
import PlanList from "./PlanList";
import CatPlanList from "./CatPlanList.jsx";
import usePlanStore from "../../stores/plan.js";
import addButton from "./img/createButton.png"; // 기존 추가 버튼 이미지
import autoButton from "./img/autoAddButton.png"; // 자동 생성 버튼 이미지 경로
import AutoCreate from "./CreateModify/AutoCreate.jsx"; // AutoCreate 모달 컴포넌트 불러오기
import PlanCreate from "./CreateModify/PlanCreate"; // PlanCreate 모달 컴포넌트
import "./styles/MyPlanner.css";

const sub_code_dic = {
  1: "국어",
  2: "수학",
  3: "영어",
  4: "한국사",
  5: "사회탐구",
  6: "과학탐구",
  7: "직업탐구",
  8: "제2외국어/한문",
};

const MyPlanner = () => {
  const { date, subCode, filterPlansBySubCode } = usePlanStore((state) => ({
    date: state.date,
    subCode: state.subCode,
    filterPlansBySubCode: state.filterPlansBySubCode,
  }));

  const [selectedSubject, setSelectedSubject] = useState("");
  const [showAutoCreate, setShowAutoCreate] = useState(false); // AutoCreate 모달 가시성 상태 관리
  const [showPlanCreate, setShowPlanCreate] = useState(false); // PlanCreate 모달 가시성 상태 관리

  useEffect(() => {
    const foundCode = Object.keys(sub_code_dic).find(
      (key) => sub_code_dic[key] === selectedSubject
    );
    filterPlansBySubCode(foundCode);
    const catPlanContent = document.querySelector(".MyPlanCatPlanContent");
    catPlanContent.scrollTop = 0;
  }, [selectedSubject, filterPlansBySubCode]);

  const handleOpenAutoCreate = () => {
    setShowAutoCreate(true); // AutoCreate 모달 열기
  };

  const handleCloseAutoCreate = () => {
    setShowAutoCreate(false); // AutoCreate 모달 닫기
  };

  const handleOpenPlanCreate = () => {
    setShowPlanCreate(true); // PlanCreate 모달 열기
  };

  const handleClosePlanCreate = () => {
    setShowPlanCreate(false); // PlanCreate 모달 닫기
  };

  return (
    <>
      <div className="MyPlanDatePlanContainer">
        <div className="MyPlanDateCalendar">
          <Calendar />
        </div>
        <div className="MyPlanDatePlanbox">
          <div className="MyPlanDatePlanDate">
            <div className="MyPlanEmptyCase" />
            <div className="MyPlanDateCase">
              <p>{date}</p>
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
              className="form-control ml-2"
            >
              <option value="" disabled hidden>
                과목 선택
              </option>
              {Object.entries(sub_code_dic).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="MyPlanCatPlanTitle">
          <p>{subCode ? sub_code_dic[subCode] : "과목을 선택하세요"}</p>
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
    </>
  );
};

export default MyPlanner;
