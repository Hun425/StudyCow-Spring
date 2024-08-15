import "./styles/StudyList.css";
import StudyRoomItem from "./StudyRoomItem";
import { Link } from "react-router-dom";
import useStudyStore from "../../stores/study";
import { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  Box,
  Avatar,
  Tooltip,
} from "@mui/material";
import { keyframes } from "@emotion/react";
import { styled } from "@mui/material/styles";
import InfoIcon from "@mui/icons-material/Info";

// 랭킹 이미지들
import firstRankImg from "../StudyRoom/img/firstRankImg.png";
import secondRankImg from "../StudyRoom/img/secondRankImg.png";
import thirdRankImg from "../StudyRoom/img/thirdRankImg.png";

// 슬라이딩 애니메이션을 위한 keyframes를 정의
const slide = keyframes`
  0% { transform: translateY(0); }
  100% { transform: translateY(-100%); }
`;

// 공부 시간을 포맷팅하는 함수 -> 분 단위를 시:분 형식으로 변환
const formatStudyTime = (minutes) => {
  const hours = Math.floor(minutes / 60); // 시간 계산
  const remainingMinutes = minutes % 60; // 남은 분 계산
  return (
    String(hours).padStart(2, "0") + // 시간을 2자리 문자열로 변환
    ":" +
    String(remainingMinutes).padStart(2, "0") // 분을 2자리 문자열로 변환
  );
};

// 랭크에 따라 아바타 이미지를 반환하는 함수
const getAvatarImage = (rank) => {
  switch (rank) {
    case 1:
      return firstRankImg; // 1등 이미지
    case 2:
      return secondRankImg; // 2등 이미지
    case 3:
      return thirdRankImg; // 3등 이미지
  }
};

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: "#83a1ca", // 파란색
  borderRadius: 15,
  boxShadow:
    "0 calc(3 / 1440 * 100vw) calc(5 / 1440 * 100vw) calc(2 / 1440 * 100vw) rgba(33, 203, 243, .3)", // 그림자 색상 조정
  color: "white",
  padding: theme.spacing(1), // 패딩 증가
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  fontSize: "1.4rem", // 글씨 크기 증가
  fontWeight: "bold",
}));

// 커스텀 Tooltip 스타일 정의
const LargeTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  "& .MuiTooltip-tooltip": {
    fontSize: "1rem",
    padding: "10px 15px",
    backgroundColor: "#ffffff", // 툴팁 배경색 변경
    color: "black", // 툴팁 텍스트 색상
    maxWidth: "350px", // 툴팁의 최대 너비 증가
    border: "2px solid #6b85a7", // 경계선 추가
  },
}));

// 커스텀 InfoIcon 스타일 정의
const LargeInfoIcon = styled(InfoIcon)(({ theme }) => ({
  fontSize: "3rem", // 아이콘 크기 증가
  color: "#83a1ca", // 아이콘 색상 변경
  cursor: "pointer", // 마우스 오버 시 커서 변경
}));

// 툴팁 내용 컴포넌트(설명)
const TooltipContent = () => (
  <div>
    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
      경험치 정산 방식
    </Typography>
    <ul style={{ paddingLeft: "20px", margin: 0, marginBottom: "10px" }}>
      <li>경험치는 학습시간 1분당 1씩 적립됩니다.</li>
      <li>하루 동안 적립한 경험치는 익일 오전 6시에 정산됩니다.</li>
    </ul>
    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
      랭킹 정산 방식
    </Typography>
    <ul style={{ paddingLeft: "20px", margin: 0 }}>
      <li>
        들어갔던 모든 방에서 공부했던 시간을 합산한 뒤, 순위를 정산합니다.
      </li>
      <li>순위는 실시간으로 갱신됩니다.</li>
    </ul>
  </div>
);

