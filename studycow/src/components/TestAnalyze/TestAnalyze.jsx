import useInfoStore from "../../stores/infos";
import "./styles/TestAnalyze.css";
import { useState } from "react";
import GradeAnalyzeBox from "./GradeAnalyzeBox";

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
  const [selectedSubject, setSelectedSubject] = useState("");
  console.log(selectedSubject);

  return (
    <div className="analyzeTotalContainer">
      <div className="analyzeHeader">
        <h1>{userInfo.userNickName}님 어서오세요</h1>
        <div className="gradeSubjectSelect">
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
