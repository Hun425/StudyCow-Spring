import React, { useEffect } from "react";
import useInfoStore from "../../stores/infos";
import "./styles/TestAnalyze.css";
import GradeAnalyzeBox from "./GradeAnalyzeBox";
import useGradeStore from "../../stores/grade";
import useSubjectStore from "../../stores/subjectStore";

const TestAnalyze = () => {
  const { userInfo } = useInfoStore();
  const { selectedSubject, setSelectedSubject } = useGradeStore();
  const { subjects, fetchSubjects } = useSubjectStore();

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubjectChange = (e) => {
    const key = e.target.value;
    setSelectedSubject(key);
    console.log(key); // selectedSubject 변경 시 콘솔에 출력
  };

  return (
    <div className="analyzeTotalContainer">
      <div className="analyzeHeader">
        <h1>{userInfo.userNickName}님 어서오세요</h1>
        <div className="gradeSubjectSelect">
          <select
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
      <div className="analyzeBody">
        <div className="analyzeCowStatus">
          <h1>캐릭터 부분</h1>
        </div>
        <GradeAnalyzeBox subject={selectedSubject} />
      </div>
    </div>
  );
};

export default TestAnalyze;
