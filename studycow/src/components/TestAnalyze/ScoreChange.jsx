import React, { useState, useEffect } from "react";
import "./styles/ScoreChange.css";
import useScoreChangeStore from "../../stores/scoreChange";
import useSubjectStore from "../../stores/subjectStore"; // subject store import

const ScoreChange = ({ initialData, onClose, onScoreChange }) => {
  const { updatePlanner, deletePlanner } = useScoreChangeStore();
  const { subjects, fetchSubjects, problemTypes, fetchProblemTypes } =
    useSubjectStore();

  const [scoreData, setScoreData] = useState({
    subCode: "",
    testDate: "",
    testScore: "",
    testGrade: "",
    scoreDetails: [],
  });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchSubjects(); // 컴포넌트가 마운트될 때 과목 데이터 가져오기

    if (initialData) {
      console.log("initialData:", initialData); // 초기 데이터 확인
      setScoreData({
        subCode: initialData.subCode || "",
        testDate: initialData.testDate || "",
        testScore: initialData.testScore || "",
        testGrade: initialData.testGrade || "",
        scoreDetails: initialData.scoreDetails || [],
      });

      if (initialData.subCode) {
        fetchProblemTypes(initialData.subCode); // 선택된 과목에 대한 세부 과목 유형 가져오기
      }
    }
  }, [fetchSubjects, fetchProblemTypes, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setScoreData({ ...scoreData, [name]: value });

    if (name === "subCode") {
      fetchProblemTypes(value); // 과목 선택 변경 시 세부 과목 유형 가져오기
    }
  };

  const handleScoreDetailChange = (index, field, value) => {
    const newDetails = [...scoreData.scoreDetails];
    if (field === "wrongCnt") {
      const parsedValue = parseInt(value, 10);
      const validValue = Math.max(
        0,
        Math.min(20, isNaN(parsedValue) ? 0 : parsedValue)
      ); // 0에서 20 사이로 제한
      newDetails[index][field] = validValue;
    } else if (field === "catCode") {
      newDetails[index][field] = parseInt(value, 10);
      newDetails[index]["wrongCnt"] = ""; // 유형이 바뀌면 오답 개수 초기화
    }
    setScoreData({ ...scoreData, scoreDetails: newDetails });
  };

  const handleRemoveWrong = (index) => {
    const newDetails = scoreData.scoreDetails.filter((_, i) => i !== index);
    setScoreData({ ...scoreData, scoreDetails: newDetails });
  };

  const addWrongForm = () => {
    const newDetails = [
      ...scoreData.scoreDetails,
      { catCode: "", wrongCnt: "" },
    ]; // 초기값을 빈 문자열로 설정
    setScoreData({ ...scoreData, scoreDetails: newDetails });
  };

  const validateForm = () => {
    if (!scoreData.subCode) {
      setErrorMessage("과목을 선택하세요.");
      return false;
    }
    if (!scoreData.testDate) {
      setErrorMessage("시험 날짜를 선택하세요.");
      return false;
    }
    if (scoreData.testScore === "") {
      setErrorMessage("점수를 입력하세요.");
      return false;
    }
    if (!scoreData.testGrade) {
      setErrorMessage("등급을 선택하세요.");
      return false;
    }

    // 오답 데이터 검증 추가
    for (const wrong of scoreData.scoreDetails) {
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

    setErrorMessage("");
    return true;
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    // 중복된 오답 유형 합치기
    const mergedDetails = [];
    const detailsMap = {};

    scoreData.scoreDetails.forEach((detail) => {
      if (detail.catCode && detail.wrongCnt) {
        if (detailsMap[detail.catCode]) {
          detailsMap[detail.catCode].wrongCnt += detail.wrongCnt; // 오답 개수 합산
        } else {
          detailsMap[detail.catCode] = { ...detail };
        }
      }
    });

    for (const key in detailsMap) {
      mergedDetails.push(detailsMap[key]);
    }

    setScoreData({ ...scoreData, scoreDetails: mergedDetails });

    updatePlanner(initialData.scoreId, {
      ...scoreData,
      scoreDetails: mergedDetails,
    }).then(() => {
      onClose(); // 모달 닫기
      if (onScoreChange) {
        onScoreChange(); // 부모 컴포넌트에 신호 보내기
      }
    });
  };

  const handleDelete = () => {
    deletePlanner(initialData.scoreId).then(() => {
      onClose(); // 모달 닫기
      if (onScoreChange) {
        onScoreChange(); // 부모 컴포넌트에 신호 보내기
      }
    });
  };

  return (
    <div className="ScoreChange-container">
      <div className="ScoreChange-register">
        <h3>성적 수정/삭제</h3>
        {errorMessage && <p className="ScoreChange-error">{errorMessage}</p>}
        <div className="ScoreChange-form">
          <select
            className="ScoreChange-select"
            name="subCode"
            value={scoreData.subCode}
            onChange={handleInputChange}
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
            className="ScoreChange-input-date"
            name="testDate"
            value={scoreData.testDate}
            onChange={handleInputChange}
            placeholder="응시일 선택"
            required
          />
        </div>
        <div className="ScoreChange-form">
          <input
            type="number"
            className="ScoreChange-input-number"
            name="testScore"
            min="0"
            max="100"
            value={scoreData.testScore}
            onChange={handleInputChange}
            placeholder="점수 입력"
            required
          />
          <input
            type="number"
            className="ScoreChange-input-number"
            name="testGrade"
            min="1"
            max="9"
            value={scoreData.testGrade}
            onChange={handleInputChange}
            placeholder="등급 입력"
            required
          />
        </div>
      </div>

      <div className="ScoreChange-mistake-register">
        <h3>오답 수정(선택사항)</h3>
        {scoreData.scoreDetails.map((detail, index) => (
          <div key={index} className="ScoreChange-mistake-form">
            <select
              className="ScoreChange-select"
              value={detail.catCode}
              onChange={(e) =>
                handleScoreDetailChange(index, "catCode", e.target.value)
              }
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
              className="ScoreChange-input-number"
              name="wrongCnt"
              min="0"
              max="20" // 20개로 제한
              value={detail.wrongCnt}
              onChange={(e) =>
                handleScoreDetailChange(index, "wrongCnt", e.target.value)
              }
              placeholder="오답 개수"
              disabled={!detail.catCode} // 오답 유형이 선택되지 않으면 비활성화
              required
            />
            <button
              className="ScoreChange-remove-btn"
              onClick={() => handleRemoveWrong(index)}
            >
              삭제
            </button>
          </div>
        ))}
        <button className="ScoreChange-add-btn" onClick={addWrongForm}>
          +
        </button>
      </div>

      <div className="ScoreChange-button-group">
        <button className="ScoreChange-update-btn" onClick={handleUpdate}>
          수정하기
        </button>
        <button className="ScoreChange-delete-btn" onClick={handleDelete}>
          삭제하기
        </button>
        <button className="ScoreChange-cancel-btn" onClick={onClose}>
          취소
        </button>
      </div>
    </div>
  );
};

export default ScoreChange;
