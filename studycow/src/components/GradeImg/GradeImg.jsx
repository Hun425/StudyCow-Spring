import React, { useState } from "react";
import useInfoStore from "../../stores/infos";
import "./Styles/GradeImg.css";

// Import images
import bronze from "./img/Lev. 1/브론즈.jpg";
import silver from "./img/Lev. 2/실버.jpg";
import gold from "./img/Lev. 3/골드.jpg";
import platinum from "./img/Lev. 4/플래티넘.jpg";
import diamond from "./img/Lev. 5/다이아.png";

const UserGradeImage = () => {
  // 스토어에서 유저 정보 가져오기
  const { userInfo } = useInfoStore();
  const { userGrade, userExp } = userInfo;

  // 마우스 위치 상태 관리
  const [rotateX, setRotateX] = useState(0);  // X축 회전 각도를 저장
  const [rotateY, setRotateY] = useState(0);  // Y축 회전 각도를 저장
  const [overlayStyle, setOverlayStyle] = useState({});  // 오버레이의 스타일을 저장

  // 마우스 이동 핸들러
  const handleMouseMove = (e) => {
    // 카드 컨테이너의 위치 및 크기 정보 가져오기
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left;  // 마우스의 X좌표를 컨테이너 기준으로 계산
    const y = e.clientY - container.top;   // 마우스의 Y좌표를 컨테이너 기준으로 계산
    
    // 마우스 위치에 따라 회전 각도 계산
    const newRotateY = -1 / 5 * x + 20;  // Y축 회전 각도 계산
    const newRotateX = 4 / 30 * y - 20;  // X축 회전 각도 계산
  
    // 계산된 회전 각도 상태 업데이트
    setRotateX(newRotateX);
    setRotateY(newRotateY);
  
    // 오버레이의 배경 위치와 투명도/밝기 필터를 업데이트
    setOverlayStyle({
      backgroundPosition: `${x / 5 + y / 5}%`,  // 마우스 위치에 따라 배경 이동
      filter: `opacity(${x / 200}) brightness(1.2)`,  // 투명도 및 밝기 조정
    });
  };

  // 마우스 아웃 핸들러
  const handleMouseOut = () => {
    // 마우스가 카드 밖으로 나가면 회전 각도와 오버레이 효과를 초기화
    setRotateX(0);
    setRotateY(0);
    setOverlayStyle({
      filter: "opacity(0)",  // 오버레이를 투명하게 설정
    });
  };

  // 등급에 따른 이미지 경로 선택
  let gradeImage;
  switch (userGrade.gradeName) {
    case "브론즈":
      gradeImage = bronze;
      break;
    case "실버":
      gradeImage = silver;
      break;
    case "골드":
      gradeImage = gold;
      break;
    case "플래티넘":
      gradeImage = platinum;
      break;
    case "다이아":
      gradeImage = diamond;
      break;
    default:
      gradeImage = bronze; // 기본값으로 브론즈의 이미지를 사용
  }

  // 경험치에 따른 진행 바 너비 계산
  const progressPercentage = Math.min((userExp / userGrade.maxExp) * 100, 100); // 진행 바 너비를 백분율로 계산, 100% 초과 방지

  return (
    <div
      className={`user-grade-image-container ${userGrade.gradeName}`}
      onMouseMove={handleMouseMove}  // 마우스가 카드 위에서 움직일 때 호출되는 핸들러
      onMouseOut={handleMouseOut}    // 마우스가 카드 밖으로 나갈 때 호출되는 핸들러
      style={{
        transform: `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,  // 마우스 위치에 따른 카드 회전 효과 적용
      }}
    >
      <div className="user-grade-overlay" style={overlayStyle}></div>  {/* 오버레이 효과 적용 */}
      <img
        src={gradeImage}
        alt={`${userGrade.gradeName} 등급 이미지`}
        className="user-grade-image"
      />
      <p className="user-grade-text">{userGrade.gradeName}</p>
  
      {userGrade.gradeName !== "다이아" && (
        <>
          <div className="user-grade-progress-bar-container">
            <div
              className={`user-grade-progress-bar-${userGrade.gradeName.toLowerCase()}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="user-grade-exp-text">
            경험치: {userExp} / {userGrade.maxExp}
          </p>
        </>
      )}
  
      {userGrade.gradeName === "다이아" && (
        <p className="user-grade-exp-text">경험치: {userExp}</p>
      )}
    </div>
  );
  
};

export default UserGradeImage;
