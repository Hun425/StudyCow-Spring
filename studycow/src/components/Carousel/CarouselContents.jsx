import React from "react";
import "./styles/CarouselContents.css";
import { useNavigate } from "react-router-dom";

const CarouselContents = ({ src, alt, text, left = "0", top = "0" }) => {

  // 이동 - 로그인화면으로 단순 이동
  const navigate = useNavigate();
  function goHome() {
    navigate("/login");
  }


  return (
    <div className="carousel-container">
      <img className="d-block" src={src} alt={alt} />
      <button className="start-button" onClick={goHome}>START 🚀</button>

      {text &&
        text.trim() && ( // text가 존재하고 비어있지 않을 때만 렌더링
          <div
            className="recommendation-text"
            style={{ position: "absolute", left: left, top: top }} // 텍스트의 위치 조정
          >
            {text.split(",").map((word, index) => (
              <p key={index} style={{ animationDelay: `${index * 0.4}s` }}>
                {word}
              </p>
            ))}
          </div>
        )}
    </div>
  );
};

export default CarouselContents;
