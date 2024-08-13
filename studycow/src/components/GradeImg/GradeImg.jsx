import React from "react";
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
      gradeImage = bronze; // 기본값으로 브론즈의 첫 번째 이미지 반환
  }

  // 경험치에 따른 진행 바 너비 계산
  const progressPercentage = Math.min((userExp / userGrade.maxExp) * 100, 100); // 100%를 초과하지 않도록 설정

  return (
    <div className={`user-grade-image-container ${userGrade.gradeName}`}>
      <img
        src={gradeImage}
        alt={`${userGrade.gradeName} 등급 이미지`}
        className="user-grade-image"
      />
      <p className="user-grade-text">{userGrade.gradeName}</p>

      {/* 다이아 등급이 아닌 경우에만 진행 바와 max 경험치 표시 */}
      {userGrade.gradeName !== "다이아" && (
        <>
          <div className="user-grade-progress-bar-container">
            <div
              className="user-grade-progress-bar"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="user-grade-exp-text">
            경험치: {userExp} / {userGrade.maxExp}
          </p>
        </>
      )}

      {/* 다이아 등급일 때는 현재 경험치만 표시 */}
      {userGrade.gradeName === "다이아" && (
        <p className="user-grade-exp-text">경험치: {userExp}</p>
      )}
    </div>
  );
};

export default UserGradeImage;
