import "./styles/StudyRoomLeaderBoard.css";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Avatar } from '@mui/material';
import { keyframes } from '@emotion/react';
import useStudyStore from "../../stores/study";

import firstPlaceImg from "./img/firstRankImg.png"
import secondPlaceImg from "./img/secondRankImg.png"
import thirdPlaceImg from "./img/thirdRankImg.png"
import myPlaceImg from "./img/myRankImg.png"

// 슬라이딩 애니메이션을 위한 keyframes
const slide = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
`;

// const rankInfo = [
//   { rank: 1, userId: 1, userName: '김철수', studyTime: 120 },
//   { rank: 2, userId: 2, userName: '이영희', studyTime: 115 },
//   { rank: 3, userId: 3, userName: '박민수', studyTime: 110 }
// ];

const formatStudyTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(remainingMinutes).padStart(2, "0")
  );
};

const StudyRoomLeaderBoard = () => {
  const {rankInfo} = useStudyStore();

  const [index, setIndex] = useState(0);
  const displayCount = Math.min(3, rankInfo.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % displayCount);
    }, 3000); // 3초마다 슬라이딩
    return () => clearInterval(interval);
  }, [displayCount]);

// 랭크에 따라 아바타 이미지를 반환하는 함수
const getAvatarImage = (rank) => {
  switch (rank) {
    case 1:
      return firstPlaceImg;
    case 2:
      return secondPlaceImg;
    case 3:
      return thirdPlaceImg;
    default:
      return myPlaceImg; // 기본 이미지 설정
  }
};

  return (
    <Container className="studyRoomRankLeaderboard">
      <Paper className='studyRoomRankTitlePaper'>
        <Typography variant="body2">
          공부 시간 랭킹
        </Typography>
      </Paper>
      <Paper elevation={3} className='studyRoomRankPaper'>
        <Box className="studyRoomRankContent">
          <Box
            style={{
              animation: `${slide} ${displayCount * 3}s infinite`,
              transform: `translateY(-${index * 100}%)`,
            }}
            className="studyRoomRankSliding"
          >
            {rankInfo.slice(0, displayCount).map(data => (
              <Box key={data.rank}>
                <Avatar src={getAvatarImage(data.rank)} alt={data.userName} />
                <Typography variant="body2">
                  {data.userName}
                </Typography>
                <Typography variant="body2">
                  {formatStudyTime(data.studyTime)}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Paper>
      <Paper elevation={3} className="studyRoomRankinfoPaper">
        <Avatar src={myPlaceImg} alt="기본이미지" />
        <Typography variant="body2">
          {rankInfo[0].userName}
        </Typography>
        <Typography variant="body2">
          {formatStudyTime(rankInfo[0].studyTime)}
        </Typography>
      </Paper>
    </Container>
  );
};

export default StudyRoomLeaderBoard;
