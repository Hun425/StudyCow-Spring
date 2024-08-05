import React from "react";
import "./styles/MainTodayTodo.css";

const MainTodayTodo = ({ todayPlans }) => {
  return (
    <div className="mainTodayTodoList">
      {todayPlans.length > 0 ? (
        todayPlans.map((plan) => {
          const hours = Math.floor(plan.planStudyTime / 60);
          const minutes = plan.planStudyTime % 60;
          return (
            <div key={plan.planId} className="mainTodayTodoItem">
              <p>{plan.planContent}</p>
              <p>
                {hours > 0 ? `${hours}시간 ` : ""}
                {minutes}분
              </p>
            </div>
          );
        })
      ) : (
        <p className="mainTodayTodoNone">아직 계획을 세우지 않은 것 같소</p>
      )}
    </div>
  );
};

export default MainTodayTodo;
