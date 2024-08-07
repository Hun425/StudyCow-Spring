import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/CreateModify.css";
import useInfoStore from "../../../stores/infos";
import usePlanStore from "../../../stores/plan";

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

const sub_subjects_dic = {
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

const PlanCreate = ({ show, onClose }) => {
  const navigate = useNavigate();
  const { token } = useInfoStore((state) => ({
    token: state.token,
  }));

  const { createPlannerUrl, date, saveDate, setPlans, getDatePlanRequest } =
    usePlanStore((state) => ({
      createPlannerUrl: state.createPlannerUrl,
      date: state.date,
      saveDate: state.saveDate,
      setPlans: state.setPlans,
      getDatePlanRequest: state.getDatePlanRequest,
    }));

  const initialState = {
    selectedSubject: "",
    selectedSubSubject: "",
    selectedTime: 1,
    selectedMinutes: 0,
    content: "",
    selectedDate: date,
  };

  const [formState, setFormState] = useState(initialState);

  useEffect(() => {
    if (show) {
      setFormState({
        selectedSubject: "",
        selectedSubSubject: "",
        selectedTime: 1,
        selectedMinutes: 0,
        content: "",
        selectedDate: date,
      });
    }
  }, [show, date]);

  const handleSubjectChange = (subject) => {
    setFormState((prevState) => ({
      ...prevState,
      selectedSubject: subject,
      selectedSubSubject: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subCode = parseInt(
      Object.keys(sub_code_dic).find(
        (key) => sub_code_dic[key] === formState.selectedSubject
      ),
      10
    );

    const totalMinutes =
      formState.selectedTime * 60 + parseInt(formState.selectedMinutes, 10);

    const data = {
      subCode,
      planDate: formState.selectedDate,
      planContent: formState.content,
      planStudyTime: totalMinutes,
      planStatus: 0,
    };

    try {
      const response = await fetch(createPlannerUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const responseBody = await response.text();

        if (responseBody.includes("등록 성공")) {
          alert("플래너가 성공적으로 생성되었습니다.");

          // 플래너 생성 후 데이터 갱신
          const success = await getDatePlanRequest(formState.selectedDate);
          if (success) {
            // 상태 갱신: 현재 날짜에 맞게 plans를 다시 가져옴
            setPlans((prevPlans) => [...prevPlans, data]);
            // CatPlanList의 plans도 갱신할 필요가 있음
          }

          onClose();
          window.location.reload(); // 이 부분은 제거
          // navigate("/plan", { replace: true }); // 페이지 이동
        }
      } else {
        alert("플래너 생성에 실패했습니다.");
      }
    } catch (error) {
      alert("플래너 생성 중 오류가 발생했습니다.");
      console.error("플래너 생성 중 오류:", error);
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormState((prevState) => ({ ...prevState, selectedDate: newDate }));
    saveDate(newDate);
  };

  if (!show) return null;

  return (
    <div className="CreateModify-modal-overlay">
      <div className="CreateModify-modal-content">
        <h2>플래너 생성</h2>
        <form className="CreateModify-modal-form" onSubmit={handleSubmit}>
          <div className="CreateModify-form-group">
            <label htmlFor="subject">과목</label>
            <select
              id="subject"
              name="subject"
              onChange={(e) => handleSubjectChange(e.target.value)}
              value={formState.selectedSubject}
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
          <div className="CreateModify-form-group">
            <label htmlFor="subSubject">세부과목</label>
            <select
              id="subSubject"
              name="subSubject"
              disabled={!formState.selectedSubject}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  selectedSubSubject: e.target.value,
                }))
              }
              value={formState.selectedSubSubject}
            >
              <option value="" disabled hidden>
                세부과목 선택
              </option>
              {sub_subjects_dic[formState.selectedSubject]?.map(
                (subSubject, index) => (
                  <option key={index} value={subSubject}>
                    {subSubject}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="CreateModify-form-group">
            <label htmlFor="date">날짜</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formState.selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="CreateModify-form-group">
            <label htmlFor="estimatedHours">목표 시간</label>
            <input
              type="range"
              id="estimatedHours"
              name="estimatedHours"
              min="1"
              max="9"
              value={formState.selectedTime}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  selectedTime: e.target.value,
                }))
              }
            />
            <span className="time-display">{formState.selectedTime} 시간</span>
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
              value={formState.selectedMinutes}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  selectedMinutes: e.target.value,
                }))
              }
            />
            <span className="time-display">{formState.selectedMinutes} 분</span>
          </div>

          <div className="CreateModify-form-group">
            <label htmlFor="content">내용</label>
            <textarea
              id="content"
              name="content"
              value={formState.content}
              onChange={(e) =>
                setFormState((prevState) => ({
                  ...prevState,
                  content: e.target.value,
                }))
              }
            ></textarea>
          </div>
          <div className="CreateModify-form-buttons">
            <button type="submit" className="CreateModify-register-button">
              등록
            </button>
            <button
              type="button"
              onClick={handleCancel}
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

export default PlanCreate;
