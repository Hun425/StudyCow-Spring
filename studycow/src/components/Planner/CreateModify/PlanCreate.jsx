import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/CreateModify.css";
import useInfoStore from "../../../stores/infos";
import usePlanStore from "../../../stores/plan";
import useSubjectStore from "../../../stores/subjectStore"; // subject store import
import Notiflix from "notiflix";

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

  const { subjects, fetchSubjects, problemTypes, fetchProblemTypes } =
    useSubjectStore(); // 스토어 상태 및 함수

  const initialState = {
    selectedSubject: "",
    selectedSubSubject: "",
    selectedTime: 0,
    selectedMinutes: 0,
    content: "",
    selectedDate: date,
  };

  const [formState, setFormState] = useState(initialState);

  // 과목 데이터 가져오기
  useEffect(() => {
    fetchSubjects(); // 컴포넌트가 마운트될 때 과목 데이터 가져오기
  }, [fetchSubjects]);

  // 선택된 과목이 바뀔 때마다 세부 과목 정보 가져오기
  useEffect(() => {
    if (formState.selectedSubject) {
      fetchProblemTypes(formState.selectedSubject);
    }
  }, [formState.selectedSubject, fetchProblemTypes]);

  // 모달이 열릴 때 초기 상태 설정
  useEffect(() => {
    if (show) {
      setFormState((prevState) => ({
        ...prevState,
        selectedDate: date,
      }));
    }
  }, [show, date]);

  // 과목 선택 핸들러
  const handleSubjectChange = (subCode) => {
    setFormState((prevState) => ({
      ...prevState,
      selectedSubject: subCode,
      selectedSubSubject: "",
    }));
  };

  // 내용 입력 시 100자 제한 추가
  const handleContentChange = (e) => {
    const value = e.target.value;
    if (value.length > 100) {
      Notiflix.Notify.warning("내용은 100자 이내로 입력해 주세요.");
      return;
    }
    setFormState((prevState) => ({
      ...prevState,
      content: value,
    }));
  };

  // 플래너 제출 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 과목이 선택되지 않았을 경우
    if (!formState.selectedSubject) {
      Notiflix.Notify.warning("과목을 선택해 주세요.");
      return;
    }

    // 시간과 분이 모두 0일 경우
    if (formState.selectedTime === 0 && formState.selectedMinutes === 0) {
      Notiflix.Notify.warning("시간과 분을 설정해 주세요.");
      return;
    }

    const subCode = parseInt(formState.selectedSubject, 10);
    const catCode = parseInt(formState.selectedSubSubject, 10); // 세부 과목 코드
    const totalMinutes =
      formState.selectedTime * 60 + parseInt(formState.selectedMinutes, 10);

    const data = {
      subCode,
      catCode,
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
          // 플래너 생성 후 데이터 갱신
          const success = await getDatePlanRequest(formState.selectedDate);
          if (success) {
            // 상태 갱신: 현재 날짜에 맞게 plans를 다시 가져옴
            setPlans((prevPlans) => [...prevPlans, data]);
          }

          onClose();
          window.location.reload(); // 페이지 새로고침
          // navigate("/plan", { replace: true }); // 페이지 이동
        }
      } else {
        Notiflix.Notify.failure("플래너 생성에 실패했습니다.");
      }
    } catch (error) {
      Notiflix.Notify.failure("플래너 생성에 실패했습니다.");
    }
  };

  // 날짜 변경 핸들러
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormState((prevState) => ({ ...prevState, selectedDate: newDate }));
    saveDate(newDate);
  };

  // 취소 핸들러
  const handleCancel = () => {
    onClose(); // 모달 닫기
  };

  // 모달이 보이지 않을 경우 아무것도 렌더링하지 않음
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
              min="0"
              max="23"
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
              onChange={handleContentChange}
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
