import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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

const PlanModify = () => {
  const navigate = useNavigate();
  const { token } = useInfoStore((state) => ({
    token: state.token,
  }));

  const { modifyPlannerUrl } = usePlanStore((state) => ({
    modifyPlannerUrl: state.modifyPlannerUrl,
  }));

  const { planId } = useParams();

  const [selectedSubject, setSelectedSubject] = useState("");
  const [subSubjects, setSubSubjects] = useState([]);
  const [selectedSubSubject, setSelectedSubSubject] = useState("");
  const [selectedTime, setSelectedTime] = useState(1); // 시간
  const [selectedMinutes, setSelectedMinutes] = useState(0); // 분 추가
  const [content, setContent] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    if (selectedSubject) {
      setSubSubjects(sub_subjects_dic[selectedSubject] || []);
    } else {
      setSubSubjects([]);
    }
  }, [selectedSubject]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(`Fetching data for planId: ${planId}`);
        const response = await fetch(modifyPlannerUrl(planId), {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Response:", response);
        const text = await response.text();
        console.log("Response Text:", text);

        if (response.ok) {
          const data = JSON.parse(text);
          console.log("Fetched data:", data);
          setSelectedSubject(sub_code_dic[data.subCode]);
          setSelectedSubSubject(data.planContent);

          // 시간과 분을 나누어 설정
          setSelectedTime(Math.floor(data.planStudyTime / 60)); // 시간
          setSelectedMinutes(data.planStudyTime % 60); // 분

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
  }, [planId, token, modifyPlannerUrl]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const subCode = parseInt(
      Object.keys(sub_code_dic).find(
        (key) => sub_code_dic[key] === selectedSubject
      ),
      10
    );

    // 시간을 분 단위로 변환하여 저장
    const totalMinutes =
      parseInt(selectedTime, 10) * 60 + parseInt(selectedMinutes, 10);

    const data = {
      subCode,
      planDate: date,
      planContent: content,
      planStudyTime: totalMinutes, // 총 분
      planStatus: 0,
    };

    console.log("보내는 데이터:", data);
    console.log("보내는 주소:", modifyPlannerUrl(planId));
    console.log("토큰:", token);

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
        navigate("/plan");
      } else {
        alert("플래너 수정에 실패했습니다.");
      }
    } catch (error) {
      alert("플래너 수정 중 오류가 발생했습니다.");
    }
  };

  const handleCancel = () => {
    navigate("/plan");
  };

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
              step="10" // 10분 단위로
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

export default PlanModify;
