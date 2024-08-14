import React, { useEffect, useState } from "react";
import surprisedCow from "../assets/supriseCow.gif";
import "../styles/ErrorPage.css";

const ErrorPage = () => {
  const [semicolon, setSemicolon] = useState("");

  useEffect(() => {
    document.title = "에러났소ㅠ";
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSemicolon((prevSemicolon) => {
        if (prevSemicolon.length < 3) {
          return prevSemicolon + ";";
        } else {
          return "";
        }
      });
    }, 500); // 0.5초마다 상태 업데이트

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  return (
    <div className="ErrorPage">
      <img src={surprisedCow} alt="Error GIF" />
      <h1>미안하오, 에러 났소{semicolon}</h1>
    </div>
  );
};

export default ErrorPage;
