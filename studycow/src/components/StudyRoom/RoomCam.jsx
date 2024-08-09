import React, { useEffect, useRef, useState } from "react";
import { Grid, CircularProgress, Typography } from "@mui/material";
import UserVideoComponent from "./RoomCam/UserVideoComponent";
import useRoomStore from "../../stores/OpenVidu";
import useInfoStore from "../../stores/infos.js";
import "./styles/RoomCam.css";

// RoomCam 컴포넌트
function RoomCam({ roomId }) {
  const { userInfo } = useInfoStore();
  const userRef = useRef(null);

  const [loading, setLoading] = useState(true);

  const {
    session,
    publisher,
    subscribers,
    setMySessionId,
    setMyUserName,
    leaveSession,
    joinSession
  } = useRoomStore(state => ({
    session: state.session,
    publisher: state.publisher,
    subscribers: state.subscribers,
    setMySessionId: state.setMySessionId,
    setMyUserName: state.setMyUserName,
    leaveSession: state.leaveSession,
    joinSession: state.joinSession
  }));


  const getGridStyle = () => {
    const numberOfSubscribers = subscribers.length;

    if (numberOfSubscribers >= 1 && numberOfSubscribers <= 3) {
      return { gridTemplateColumns: 'repeat(2, 1fr)' }; // 2개의 열
    } else if (numberOfSubscribers >= 4 && numberOfSubscribers <= 5) {
      return { gridTemplateColumns: 'repeat(3, 1fr)' }; // 3개의 열
    } else {
      return { gridTemplateColumns: 'repeat(1, 1fr)' }; // 기본값 (1개의 열)
    }
  };

  useEffect(() => {
    // 세션 ID와 유저 이름 설정
    setMySessionId(roomId);
    setMyUserName(userInfo.userNickName);
  }, [setMySessionId, setMyUserName, roomId, userInfo]);

  useEffect(() => {
    // 컴포넌트가 마운트되면 joinSession 호출
    if (session === undefined) {
      joinSession().then(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [session, joinSession]);

  useEffect(() => {
    // 페이지를 닫거나 새로 고침할 때 leaveSession 호출
    window.addEventListener("beforeunload", onbeforeunload);

    return () => {
      window.removeEventListener("beforeunload", onbeforeunload);
    };
  }, []);

  const onbeforeunload = (e) => {
    leaveSession();
  };

  // publisher와 publisher.stream이 정의되었는지 확인
  useEffect(() => {
    if (publisher && publisher.stream) {
      console.log("Publisher stream:", publisher.stream);
      // 필요시 publisher.stream의 메서드를 호출할 수 있습니다.
      // 예: publisher.stream.getAudioTracks();
    }
  }, [publisher]);

  if (loading) {
    return (
      <div className="loading-container">
        <CircularProgress />
        <Typography variant="h6" align="center">Loading...</Typography>
      </div>
    );
  }

  return (
    <div className="video-session-container">
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <div className="video-container">
            {session !== undefined && (
              <div className="video-stream-container" ref={userRef} style={getGridStyle()}>
                {publisher !== undefined && (
                  <div className="video-stream">
                    <UserVideoComponent streamManager={publisher} />
                  </div>
                )}
                {subscribers.map((sub) => (
                  <div className="video-stream" key={sub.stream.streamId}>
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
}

export default RoomCam;
