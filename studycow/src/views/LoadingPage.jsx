import React, { useEffect, useState } from "react";
import cowDribbble from "../assets/cow_dribbble.gif";
import "../styles/LoadingPage.css";

const LoadingPage = () => {
  const [dots, setDots] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prevDots) => {
        if (prevDots.length < 3) {
          return prevDots + ".";
        } else {
          return "";
        }
      });
    }, 500);

    const progressInterval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress < 100) {
          return prevProgress + 100 / 2500;
        } else {
          clearInterval(progressInterval);
          return 100;
        }
      });
    }, 10);

    return () => {
      clearInterval(dotInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="LoadingPage">
      <img src={cowDribbble} alt="Loading GIF" />
      <progress value={progress} max="100" className="loading-bar"></progress>
      <h1>열심히 가고있소{dots}</h1>
    </div>
  );
};

export default LoadingPage;
