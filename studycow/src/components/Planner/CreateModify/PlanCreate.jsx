import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/CreateModify.css";
import useInfoStore from "../../../stores/infos";
import usePlanStore from "../../../stores/plan"; // 새로운 스토어 import

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

const Modal = ({ closeModal }) => {
  const navigate = useNavigate();
  const { token } = useInfoStore((state) => ({
    token: state.token,
  }));

  const { createPlannerUrl, date, saveDate } = usePlanStore((state) => ({
    createPlannerUrl: state.createPlannerUrl,
    date: state.date,
    saveDate: state.saveDate,
  }));

  const [selectedSubject, setSelectedSubject] = useState("");
  const [subSubjects, setSubSubjects] = useState([]);
  const [selectedSubSubject, setSelectedSubSubject] = useState("");
  const [selectedTime, setSelectedTime] = useState(1);
  const [content, setContent] = useState("");
  const [selectedDate, setSelectedDate] = useState(date); // 기본 날짜를 상태에서 가져옴

  useEffect(() => {
    if (selectedSubject) {
      setSubSubjects(sub_subjects_dic[selectedSubject] || []);
    } else {
      setSubSubjects([]);
    }
  }, [selectedSubject]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subCode = parseInt(
      Object.keys(sub_code_dic).find(
        (key) => sub_code_dic[key] === selectedSubject
      ),
      10
    );

    const data = {
      subCode,
      planDate: selectedDate,
      planContent: content,
      planStudyTime: parseInt(selectedTime, 10),
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
        navigate("/plan");
      } else {
        alert("플래너 생성에 실패했습니다.");
      }
    } catch (error) {
      alert("플래너 생성 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/plan");
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

    setSelectedSubject(selectedSubject);
    setSelectedSubSubject(tempSubSubject);
    setSelectedTime(tempTime);
    setContent(tempSubSubject + " " + tempTime + "시간 공부");
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setSelectedDate(newDate);
    saveDate(newDate); // 스토어에 새로운 날짜 저장
  };

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
              onChange={(e) => setSelectedSubject(e.target.value)}
              value={selectedSubject}
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
              disabled={!selectedSubject}
              onChange={(e) => setSelectedSubSubject(e.target.value)}
              value={selectedSubSubject}
            >
              <option value="" disabled hidden>
                세부과목 선택
              </option>
              {subSubjects.map((subSubject, index) => (
                <option key={index} value={subSubject}>
                  {subSubject}
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
              value={selectedDate}
              onChange={handleDateChange}
            />
          </div>
          <div className="CreateModify-form-group">
            <label htmlFor="estimatedTime">목표시간</label>
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

export default Modal;
