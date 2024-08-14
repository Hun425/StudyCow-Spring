import "./styles/StudyRoomLeaderBoard.css";
import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Box, Avatar, Link } from '@mui/material';
import { keyframes } from '@emotion/react';
import useStudyStore from "../../stores/study";
import useInfoStore from "../../stores/infos";
import firstPlaceImg from "./img/firstRankImg.png"
import secondPlaceImg from "./img/secondRankImg.png"
import thirdPlaceImg from "./img/thirdRankImg.png"
import myPlaceImg from "./img/myRankImg.png"
import RefreshIcon from '@mui/icons-material/Refresh';


const InfoStore = useInfoStore.getState();

const { updateStudyTime } = useStudyStore.getState();


// 슬라이딩 애니메이션을 위한 keyframes
const slide = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
`;

const formatStudyTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(remainingMinutes).padStart(2, "0")
  );
};

const StudyRoomLeaderBoard = ({ myRankInfo = { userName: InfoStore.userInfo.userNickName, studyTime: 0 } }) => {
  const { rankInfo = [] } = useStudyStore();

  const [index, setIndex] = useState(0);
  const displayCount = Math.min(3, rankInfo.length);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % displayCount);
    }, 3000); // 3초마다 슬라이딩
    return () => clearInterval(interval);
  }, [displayCount]);

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
        <Box sx={{ flex: 0, display: 'flex', justifyContent: 'flex-end' }}>
          <Link href="#" color="inherit"><RefreshIcon onClick={updateStudyTime} /></Link>
        </Box>
      
      </Paper>
      {rankInfo.length === 0 || myRankInfo.length === 0 ? (
        <Typography variant="body2" className="studyRoomRankNoData">
          현재 랭킹을 조회할 수 없습니다.
          <br/>
          잠시 후 다시 시도해주세요.
        </Typography>
      ) : (
        <>
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
                    <Typography variant="body2" className="studyRoomRankUserNick">
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
            <Box className="studyRoomRankinfoContent">
              <Avatar src={myPlaceImg} alt="기본이미지" />
              <Typography variant="body2" className="studyRoomRankUserNick">
                {myRankInfo.userName || "알 수 없음"}
              </Typography>
              <Typography variant="body2">
                {formatStudyTime(myRankInfo.studyTime)}
              </Typography>
            </Box>
          </Paper>
        </>
      )}
    </Container>
  );
};

export default StudyRoomLeaderBoard;
