import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./styles/Main_Unlogin.css";
import CarouselContents from "../Carousel/CarouselContents";
import BG01 from "../../components/Carousel/img/BG01.png";
import BG02 from "../../components/Carousel/img/BG02.png";
import BG03 from "../../components/Carousel/img/BG03.png";
import BG04 from "../../components/Carousel/img/BG04.png";

const Main_Unlogin = () => {

  // 이동 - 로그인화면으로 단순 이동
  const navigate = useNavigate();
  function goHome() {
    navigate("/login");
  }


  return (
    <>
      <Carousel fade interval={1200}>
        <Carousel.Item>
          <CarouselContents
            src={BG01}
            alt="First slide"
            text="당신의 캐릭터를, 성장시키는 즐거움"
            left="40%"
            top="calc(400/1440*100vw)"
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselContents
            src={BG02}
            alt="Second slide"
            text="해야 하는 todo, check-list로 확인"
            left="100%"
            top="calc(400/1440*100vw)"
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselContents
            src={BG03}
            alt="Third slide"
            text="성적 분석 기능을 통한, 나의 성장 확인 가능"
            left="90%"
            top="calc(150/1440*100vw)"
          />
        </Carousel.Item>
        <Carousel.Item>
          <CarouselContents
            src={BG04}
            alt="Forth slide"
            text="Study with me!, 온라인으로 함께하는 공부, 친구들과의 시간 경쟁"
            left="40%"
            top="calc(150/1440*100vw)"
          />
        </Carousel.Item>
      </Carousel>
      <button className="start-button" onClick={goHome}>START 🚀</button>
    </>
  );
};

export default Main_Unlogin;
