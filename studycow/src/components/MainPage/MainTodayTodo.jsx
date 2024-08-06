import React from "react";
import "./styles/MainTodayTodo.css";

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

const MainTodayTodo = ({ todayPlans }) => {
  return (
    <div className="mainTodayTodoList">
      {todayPlans.length > 0 ? (
        todayPlans.map((plan) => {
          const hours = Math.floor(plan.planStudyTime / 60);
          const minutes = plan.planStudyTime % 60;
          const subjectName = sub_code_dic[plan.subCode];
          return (
            <div key={plan.planId} className="mainTodayTodoItem">
              <p>
                {plan.planContent}({subjectName})
              </p>
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
