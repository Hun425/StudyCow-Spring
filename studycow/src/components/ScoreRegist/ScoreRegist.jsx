import React, { useState, useEffect } from "react";
import "./styles/ScoreRegist.css";
import useScoreStore from "../../stores/scoreRegist";
import useSubjectStore from "../../stores/subjectStore"; // subject store import

const ScoreRegist = ({ onCancel, onSubmit }) => {
  // onSubmit prop 추가
  const { updateScore, submitScore } = useScoreStore(); // 상태 관리 및 서버 전송 함수
  const { subjects, fetchSubjects, problemTypes, fetchProblemTypes } =
    useSubjectStore(); // 스토어 상태 및 함수

  const [subjectCode, setSubjectCode] = useState("");
  const [testDate, setTestDate] = useState(""); // 초기 값은 빈 문자열로 설정
  const [testScore, setTestScore] = useState("");
  const [testGrade, setTestGrade] = useState("");
  const [wrongs, setWrongs] = useState([{ catCode: "", wrongCnt: "" }]);
  const [errorMessage, setErrorMessage] = useState(""); // 오류 메시지 상태

  const grades = Array.from({ length: 9 }, (_, i) => `${i + 1}등급`);

  // 과목 데이터 가져오기
  useEffect(() => {
    fetchSubjects(); // 컴포넌트가 마운트될 때 과목 데이터 가져오기

    // 오늘 날짜를 YYYY-MM-DD 형식으로 포맷팅
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];

    // testDate를 오늘 날짜로 설정
    setTestDate(formattedDate);
    updateScore("testDate", formattedDate); // 상태 업데이트
  }, [fetchSubjects, updateScore]);

  // 선택된 과목이 바뀔 때마다 세부 과목 정보 가져오기
  useEffect(() => {
    if (subjectCode) {
      fetchProblemTypes(subjectCode);
    }
  }, [subjectCode, fetchProblemTypes]);

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
      newWrongs[index][field] = parseInt(value, 10); // catCode로 변환
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

    // 오답 데이터 검증
    for (const wrong of wrongs) {
      if (wrong.catCode !== "" && wrong.wrongCnt <= 0) {
        setErrorMessage("오답 개수는 0 이상이어야 합니다.");
        return false;
      }
      if (wrong.catCode === "" && wrong.wrongCnt >= 0) {
        setErrorMessage(" 오답 유형을 선택해야 합니다.");
        return false;
      }
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
    onSubmit(subjectCode); // 성적 등록 후 상위 컴포넌트에 등록된 과목 코드 전달
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
            {subjects.map((subject) => (
              <option key={subject.subCode} value={subject.subCode}>
                {subject.subName}
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
              value={wrong.catCode}
              onChange={(e) =>
                handleWrongChange(index, "catCode", e.target.value)
              }
              disabled={!subjectCode} // 과목이 선택되지 않으면 비활성화
              required
            >
              <option value="" disabled hidden>
                오답 유형 선택
              </option>
              {problemTypes.map((problemType) => (
                <option key={problemType.catCode} value={problemType.catCode}>
                  {problemType.catName}
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
        <button className="ScoreRegist-cancel-btn" onClick={onCancel}>
          취소
        </button>
      </div>
    </div>
  );
};

export default ScoreRegist;
