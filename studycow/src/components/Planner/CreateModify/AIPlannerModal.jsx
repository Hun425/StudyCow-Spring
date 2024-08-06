import React, { useState, useEffect } from "react";
import useOpenAiStore from "../../../stores/openAi"; // openAi 스토어 가져오기
import "./styles/AIPlannerModal.css"; // 스타일 임포트

// Utility function to format minutes into hours and minutes
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours > 0 ? `${hours}시간 ` : ""}${
    remainingMinutes > 0 ? `${remainingMinutes}분` : ""
  }`;
};

const AIPlannerModal = ({ show, onClose, analysis, plans }) => {
  const { registerPlans } = useOpenAiStore(); // AI 플래너 등록 함수 가져오기
  const [editingIndex, setEditingIndex] = useState(null);
  const [editablePlans, setEditablePlans] = useState(plans);

  // useEffect를 사용하여 plans가 변경될 때마다 editablePlans 업데이트
  useEffect(() => {
    console.log("Plans have been updated:", plans);
    setEditablePlans(plans);
  }, [plans]);

  const handleRegister = async () => {
    const success = await registerPlans(editablePlans); // 플래너 등록
    if (success) {
      alert("플래너가 성공적으로 등록되었습니다.");
      onClose(); // 모달 닫기
    } else {
      alert("플래너 등록에 실패했습니다.");
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
  };

  const handleSaveClick = () => {
    setEditingIndex(null);
  };

  const handlePlanChange = (index, field, value) => {
    const updatedPlans = [...editablePlans];
    updatedPlans[index] = { ...updatedPlans[index], [field]: value };
    setEditablePlans(updatedPlans);
  };

  if (!show) return null;

  return (
    <div className="ai-planner-modal__overlay">
      <div className="ai-planner-modal__content">
        <h2 className="ai-planner-modal__title">AI 플래너 분석 결과</h2>
        <p className="ai-planner-modal__analysis">{analysis}</p>
        <div className="ai-planner-modal__content-body">
          <table className="ai-planner-modal__table">
            <thead className="ai-planner-modal__table-head">
              <tr>
                <th>날짜</th>
                <th>과목</th>
                <th>내용</th>
                <th>시간</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody className="ai-planner-modal__table-body">
              {editablePlans.map((plan, index) => (
                <tr key={index} className="ai-planner-modal__table-row">
                  <td className="ai-planner-modal__table-cell">
                    {editingIndex === index ? (
                      <input
                        type="date"
                        value={plan.planDate}
                        onChange={(e) =>
                          handlePlanChange(index, "planDate", e.target.value)
                        }
                      />
                    ) : (
                      plan.planDate
                    )}
                  </td>
                  <td className="ai-planner-modal__table-cell">
                    {editingIndex === index ? (
                      <select
                        value={plan.subCode}
                        onChange={(e) =>
                          handlePlanChange(
                            index,
                            "subCode",
                            Number(e.target.value)
                          )
                        }
                      >
                        {Object.entries({
                          1: "국어",
                          2: "수학",
                          3: "영어",
                          4: "한국사",
                          5: "사회탐구",
                          6: "과학탐구",
                          7: "직업탐구",
                          8: "제2외국어/한문",
                        }).map(([key, value]) => (
                          <option key={key} value={key}>
                            {value}
                          </option>
                        ))}
                      </select>
                    ) : (
                      {
                        1: "국어",
                        2: "수학",
                        3: "영어",
                        4: "한국사",
                        5: "사회탐구",
                        6: "과학탐구",
                        7: "직업탐구",
                        8: "제2외국어/한문",
                      }[plan.subCode]
                    )}
                  </td>
                  <td className="ai-planner-modal__table-cell">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={plan.planContent}
                        onChange={(e) =>
                          handlePlanChange(index, "planContent", e.target.value)
                        }
                      />
                    ) : (
                      plan.planContent
                    )}
                  </td>
                  <td className="ai-planner-modal__table-cell">
                    {editingIndex === index ? (
                      <>
                        <input
                          type="number"
                          value={Math.floor(plan.planStudyTime / 60)}
                          onChange={(e) =>
                            handlePlanChange(
                              index,
                              "planStudyTime",
                              Number(e.target.value) * 60 +
                                (plan.planStudyTime % 60)
                            )
                          }
                          style={{ width: "40px", marginRight: "5px" }}
                        />
                        시간
                        <input
                          type="number"
                          value={plan.planStudyTime % 60}
                          onChange={(e) =>
                            handlePlanChange(
                              index,
                              "planStudyTime",
                              Math.floor(plan.planStudyTime / 60) * 60 +
                                Number(e.target.value)
                            )
                          }
                          style={{ width: "40px", marginLeft: "5px" }}
                        />
                        분
                      </>
                    ) : (
                      formatTime(plan.planStudyTime)
                    )}
                  </td>
                  <td className="ai-planner-modal__table-cell">
                    {editingIndex === index ? (
                      <button
                        className="ai-planner-modal__save-button"
                        onClick={handleSaveClick}
                      >
                        저장
                      </button>
                    ) : (
                      <button
                        className="ai-planner-modal__edit-button"
                        onClick={() => handleEditClick(index)}
                      >
                        수정
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="ai-planner-modal__buttons">
          <button
            onClick={handleRegister}
            className="ai-planner-modal__register-button"
          >
            등록
          </button>
          <button onClick={onClose} className="ai-planner-modal__close-button">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPlannerModal;
