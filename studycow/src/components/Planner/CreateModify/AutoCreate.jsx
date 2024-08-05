import React from "react";
import "./styles/AutoCreate.css"; // 스타일 파일을 임포트

const AutoCreate = ({ show, onClose }) => {
  if (!show) return null; // show가 false이면 모달을 렌더링하지 않음

  return (
    <div className="AutoCreateModalOverlay">
      <div className="AutoCreateModalContent">
        <h2>자동 생성</h2>
        <p>자동 생성 기능에 대한 내용을 여기에 입력하세요.</p>
        <button className="AutoCreateCloseButton" onClick={onClose}>
          닫기
        </button>
      </div>
    </div>
  );
};

export default AutoCreate;
