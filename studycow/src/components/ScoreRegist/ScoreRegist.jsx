import React, { useState, useEffect } from "react";
import "./styles/ScoreRegist.css";
import useScoreStore from "../../stores/scoreRegist";

// 과목 이름과 코드의 매핑 딕셔너리
const catCodeMap = {
  독서: 1,
  문학: 2,
  "화법과 작문": 3,
  "언어와 매체": 4,
  수학1: 5,
  수학2: 6,
  미적분: 7,
  기하: 8,
  "확률과 통계": 9,
  듣기: 10,
  읽기: 11,
  한국사: 12,
  "생활과 윤리": 13,
  "윤리와 사상": 14,
  한국지리: 15,
  세계지리: 16,
  동아시아사: 17,
  세계사: 18,
  경제: 19,
  "정치와 법": 20,
  "사회 문화": 21,
  물리학1: 22,
  물리학2: 23,
  화학1: 24,
  화학2: 25,
  생명과학1: 26,
  생명과학2: 27,
  지구과학1: 28,
  지구과학2: 29,
  "농업 기초 기술": 30,
  "공업 일반": 31,
  "상업 경제": 32,
  "수산 해운 산업 기초": 33,
  "인간 발달": 34,
  "성공적인 직업생활": 35,
  독일어1: 36,
  프랑스어1: 37,
  스페인어1: 38,
  중국어1: 39,
  일본어1: 40,
  러시아어1: 41,
  아랍어1: 42,
  베트남어1: 43,
  한문1: 44,
};

// 과목 및 세부 과목 목록
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

// 각 과목에 대한 세부 과목
const wrongTypes = {
  국어: ["독서", "문학", "화법과 작문", "언어와 매체"],
  수학: ["수학1", "수학2", "미적분", "기하", "확률과 통계"],
  영어: ["듣기", "읽기"],
  한국사: ["한국사"],
  사회탐구: [
    "생활과 윤리",
    "윤리와 사상",
    "한국지리",
    "세계지리",
    "동아시아사",
    "세계사",
    "경제",
    "정치와 법",
    "사회 문화",
  ],
  과학탐구: [
    "물리학1",
    "물리학2",
    "화학1",
    "화학2",
    "생명과학1",
    "생명과학2",
    "지구과학1",
    "지구과학2",
  ],
  직업탐구: [
    "농업 기초 기술",
    "공업 일반",
    "상업 경제",
    "수산 해운 산업 기초",
    "인간 발달",
    "성공적인 직업생활",
  ],
  "제2외국어/한문": [
    "독일어1",
    "프랑스어1",
    "스페인어1",
    "중국어1",
    "일본어1",
    "러시아어1",
    "아랍어1",
    "베트남어1",
    "한문1",
  ],
};

