import { useEffect } from "react";
import "./styles/MainTodayTodo.css";
import useSubjectStore from "../../stores/subjectStore";

const MainTodayTodo = ({ todayPlans }) => {
  const { subjects, fetchSubjects } = useSubjectStore();

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return (
    <div className="mainTodayTodoList">
      {todayPlans.length > 0 ? (
        todayPlans.map((plan) => {
          const hours = Math.floor(plan.planStudyTime / 60);
          const minutes = plan.planStudyTime % 60;
          // subjects 배열에서 plan.subCode와 일치하는 subName을 찾는다
          const subject = subjects.find(
            (subject) => subject.subCode === plan.subCode
          );
          const subjectName = subject ? subject.subName : "알 수 없는 과목";
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
