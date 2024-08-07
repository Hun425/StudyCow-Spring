import React, { useState, useEffect, useRef } from 'react';
import './styles/RoomTimer.css'; // 스타일을 정의할 CSS 파일

const RoomTimer = ({ isOpen, onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && !isPaused) {
      timerRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);

      return () => clearInterval(timerRef.current);
    }
  }, [isActive, isPaused]);

  const startTimer = () => {
    setIsActive(true);
    setIsPaused(false);
  };

  const pauseTimer = () => {
    setIsPaused(true);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsPaused(false);
    setSeconds(0);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="timerModalOverlay">
      <div className="timerModalContent">
        <h1 className="timerText">{formatTime(seconds)}</h1>
        <div className="timerButtonGroup">
          <button className='timerButton' onClick={startTimer} disabled={isActive && !isPaused}>시작</button>
          <button className='timerButton' onClick={pauseTimer} disabled={!isActive || isPaused}>일시정지</button>
          <button className='timerButton' onClick={resetTimer}>리셋</button>
          <button className='timerButton' onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );
};

export default RoomTimer;
