import React, { useState } from "react";
import "./styles/FriendGradeImg.css";

// Import images
import bronze from "../GradeImg/img/Lev. 1/브론즈.jpg";
import silver from "../GradeImg/img/Lev. 2/실버.jpg";
import gold from "../GradeImg/img/Lev. 3/골드.jpg";
import platinum from "../GradeImg/img/Lev. 4/플래티넘.jpg";
import diamond from "../GradeImg/img/Lev. 5/다이아.png";

const FriendGradeImage = ({ gradeName, userExp, maxExp }) => {
  // 마우스 위치 상태 관리
  const [rotateX, setRotateX] = useState(0); // X축 회전 각도를 저장
  const [rotateY, setRotateY] = useState(0); // Y축 회전 각도를 저장
  const [overlayStyle, setOverlayStyle] = useState({}); // 오버레이의 스타일을 저장

  // 마우스 이동 핸들러
  const handleMouseMove = (e) => {
    // 카드 컨테이너의 위치 및 크기 정보 가져오기
    const container = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - container.left; // 마우스의 X좌표를 컨테이너 기준으로 계산
    const y = e.clientY - container.top; // 마우스의 Y좌표를 컨테이너 기준으로 계산

    // 마우스 위치에 따라 회전 각도 계산
    const newRotateY = (-1 / 10) * x + 20; // Y축 회전 각도 계산
    const newRotateX = (2 / 30) * y - 20; // X축 회전 각도 계산

    // 계산된 회전 각도 상태 업데이트
    setRotateX(newRotateX);
    setRotateY(newRotateY);

    // 오버레이의 배경 위치와 투명도/밝기 필터를 업데이트
    setOverlayStyle({
      backgroundPosition: `${x / 5 + y / 5}%`, // 마우스 위치에 따라 배경 이동
      filter: `opacity(${x / 200}) brightness(1.2)`, // 투명도 및 밝기 조정
    });
  };

  // 마우스 아웃 핸들러
  const handleMouseOut = () => {
    // 마우스가 카드 밖으로 나가면 회전 각도와 오버레이 효과를 초기화
    setRotateX(0);
    setRotateY(0);
    setOverlayStyle({
      filter: "opacity(0)", // 오버레이를 투명하게 설정
    });
  };

  // 등급에 따른 이미지 경로 선택
  let gradeImage;
  switch (gradeName) {
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
      gradeImage = bronze; // 기본값으로 브론즈의 첫 번째 이미지 반환
  }

  // 경험치에 따른 진행 바 너비 계산
  const progressPercentage = Math.min((userExp / maxExp) * 100, 100); // 100%를 초과하지 않도록 설정

  return (
    <div
      className={`userGradeImageContainer ${gradeName}`}
      onMouseMove={handleMouseMove} // 마우스가 카드 위에서 움직일 때 호출되는 핸들러
      onMouseOut={handleMouseOut} // 마우스가 카드 밖으로 나갈 때 호출되는 핸들러
      style={{
        transform: `perspective(350px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, // 마우스 위치에 따른 카드 회전 효과 적용
      }}
    >
      <div className="userGradeOverlay" style={overlayStyle}></div>
      {/* 오버레이 효과 적용 */}
      <img
        src={gradeImage}
        alt={`${gradeName} 등급 이미지`}
        className="userGradeImage"
      />
      <p className="userGradeText">{gradeName}</p>

      {gradeName !== "다이아" && (
        <>
          <div className="userGradeProgressBarContainer">
            <div
              className={`user-grade-progress-bar-${gradeName}`}
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="userGradeExpText">
            경험치: {userExp} / {maxExp}
          </p>
          {/* 현재 경험치와 최대 경험치 표시 */}
        </>
      )}

      {gradeName === "다이아" && (
        <p className="user-grade-exp-text">경험치: {userExp}</p>
      )}
    </div>
  );
};

export default FriendGradeImage;