const StudyList = () => {
  const {
    rooms,
    recentRoom,
    fetchRooms,
    fetchRecentRoom,
    yesterdayRankInfo,
    fetchYesterdayRankInfo,
  } = useStudyStore((state) => ({
    rooms: state.rooms,
    recentRoom: state.recentRoom,
    fetchRooms: state.fetchRooms,
    fetchRecentRoom: state.fetchRecentRoom,
    yesterdayRankInfo: state.yesterdayRankInfo,
    fetchYesterdayRankInfo: state.fetchYesterdayRankInfo,
  }));

  // 랭킹 슬라이드를 위한 상태를 설정
  const [index, setIndex] = useState(0); // 현재 표시 중인 랭킹 인덱스
  const displayCount = Math.min(3, yesterdayRankInfo?.rankUser?.length || 0); // 표시할 랭킹 수 (최대 3개)

  useEffect(() => {
    fetchRooms();
    fetchRecentRoom();
    fetchYesterdayRankInfo();
  }, [fetchRooms, fetchRecentRoom, fetchYesterdayRankInfo]);

  const [currentRank, setCurrentRank] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false); // 추가된 상태: 랭킹 정보 확장 여부

  // 랭킹 슬라이드 애니메이션을 위한 Effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRank((prevRank) => (prevRank + 1) % displayCount);
    }, 1500);
    return () => clearInterval(interval);
  }, [displayCount]);

  const handleRankClick = () => {
    setIsExpanded(!isExpanded); // 클릭 시 확장/축소 상태 변경
  };

  return (
    <div className="studyListContainer">
      <div className="studyListHeader">
        <Link to="/study/create">
          <button className="studyCreateBtn">방 생성</button>
        </Link>
        <LargeTooltip title={<TooltipContent />} arrow placement="bottom-start">
          <LargeInfoIcon color="primary" />
        </LargeTooltip>
      </div>
      <div>
        <p className="rankTitle">누적 공부시간 랭킹</p>
        <Container className="studyListRankLeaderboard">
          <StyledPaper elevation={3} onClick={handleRankClick}>
            {/* 클릭 이벤트 추가 */}
            <Box className="studyListRankContent">
              {yesterdayRankInfo?.rankUser
                ?.slice(0, displayCount)
                .map((data, index) => (
                  <Box
                    key={data.rank}
                    className={`studyListRankItem ${
                      index === currentRank ? "active" : ""
                    }`}
                  >
                    <Box className="studyListRankLeft">
                      <Avatar
                        src={getAvatarImage(data.rank)}
                        alt={`Rank ${data.rank}`}
                        className="studyListRankAvatar"
                      />
                      <StyledTypography
                        variant="body2"
                        className="studyListRankNumber"
                      >
                        {data.rank}위
                      </StyledTypography>
                    </Box>
                    <StyledTypography
                      variant="body1"
                      className="studyListRankUserNick"
                    >
                      {data.userNickName}
                    </StyledTypography>
                    <StyledTypography
                      variant="body2"
                      className="studyListRankTime"
                    >
                      {formatStudyTime(data.sumTime)}
                    </StyledTypography>
                  </Box>
                ))}
            </Box>
          </StyledPaper>
          {/* 확장된 랭킹 정보를 렌더링 */}
          {isExpanded && (
            <Box className="expandedRankInfo">
              {yesterdayRankInfo?.rankUser?.slice(0, 3).map((data) => (
                <Box key={data.rank} className="expandedRankItem">
                  <StyledTypography variant="h6" className="expandedRankNumber">
                    {data.rank}위
                  </StyledTypography>
                  <StyledTypography
                    variant="body1"
                    className="expandedRankUserNick"
                  >
                    {data.userNickName}
                  </StyledTypography>
                  <StyledTypography
                    variant="body1"
                    className="expandedRankTime"
                  >
                    총 공부 시간: {formatStudyTime(data.sumTime)}
                  </StyledTypography>
                </Box>
              ))}
            </Box>
          )}
        </Container>
      </div>
      <div className="recentStudyRoom">
        <p className="recentEnterTitle">최근 입장한 스터디룸</p>
        {recentRoom ? (
          <StudyRoomItem
            roomId={recentRoom.id}
            title={recentRoom.roomTitle}
            thumb={recentRoom.roomThumb}
            maxPerson={recentRoom.roomMaxPerson}
            nowPerson={recentRoom.roomNowPerson}
          />
        ) : (
          <div>
            <p>최근 접속한 방이 없소!</p>
          </div>
        )}
      </div>
      <div className="studyRoomList">
        <p className="studyListTitle">스터디룸 목록</p>
        {rooms && rooms.length > 0 ? (
          <div className="studyRoomGrid">
            {rooms.map((room) => (
              <StudyRoomItem
                key={room.id}
                roomId={room.id}
                title={room.title}
                thumb={room.thumb}
                maxPerson={room.maxPerson}
                nowPerson={room.nowPerson}
              />
            ))}
          </div>
        ) : (
          <div>
            <p>만들어진 방이 없소!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyList;
