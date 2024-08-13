import React, { useEffect } from "react";
import usePlanStore from "../../stores/plan"; // usePlanStore를 import 합니다.
import "./styles/MainPlanItem.css";
import { useNavigate } from "react-router-dom";
import MainTodayTodo from "./MainTodayTodo";

// 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const MainPlanItem = () => {
  const { todayPlans, getTodayPlanRequest } = usePlanStore((state) => ({
    todayPlans: state.todayPlans,
    getTodayPlanRequest: state.getTodayPlanRequest,
  }));

  const today = getTodayDate();

  const navigate = useNavigate();
  function goPlanner() {
    navigate("/plan");
  }

  // 컴포넌트가 마운트될 때 오늘의 플랜을 가져옵니다.
  useEffect(() => {
    getTodayPlanRequest(today);
  }, [today, getTodayPlanRequest]);

  return (
    <div className="mainPlanMover">
      <div className="mainPlanContainer">
        <h1 className="mainTodayTodo">오늘의 할일</h1>
        <MainTodayTodo todayPlans={todayPlans} />
        <button className="goToPlanPage" onClick={goPlanner}>
          플래너로 바로가기
        </button>
      </div>
    </div>
  );
};

export default MainPlanItem;
