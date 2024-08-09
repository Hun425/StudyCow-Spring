import "./styles/MainGradeItem.css";
import { useEffect } from "react";
import useGradeStore from "../../stores/grade";
import RecentGradeGraph from "../TestAnalyze/RecentGradeGraph";
import useSubjectStore from "../../stores/subjectStore";

const MainGradeItem = () => {
  const { subjects, fetchSubjects } = useSubjectStore();

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const { selectedSubject, setSelectedSubject } = useGradeStore();

  const handleSubjectChange = (e) => {
    const key = e.target.value;
    setSelectedSubject(key);
    console.log(key); // selectedSubject 변경 시 콘솔에 출력
  };

  return (
    <div className="mainGradeContainer">
      <div className="mainGradeHeader">
        <h3>과목별 성적 현황</h3>
        <div className="mainGradeSubjectSelect">
          <select
            id="subject"
            name="subject"
            onChange={handleSubjectChange}
            value={selectedSubject}
            className="form-control ml-2"
          >
            {/* disabled: 과목을 선택한 후 select list에 '과목 선택'을 선택할 수 없게 함
            hidden: 과목을 선택한 후 select list에 '과목 선택'이 보이지 않게 함 */}
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
      <RecentGradeGraph />
    </div>
  );
};

export default MainGradeItem;
