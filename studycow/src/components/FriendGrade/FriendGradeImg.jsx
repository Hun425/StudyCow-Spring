import React from "react";
import "./styles/FriendGradeImg.css";

// Import images
import bronze from "../GradeImg/img/Lev. 1/브론즈.jpg";
import silver from "../GradeImg/img/Lev. 2/실버.jpg";
import gold from "../GradeImg/img/Lev. 3/골드.jpg";
import platinum from "../GradeImg/img/Lev. 4/플래티넘.jpg";
import diamond from "../GradeImg/img/Lev. 5/다이아.png";

const FriendGradeImage = ({ gradeName, userExp, maxExp }) => {
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
    <div className="userGradeImageContainer">
      <img
        src={gradeImage}
        alt={`${gradeName} 등급 이미지`}
        className="userGradeImage"
      />
      <p className="userGradeText">{gradeName}</p>
      <div className="userGradeProgressBarContainer">
        <div
          className="userGradeProgressBar"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <p className="userGradeExpText">{`경험치: ${userExp} / ${maxExp}`}</p>{" "}
      {/* 현재 경험치와 최대 경험치 표시 */}
    </div>
  );
};

export default FriendGradeImage;
