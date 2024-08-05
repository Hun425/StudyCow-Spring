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

  const { createPlannerUrl, date, saveDate } = usePlanStore((state) => ({
    createPlannerUrl: state.createPlannerUrl,
    date: state.date,
    saveDate: state.saveDate,
  }));

  // 기본 상태값 정의
  const initialState = {
    selectedSubject: "",
    selectedSubSubject: "",
    selectedTime: 1,
    selectedMinutes: 0,
    content: "",
    selectedDate: date,
  };

  const [formState, setFormState] = useState(initialState);

  // 모달이 열릴 때마다 초기 상태 설정
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

  // 선택된 과목이 변경될 때 세부 과목 업데이트
  const handleSubjectChange = (subject) => {
    setFormState((prevState) => ({
      ...prevState,
      selectedSubject: subject,
      selectedSubSubject: "", // 과목 변경 시 세부 과목 초기화
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
      planStatus: 0, // 기본값으로 설정
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
        alert("플래너가 성공적으로 생성되었습니다.");
        onClose(); // 모달 닫기
        navigate("/plan", { replace: true }); // PlanPage로 이동
        window.location.reload(); // 새로고침하여 데이터 보이도록 처리
      } else {
        alert("플래너 생성에 실패했습니다.");
      }
    } catch (error) {
      alert("플래너 생성 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    onClose(); // 모달 닫기
  };

  const handleAutoComplete = () => {
    // 과목 코드는 1에서 8까지 랜덤으로 선택
    const tempSubCode = Math.floor(Math.random() * 8) + 1;
    const selectedSubject = sub_code_dic[tempSubCode];

    // 선택된 과목 코드에 해당하는 세부 과목 리스트를 가져옴
    const subSubjectArray = sub_subjects_dic[selectedSubject];
    const randomSubSubjectIndex = Math.floor(
      Math.random() * subSubjectArray.length
    );
    const tempSubSubject = subSubjectArray[randomSubSubjectIndex];

    // 공부 시간은 1에서 9시간 사이에서 랜덤으로 선택
    const tempTime = Math.floor(Math.random() * 9) + 1;
    const tempMinutes = Math.floor(Math.random() * 6) * 10; // 0부터 50까지 10단위로 랜덤

    setFormState((prevState) => ({
      ...prevState,
      selectedSubject,
      selectedSubSubject: tempSubSubject,
      selectedTime: tempTime,
      selectedMinutes: tempMinutes,
      content: `${tempSubSubject} ${tempTime}시간 ${tempMinutes}분 공부`,
    }));
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setFormState((prevState) => ({ ...prevState, selectedDate: newDate }));
    saveDate(newDate); // 스토어에 새로운 날짜 저장
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
              onClick={handleAutoComplete}
              className="CreateModify-autocomplete-button"
            >
              자동완성
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
