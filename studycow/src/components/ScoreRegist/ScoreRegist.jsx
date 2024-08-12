import React, { useState, useEffect } from "react";
import "./styles/ScoreRegist.css";
import useScoreStore from "../../stores/scoreRegist";
import useSubjectStore from "../../stores/subjectStore";
import useInfoStore from "../../stores/infos";
import useGradeStore from "../../stores/grade";

const ScoreRegist = ({ onCancel, onSubmit }) => {
  const { updateScore, submitScore } = useScoreStore();
  const { subjects, fetchSubjects, problemTypes, fetchProblemTypes } =
    useSubjectStore();
  const { fetchSelectedSubjectGrade, subjectGrades } = useGradeStore();
  const { userInfo } = useInfoStore();

  const [subjectCode, setSubjectCode] = useState("");
  const [testDate, setTestDate] = useState("");
  const [testScore, setTestScore] = useState("");
  const [testGrade, setTestGrade] = useState("");
  const [wrongs, setWrongs] = useState([{ catCode: "", wrongCnt: "" }]);
  const [errorMessage, setErrorMessage] = useState("");

  const grades = Array.from({ length: 9 }, (_, i) => `${i + 1}등급`);

  useEffect(() => {
    fetchSubjects();

    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0];
    setTestDate(formattedDate);
    updateScore("testDate", formattedDate);
  }, [fetchSubjects, updateScore]);

  useEffect(() => {
    if (subjectCode) {
      fetchProblemTypes(subjectCode);
      fetchSelectedSubjectGrade(userInfo.userId, subjectCode);
    }
  }, [
    subjectCode,
    fetchProblemTypes,
    fetchSelectedSubjectGrade,
    userInfo.userId,
  ]);

  const handleSubjectChange = (e) => {
    const code = e.target.value;
    setSubjectCode(code);
    updateScore("subCode", parseInt(code, 10));
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setTestDate(date);
    updateScore("testDate", date);
  };

  const handleScoreChange = (e) => {
    const value = parseInt(e.target.value, 10);
    const validValue = Math.max(0, Math.min(100, isNaN(value) ? 0 : value));
    setTestScore(validValue);
    updateScore("testScore", validValue);
  };

  const handleGradeChange = (e) => {
    const grade = e.target.value;
    setTestGrade(grade);
    updateScore("testGrade", parseInt(grade, 10));
  };

  const handleWrongChange = (index, field, value) => {
    const newWrongs = [...wrongs];
    if (field === "wrongCnt") {
      const parsedValue = parseInt(value, 10);
      const validValue = Math.min(
        20,
        Math.max(0, isNaN(parsedValue) ? 0 : parsedValue)
      ); // 오답 개수를 20으로 제한
      newWrongs[index][field] = validValue;
    } else if (field === "catCode") {
      newWrongs[index][field] = parseInt(value, 10);
      newWrongs[index]["wrongCnt"] = "";
    }
    setWrongs(newWrongs);
    updateScore("scoreDetails", newWrongs);
  };

  const addWrongForm = () => {
    const newWrongs = [...wrongs, { catCode: "", wrongCnt: "" }];
    setWrongs(newWrongs);
    updateScore("scoreDetails", newWrongs);
  };

  const removeWrongForm = (index) => {
    const newWrongs = wrongs.filter((_, i) => i !== index);
    setWrongs(newWrongs);
    updateScore("scoreDetails", newWrongs);
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

    for (const wrong of wrongs) {
      if (wrong.catCode === "" && wrong.wrongCnt === "") {
        continue;
      }
      if (
        wrong.catCode !== "" &&
        (wrong.wrongCnt === "" || wrong.wrongCnt <= 0)
      ) {
        setErrorMessage("오답 개수는 0 이상이어야 합니다.");
        return false;
      }
      if (wrong.catCode === "" && wrong.wrongCnt > 0) {
        setErrorMessage("오답 유형을 선택해야 합니다.");
        return false;
      }
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // 중복 성적 검증
    const existingScores = Object.values(subjectGrades);
    for (const score of existingScores) {
      if (score.testDate === testDate) {
        setErrorMessage("이미 동일한 날짜에 등록된 성적이 있습니다.");
        return;
      }
    }

    // 오답 유형 중복 검증 및 합치기
    const mergedWrongs = [];
    const wrongsMap = {};

    wrongs.forEach((wrong) => {
      if (wrong.catCode && wrong.wrongCnt) {
        if (wrongsMap[wrong.catCode]) {
          wrongsMap[wrong.catCode].wrongCnt += wrong.wrongCnt; // 오답 개수 합산
        } else {
          wrongsMap[wrong.catCode] = { ...wrong };
        }
      }
    });

    for (const key in wrongsMap) {
      mergedWrongs.push(wrongsMap[key]);
    }

    updateScore("scoreDetails", mergedWrongs);

    submitScore();
    onSubmit(subjectCode);
  };

  return (
    <div className="ScoreRegist-container">
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
              disabled={!subjectCode}
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
              disabled={!wrong.catCode}
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
