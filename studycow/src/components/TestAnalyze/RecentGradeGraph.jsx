import { useEffect } from "react";
import "./styles/RecentGradeGraph.css";
import useInfoStore from "../../stores/infos";
import useGradeStore from "../../stores/grade";

const RecentGradeGraph = () => {
  const { userId } = useInfoStore((state) => ({
    userId: state.userInfo.userId,
  }));

  const { selectedSubject, subjectGrades, fetchSelectedSubjectGrade } =
    useGradeStore((state) => ({
      selectedSubject: state.selectedSubject,
      subjectGrades: state.subjectGrades,
      fetchSelectedSubjectGrade: state.fetchSelectedSubjectGrade,
    }));

  useEffect(() => {
    if (selectedSubject) {
      // 성적 데이터를 가져오는 함수 호출
      fetchSelectedSubjectGrade(userId, selectedSubject);
    }
  }, [userId, selectedSubject, fetchSelectedSubjectGrade]);

  console.log(subjectGrades);

  return (
    <div className="subjectGradeGraph">
      <h1>최근 성적 변화 그래프</h1>
    </div>
  );
};

export default RecentGradeGraph;
