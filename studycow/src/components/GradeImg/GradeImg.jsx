import React from "react";
import useInfoStore from "../../stores/infos";
import "./Styles/GradeImg.css";

// Import images
import bronze1 from "./img/Lev. 1/브론즈1.jpeg";
import bronze2 from "./img/Lev. 1/브론즈2.jpeg";
import bronze3 from "./img/Lev. 1/브론즈3.jpeg";
import bronze4 from "./img/Lev. 1/브론즈4.jpeg";
import silver from "./img/Lev. 2/실버.jpeg";
import gold from "./img/Lev. 3/골드.jpeg";
import platinum from "./img/Lev. 4/플래티넘.jpeg";
import diamond from "./img/Lev. 5/다이아.png";

const UserGradeImage = () => {
  // 스토어에서 유저 정보 가져오기
  const { userInfo } = useInfoStore();
  const { userGrade } = userInfo;

  // 이미지 배열 정의
  const bronzeImages = [bronze1, bronze2, bronze3, bronze4];

  // 등급에 따른 이미지 경로 선택
  let gradeImage;
  switch (userGrade.gradeName) {
    case "브론즈":
      gradeImage = bronzeImages[Math.floor(Math.random() * bronzeImages.length)];
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
      gradeImage = bronze1; // 기본값으로 브론즈의 첫 번째 이미지 반환
  }

  // 선택된 이미지를 JSX로 반환, className 추가
  return <img src={gradeImage} alt={`${userGrade.gradeName} 등급 이미지`} className="user-grade-image" />;
};

export default UserGradeImage;
