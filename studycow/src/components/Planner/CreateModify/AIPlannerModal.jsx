import React, { useState, useEffect } from "react";
import useOpenAiStore from "../../../stores/openAi"; // OpenAI 스토어 가져오기
import useSubjectStore from "../../../stores/subjectStore"; // Subject 스토어 가져오기
import "./styles/AIPlannerModal.css"; // 스타일 임포트
import Notiflix from "notiflix";

// 분을 시간과 분으로 포맷하는 유틸리티 함수
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours > 0 ? `${hours}시간 ` : ""}${
    remainingMinutes > 0 ? `${remainingMinutes}분` : ""
  }`;
};

const AIPlannerModal = ({ show, onClose, analysis, plans }) => {
  const { registerPlans } = useOpenAiStore(); // AI 플래너 등록 함수 가져오기
  const { subjects, fetchSubjects, problemTypes, fetchProblemTypes } =
    useSubjectStore(); // Subject 스토어 사용

  const [editingIndex, setEditingIndex] = useState(null);
  const [editablePlans, setEditablePlans] = useState(plans);

  // 컴포넌트가 마운트될 때 과목 데이터 가져오기
  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  // plans가 변경될 때마다 editablePlans 업데이트
  useEffect(() => {
    setEditablePlans(plans);
  }, [plans]);

  const handleRegister = async () => {
    for (const plan of editablePlans) {
      if (!plan.subCode) {
        Notiflix.Notify.warning("모든 플랜에서 과목을 선택해 주세요.");
        return;
      }
      if (plan.planStudyTime === 0) {
        Notiflix.Notify.warning("모든 플랜에서 시간과 분을 설정해 주세요.");
        return;
      }
    }

    const success = await registerPlans(editablePlans); // 플래너 등록
    if (success) {
      Notiflix.Notify.success("플래너가 성공적으로 등록되었습니다.");
      onClose(); // 모달 닫기
      window.location.href = "/plan"; // PlanPage로 이동
    } else {
      Notiflix.Notify.failure("플래너 등록에 실패했습니다.");
    }
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    fetchProblemTypes(editablePlans[index].subCode); // 선택된 과목의 세부 과목 가져오기
  };

  const handleSaveClick = () => {
    setEditingIndex(null);
  };

  const handlePlanChange = (index, field, value) => {
    if (field === "planContent" && value.length > 100) {
      Notiflix.Notify.warning("내용은 100자 이내로 입력해 주세요.");
      return;
    }

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
                        onChange={(e) => {
                          handlePlanChange(
                            index,
                            "subCode",
                            Number(e.target.value)
                          );
                          fetchProblemTypes(Number(e.target.value)); // 세부 과목 업데이트
                        }}
                      >
                        <option value="" disabled hidden>
                          과목 선택
                        </option>
                        {(subjects || []).map((subject) => (
                          <option key={subject.subCode} value={subject.subCode}>
                            {subject.subName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      subjects.find((s) => s.subCode === plan.subCode)
                        ?.subName || "과목 없음"
                    )}
                  </td>
                  <td className="ai-planner-modal__table-cell">
                    {editingIndex === index ? (
                      <input
                        type="text"
                        value={plan.planContent || ""}
                        onChange={(e) =>
                          handlePlanChange(index, "planContent", e.target.value)
                        }
                      />
                    ) : (
                      plan.planContent || "내용 없음"
                    )}
                  </td>
                  <td className="ai-planner-modal__table-cell">
                    {editingIndex === index ? (
                      <>
                        <input
                          type="number"
                          min="0"
                          max="23"
                          value={Math.floor(plan.planStudyTime / 60)}
                          onChange={(e) =>
                            handlePlanChange(
                              index,
                              "planStudyTime",
                              Number(e.target.value) * 60 +
                                (plan.planStudyTime % 60)
                            )
                          }
                          style={{ width: "calc(40 / 1440 * 100vw)", marginRight: "calc(5 / 1440 * 100vw)" }}
                        />
                        시간
                        <input
                          type="number"
                          min="0"
                          max="50"
                          step="10"
                          value={plan.planStudyTime % 60}
                          onChange={(e) =>
                            handlePlanChange(
                              index,
                              "planStudyTime",
                              Math.floor(plan.planStudyTime / 60) * 60 +
                                Number(e.target.value)
                            )
                          }
                          style={{ width: "calc(40 / 1440 * 100vw)", marginLeft: "calc(5 / 1440 * 100vw)" }}
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
