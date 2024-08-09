import React, { useEffect, useState } from "react";
import "./styles/CreateModify.css";
import useInfoStore from "../../../stores/infos";
import usePlanStore from "../../../stores/plan";
import useSubjectStore from "../../../stores/subjectStore"; // subject store import

const PlanModify = ({ planId, show, onClose }) => {
  const { token } = useInfoStore((state) => ({
    token: state.token,
  }));

  const { modifyPlannerUrl } = usePlanStore((state) => ({
    modifyPlannerUrl: state.modifyPlannerUrl,
  }));

  const { subjects, fetchSubjects, problemTypes, fetchProblemTypes } =
    useSubjectStore();

  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedSubSubject, setSelectedSubSubject] = useState("");
  const [selectedTime, setSelectedTime] = useState(1);
  const [selectedMinutes, setSelectedMinutes] = useState(0);
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    fetchSubjects(); // 과목 데이터 가져오기
  }, [fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) {
      fetchProblemTypes(selectedSubject); // 세부 과목 데이터 가져오기
    }
  }, [selectedSubject, fetchProblemTypes]);

  useEffect(() => {
    if (show && planId) {
      const fetchData = async () => {
        try {
          const response = await fetch(modifyPlannerUrl(planId), {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setSelectedSubject(data.subCode);
            setSelectedSubSubject(data.catCode);
            setSelectedTime(Math.floor(data.planStudyTime / 60));
            setSelectedMinutes(data.planStudyTime % 60);
            setContent(data.planContent);
            setDate(data.planDate);
          } else {
            console.error("Failed to fetch planner data.");
          }
        } catch (error) {
          console.error("Error fetching planner data:", error);
        }
      };

      fetchData();
    }
  }, [show, planId, token, modifyPlannerUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const totalMinutes =
      parseInt(selectedTime, 10) * 60 + parseInt(selectedMinutes, 10);

    const data = {
      subCode: parseInt(selectedSubject, 10),
      catCode: parseInt(selectedSubSubject, 10),
      planDate: date,
      planContent: content,
      planStudyTime: totalMinutes,
      planStatus: 0,
    };

    try {
      const response = await fetch(modifyPlannerUrl(planId), {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert("플래너가 성공적으로 수정되었습니다.");
        onClose(); // 모달 닫기
        window.location.reload(); // 페이지 새로고침
      } else {
        alert("플래너 수정에 실패했습니다.");
      }
    } catch (error) {
      alert("플래너 수정 중 오류가 발생했습니다.");
    }
  };

  // 모달이 보이지 않을 경우 아무것도 렌더링하지 않음
  if (!show) return null;

  return (
    <div className="CreateModify-modal-overlay">
      <div className="CreateModify-modal-content">
        <h2>플래너 수정</h2>
        <form className="CreateModify-modal-form" onSubmit={handleSubmit}>
          <div className="CreateModify-form-group">
            <label htmlFor="subject">과목</label>
            <select
              id="subject"
              name="subject"
              onChange={(e) => setSelectedSubject(e.target.value)}
              value={selectedSubject}
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
          </div>

          <div className="CreateModify-form-group">
            <label htmlFor="date">날짜</label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div className="CreateModify-form-group">
            <label htmlFor="estimatedTime">목표 시간</label>
            <input
              type="range"
              id="estimatedTime"
              name="estimatedTime"
              min="1"
              max="9"
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
            />
            <span className="time-display">{selectedTime} 시간</span>
          </div>
          <div className="CreateModify-form-group">
            <label htmlFor="estimatedMinutes">목표 분</label>
            <input
              type="range"
              id="estimatedMinutes"
              name="estimatedMinutes"
              min="0"
              max="50"
              step="10"
              value={selectedMinutes}
              onChange={(e) => setSelectedMinutes(e.target.value)}
            />
            <span className="time-display">{selectedMinutes} 분</span>
          </div>
          <div className="CreateModify-form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>
          </div>
          <div className="CreateModify-form-buttons">
            <button type="submit" className="CreateModify-register-button">
              수정
            </button>
            <button
              type="button"
              onClick={onClose}
              className="CreateModify-cancel-button"
            >
              취소
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanModify;
