import React, { useState } from "react";
import useOpenAiStore from "../../../stores/openAi"; // openAi 스토어 가져오기
import usePlanStore from "../../../stores/plan"; // PlanStore 가져오기
import "./styles/AIPlannerModal.css"; // 스타일 임포트

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

// Utility function to format time into hours and minutes
const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours > 0 ? `${hours}시간 ` : ""}${
    remainingMinutes > 0 ? `${remainingMinutes}분` : ""
  }`;
};

const AIPlannerModal = ({ show, onClose, analysis, plans }) => {
  const { registerPlans } = useOpenAiStore(); // AI 플래너 등록 함수 가져오기
  const { getDatePlanRequest } = usePlanStore(); // 데이터 갱신 함수 가져오기
  const [editPlan, setEditPlan] = useState(null);
  const [updatedPlans, setUpdatedPlans] = useState(plans);

  // Handle register button click
  const handleRegister = async () => {
    const success = await registerPlans(updatedPlans); // 플래너 등록
    if (success) {
      alert("플래너가 성공적으로 등록되었습니다.");
      await getDatePlanRequest(updatedPlans[0].planDate); // 첫 번째 플랜 날짜 기준으로 데이터 갱신
      onClose(); // 모달 닫기
    } else {
      alert("플래너 등록에 실패했습니다.");
    }
  };

  // Handle edit button click
  const handleEditClick = (index) => {
    setEditPlan(index);
  };

  // Handle save button click
  const handleSaveEdit = () => {
    setEditPlan(null); // 수정 모달 닫기
  };

  // Handle input change
  const handleChange = (e, index, field) => {
    const value = e.target.value;
    const updatedPlanList = updatedPlans.map((plan, idx) =>
      idx === index ? { ...plan, [field]: value } : plan
    );
    setUpdatedPlans(updatedPlanList);
  };

  // Handle time change for hours and minutes
  const handleTimeChange = (e, index, type) => {
    const value = e.target.value;
    const updatedPlanList = updatedPlans.map((plan, idx) => {
      if (idx === index) {
        const currentMinutes = plan.planStudyTime;
        const hours = Math.floor(currentMinutes / 60);
        const minutes = currentMinutes % 60;
        const newTime =
          type === "hours"
            ? value * 60 + minutes
            : hours * 60 + parseInt(value);
        return { ...plan, planStudyTime: newTime };
      }
      return plan;
    });
    setUpdatedPlans(updatedPlanList);
  };

  if (!show) return null;

  return (
    <div className="ai-planner-modal-overlay">
      <div className="ai-planner-modal-content">
        <h2>AI 플래너 분석 결과</h2>
        <p>{analysis}</p> {/* AI 분석 결과 표시 */}
        <div className="ai-planner-modal-content-body">
          <table className="ai-planner-modal-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>과목</th>
                <th>내용</th>
                <th>시간</th>
                <th>수정</th>
              </tr>
            </thead>
            <tbody>
              {updatedPlans.map((plan, index) => {
                const hours = Math.floor(plan.planStudyTime / 60);
                const minutes = plan.planStudyTime % 60;
                return (
                  <tr key={index}>
                    <td className="plan-date">
                      {editPlan === index ? (
                        <input
                          type="date"
                          value={plan.planDate}
                          onChange={(e) => handleChange(e, index, "planDate")}
                        />
                      ) : (
                        plan.planDate
                      )}
                    </td>
                    <td className="plan-subject">
                      {editPlan === index ? (
                        <select
                          value={plan.subCode}
                          onChange={(e) => handleChange(e, index, "subCode")}
                        >
                          {Object.entries(sub_code_dic).map(([key, value]) => (
                            <option key={key} value={key}>
                              {value}
                            </option>
                          ))}
                        </select>
                      ) : (
                        sub_code_dic[plan.subCode]
                      )}
                    </td>
                    <td className="plan-content">
                      {editPlan === index ? (
                        <input
                          type="text"
                          value={plan.planContent}
                          onChange={(e) =>
                            handleChange(e, index, "planContent")
                          }
                        />
                      ) : (
                        plan.planContent
                      )}
                    </td>
                    <td className="plan-time">
                      {editPlan === index ? (
                        <>
                          <input
                            type="number"
                            min="0"
                            max="24"
                            value={hours}
                            onChange={(e) =>
                              handleTimeChange(e, index, "hours")
                            }
                          />
                          시간
                          <input
                            type="number"
                            min="0"
                            max="59"
                            value={minutes}
                            onChange={(e) =>
                              handleTimeChange(e, index, "minutes")
                            }
                          />
                          분
                        </>
                      ) : (
                        formatTime(plan.planStudyTime)
                      )}
                    </td>
                    <td>
                      {editPlan === index ? (
                        <button
                          onClick={handleSaveEdit}
                          className="save-button"
                        >
                          저장
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditClick(index)}
                          className="edit-button"
                        >
                          수정
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="ai-planner-modal-buttons">
          <button
            onClick={handleRegister}
            className="ai-planner-modal-register-button"
          >
            등록
          </button>
          <button onClick={onClose} className="ai-planner-modal-close-button">
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIPlannerModal;
