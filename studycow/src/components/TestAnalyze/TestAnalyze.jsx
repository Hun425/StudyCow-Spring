import useInfoStore from "../../stores/infos";
import "./styles/TestAnalyze.css";
import { useState } from "react";
import GradeAnalyzeBox from "./GradeAnalyzeBox";
import useGradeStore from "../../stores/grade";

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

const TestAnalyze = () => {
  const { userInfo } = useInfoStore();
  const { selectedSubject, setSelectedSubject } = useGradeStore();

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
            id="subject"
            name="subject"
            onChange={handleSubjectChange}
            value={selectedSubject}
            className="form-control ml-2"
          >
            <option value="" disabled hidden>
              과목 선택
            </option>
            {Object.entries(sub_code_dic).map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="analyzeBody">
        <div className="analyzeCowStatus">
          <h1>욕군정환</h1>
        </div>
        <GradeAnalyzeBox subject={selectedSubject} />
      </div>
    </div>
  );
};

export default TestAnalyze;