const ScoreRegist = () => {
  const { updateScore, submitScore } = useScoreStore(); // 상태 관리 및 서버 전송 함수
  const [subjectCode, setSubjectCode] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testScore, setTestScore] = useState("");
  const [testGrade, setTestGrade] = useState("");
  const [wrongs, setWrongs] = useState([{ catCode: "", wrongCnt: "" }]);
  const [availableWrongTypes, setAvailableWrongTypes] = useState([]);
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  const subjects = Object.entries(sub_code_dic);
  const grades = Array.from({ length: 9 }, (_, i) => `${i + 1}등급`);

  // 과목이 선택되었을 때 오답 유형을 업데이트
  useEffect(() => {
    if (subjectCode) {
      const subjectName = sub_code_dic[subjectCode];
      setAvailableWrongTypes(wrongTypes[subjectName] || []);
      // 과목이 바뀌면 기존 오답 폼 및 입력 필드 초기화
      setWrongs([{ catCode: "", wrongCnt: "" }]);
      setTestDate("");
      setTestScore("");
      setTestGrade("");
      setErrorMessage(""); // 오류 메시지 초기화
    } else {
      setAvailableWrongTypes([]);
    }
  }, [subjectCode]);

  // 핸들러 함수들
  const handleSubjectChange = (e) => {
    const code = e.target.value;
    setSubjectCode(code);
    updateScore("subCode", parseInt(code, 10)); // 상태 업데이트
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setTestDate(date);
    updateScore("testDate", date); // 상태 업데이트
  };

  // 점수는 0 이상 100 이하만 입력 가능
  const handleScoreChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const validValue = Math.max(0, Math.min(100, isNaN(value) ? 0 : value)); // 0에서 100 사이로 제한
    setTestScore(validValue);
    updateScore("testScore", validValue); // 상태 업데이트
  };

  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setTestGrade(grade);
    updateScore("testGrade", parseInt(grade, 10)); // 상태 업데이트
  };

  const handleWrongChange = (index, field, value) => {
    const newWrongs = [...wrongs];
    if (field === "wrongCnt") {
      const parsedValue = parseInt(value, 10);
      const validValue = Math.max(0, isNaN(parsedValue) ? 0 : parsedValue); // 0 이상의 값으로 제한
      newWrongs[index][field] = validValue;
    } else if (field === "catCode") {
      newWrongs[index][field] = catCodeMap[value]; // 과목 이름을 catCode로 변환
    }
    setWrongs(newWrongs);
    updateScore("scoreDetails", newWrongs); // 상태 업데이트: "scoreDetails"로 변경
  };

  const addWrongForm = () => {
    const newWrongs = [...wrongs, { catCode: "", wrongCnt: "" }];
    setWrongs(newWrongs);
    updateScore("scoreDetails", newWrongs); // 상태 업데이트: "scoreDetails"로 변경
  };

  const removeWrongForm = (index) => {
    const newWrongs = wrongs.filter((_, i) => i !== index);
    setWrongs(newWrongs);
    updateScore("scoreDetails", newWrongs); // 상태 업데이트: "scoreDetails"로 변경
  };

  const validateForm = () => {
    if (!subjectCode) {
      setErrorMessage("과목을 선택하세요.");
      return false;
    }
    if (!testDate) {
      setErrorMessage("시험 날짜를 선택하세요.");
      return false;
    }
    if (testScore === "") {
      setErrorMessage("점수를 입력하세요.");
      return false;
    }
    if (!testGrade) {
      setErrorMessage("등급을 선택하세요.");
      return false;
    }
    setErrorMessage(""); // 모든 필드가 유효하면 오류 메시지 초기화
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // 유효성 검사를 통과하지 못하면 폼을 제출하지 않음
    }

    // 실제 데이터 전송 호출
    submitScore();
  };

  return (
    <div className="ScoreRegist-container">
      {/* 성적 등록 */}
      <div className="ScoreRegist-register">
        <h3>성적 등록</h3>
        {errorMessage && <p className="ScoreRegist-error">{errorMessage}</p>}
        <div className="ScoreRegist-form">
          <select
            className="ScoreRegist-select"
            value={subjectCode}
            onChange={handleSubjectChange}
            required
          >
            <option value="" disabled hidden>
              과목 선택
            </option>
            {subjects.map(([key, value]) => (
              <option key={key} value={key}>
                {value}
              </option>
            ))}
          </select>
          <input
            type="date"
            className="ScoreRegist-input-date"
            value={testDate}
            onChange={handleDateChange}
            placeholder="응시일 선택"
            required
          />
        </div>
        <div className="ScoreRegist-form">
          <input
            type="number"
            className="ScoreRegist-input-number"
            min="0"
            max="100"
            value={testScore}
            onChange={handleScoreChange}
            placeholder="점수 입력"
            required
          />
          <select
            className="ScoreRegist-select"
            value={testGrade}
            onChange={handleGradeChange}
            required
          >
            <option value="" disabled hidden>
              등급 선택
            </option>
            {grades.map((grade, index) => (
              <option key={index} value={index + 1}>
                {grade}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 오답 등록 */}
      <div className="ScoreRegist-mistake-register">
        <h3>오답 등록(선택사항)</h3>
        {wrongs.map((wrong, index) => (
          <div key={index} className="ScoreRegist-mistake-form">
            <select
              className="ScoreRegist-select"
              value={
                wrong.catCode
                  ? Object.keys(catCodeMap).find(
                      (key) => catCodeMap[key] === wrong.catCode
                    )
                  : ""
              }
              onChange={(e) =>
                handleWrongChange(index, "catCode", e.target.value)
              }
              disabled={!subjectCode} // 과목이 선택되지 않으면 비활성화
              required
            >
              <option value="" disabled hidden>
                오답 유형 선택
              </option>
              {availableWrongTypes.map((type, i) => (
                <option key={i} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <input
              type="number"
              className="ScoreRegist-input-number"
              min="0"
              value={wrong.wrongCnt}
              onChange={(e) =>
                handleWrongChange(index, "wrongCnt", e.target.value)
              }
              placeholder="오답 개수"
              disabled={!subjectCode} // 과목이 선택되지 않으면 비활성화
              required
            />
            <button
              className="ScoreRegist-remove-btn"
              onClick={() => removeWrongForm(index)}
            >
              삭제
            </button>
          </div>
        ))}
        <button className="ScoreRegist-add-btn" onClick={addWrongForm}>
          +
        </button>
      </div>

      {/* 버튼들 */}
      <div className="ScoreRegist-button-group">
        <button className="ScoreRegist-register-btn" onClick={handleSubmit}>
          등록하기
        </button>
        <button className="ScoreRegist-cancel-btn">취소</button>
      </div>
    </div>
  );
};

export default ScoreRegist;
