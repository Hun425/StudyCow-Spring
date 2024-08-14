import React, { useState, useEffect } from "react";
import "./styles/ScoreChange.css";
import useScoreChangeStore from "../../stores/scoreChange";
import useSubjectStore from "../../stores/subjectStore"; // subject store import
import Notiflix from "notiflix";

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

  useEffect(() => {
    fetchSubjects(); // 컴포넌트가 마운트될 때 과목 데이터 가져오기

    if (initialData) {
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

  const handleScoreBlur = () => {
    const sanitizedValue = scoreData.testScore
      ? String(Number(scoreData.testScore))
      : "";
    const validValue = Math.max(0, Math.min(100, sanitizedValue));
    setScoreData({ ...scoreData, testScore: validValue });
  };

  const handleGradeBlur = () => {
    const sanitizedValue = scoreData.testGrade
      ? String(Number(scoreData.testGrade))
      : "";
    const validValue = Math.max(1, Math.min(9, sanitizedValue));
    setScoreData({ ...scoreData, testGrade: validValue });
  };

  const handleScoreDetailChange = (index, field, value) => {
    const newDetails = [...scoreData.scoreDetails];
    if (field === "wrongCnt") {
      newDetails[index][field] = value;
    } else if (field === "catCode") {
      newDetails[index][field] = parseInt(value, 10);
      newDetails[index]["wrongCnt"] = ""; // 유형이 바뀌면 오답 개수 초기화
    }
    setScoreData({ ...scoreData, scoreDetails: newDetails });
  };

  const handleScoreDetailBlur = (index) => {
    const newDetails = [...scoreData.scoreDetails];
    const sanitizedValue = newDetails[index].wrongCnt
      ? String(Number(newDetails[index].wrongCnt))
      : "";
    const validValue = Math.min(20, Math.max(0, sanitizedValue)); // 오답 개수를 20으로 제한
    newDetails[index].wrongCnt = validValue;
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
      Notiflix.Notify.warning("과목을 선택하세요.");
      return false;
    }
    if (!scoreData.testDate) {
      Notiflix.Notify.warning("시험 날짜를 선택하세요.");
      return false;
    }
    if (scoreData.testScore === "") {
      Notiflix.Notify.warning("점수를 입력하세요.");
      return false;
    }
    if (!scoreData.testGrade) {
      Notiflix.Notify.warning("등급을 선택하세요.");
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
        Notiflix.Notify.warning("오답 개수는 0 이상이어야 합니다.");
        return false;
      }
      if (wrong.catCode === "" && wrong.wrongCnt > 0) {
        Notiflix.Notify.warning("오답 유형을 선택해야 합니다.");
        return false;
      }
    }

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
            onBlur={handleScoreBlur}
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
            onBlur={handleGradeBlur}
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
              onBlur={() => handleScoreDetailBlur(index)}
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
