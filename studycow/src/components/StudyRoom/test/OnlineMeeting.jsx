import React, { Component } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import { Hands } from '@mediapipe/hands';
import { Camera } from '@mediapipe/camera_utils';
import UserVideoComponent from "./UserVideoComponent.jsx";
import "./OnlineMeeting.css";

const OPENVIDU_SERVER_URL = "https://i11c202.p.ssafy.io:8444";
const OPENVIDU_SERVER_SECRET = "1emdgkrhthajrwk";

class OnlineMeeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 세션 ID와 참여자 이름 설정
      mySessionId: `SessionA-${Date.now()}`,
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
      subscribers: [],
      // 마이크, 카메라, 스피커, 채팅 상태 설정
      isMike: true,
      isCamera: true,
      isSpeaker: true,
      isChat: false,
      // 타이머 관련 상태 설정
      timer: 0,
      isTimerRunning: false,
      lastPoseDetectedTime: Date.now(),
      isHandsAvailable: false,
    };

    // 메서드 바인딩
    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
    this.detectHands = this.detectHands.bind(this);
    this.handleChangeSessionId = this.handleChangeSessionId.bind(this);
    this.handleChangeUserName = this.handleChangeUserName.bind(this);
    this.handleJoinSession = this.handleJoinSession.bind(this);
  }

  async componentDidMount() {
    // 페이지 종료 시 세션 종료 이벤트 등록
    window.addEventListener("beforeunload", this.onbeforeunload);

    // Mediapipe Hands 모델 설정
    const hands = new Hands({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
      }
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    // Mediapipe Hands 결과 처리 함수 바인딩
    hands.onResults(this.onResults.bind(this));

    this.hands = hands;

    // 1초마다 손 동작 감지 함수 실행
    this.interval = setInterval(() => {
      if (this.state.isHandsAvailable && this.state.publisher) {
        this.detectHands();
      }
      console.log("Timer state:", this.state.isTimerRunning, "Current time:", this.state.timer);
    }, 1000);
  }

  componentWillUnmount() {
    // 페이지 종료 시 이벤트 리스너 제거 및 타이머 중지
    window.removeEventListener("beforeunload", this.onbeforeunload);
    clearInterval(this.interval);
  }

  async detectHands() {
    // 퍼블리셔의 비디오 요소에 손 동작 감지 수행
    if (this.state.publisher && this.state.publisher.videos && this.state.publisher.videos[0]) {
      const video = this.state.publisher.videos[0].video;

      if (!video) {
        console.log('Video element is not available yet');
        return;
      }

      if (video.readyState !== 4) {
        console.log('Video is not ready yet. ReadyState:', video.readyState);
        return;
      }

      try {
        this.hands.send({ image: video });
      } catch (error) {
        console.error('Error sending video to Mediapipe Hands:', error);
      }
    } else {
      console.log("Video reference is not available");
    }
  }

  onResults(results) {
    const currentTime = Date.now();
    console.log("Mediapipe Hands results received:", results);

    // 손 동작이 감지되면 타이머 실행, 감지되지 않으면 일정 시간 후 타이머 중지
    if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
      console.log("Hands detected:", results.multiHandLandmarks);
      this.setState(prevState => ({
        lastPoseDetectedTime: currentTime,
        isTimerRunning: true,
        timer: prevState.isTimerRunning ? prevState.timer + 1 : prevState.timer
      }));
    } else {
      const timeSinceLastPose = currentTime - this.state.lastPoseDetectedTime;
      console.log("No hands detected. Time since last pose:", timeSinceLastPose, "ms");

      if (timeSinceLastPose > 10000) {
        console.log("No hands detected for 10 seconds, pausing timer");
        this.setState({ isTimerRunning: false });
      }
    }
  }

  onbeforeunload(event) {
    // 페이지 종료 시 세션 종료
    this.leaveSession();
  }

  handleChangeSessionId(e) {
    // 세션 ID 변경 핸들러
    this.setState({ mySessionId: e.target.value });
  }

  handleChangeUserName(e) {
    // 참여자 이름 변경 핸들러
    this.setState({ myUserName: e.target.value });
  }

  handleJoinSession(e) {
    // 세션 참여 핸들러
    e.preventDefault();
    this.joinSession();
  }

  handleMainVideoStream(stream) {
    // 메인 비디오 스트림 변경 핸들러
    if (this.state.mainStreamManager !== stream) {
      this.setState({ mainStreamManager: stream });
    }
  }

  deleteSubscriber(streamManager) {
    // 구독자 제거 함수
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({ subscribers: subscribers });
    }
  }

  handleToggle(kind) {
    // 마이크, 카메라, 스피커 상태 변경 핸들러
    if (this.state.publisher) {
      switch (kind) {
        case "camera":
          this.setState({ isCamera: !this.state.isCamera }, () => {
            this.state.publisher.publishVideo(this.state.isCamera);
          });
          break;
        case "speaker":
          this.setState({ isSpeaker: !this.state.isSpeaker }, () => {
            this.state.subscribers.forEach((s) => s.subscribeToAudio(this.state.isSpeaker));
          });
          break;
        case "mike":
          this.setState({ isMike: !this.state.isMike }, () => {
            this.state.publisher.publishAudio(this.state.isMike);
          });
          break;
      }
    }
  }

  joinSession() {
    // 세션 참여 로직
    this.OV = new OpenVidu();
    this.setState(
        { session: this.OV.initSession() },
        () => {
          var mySession = this.state.session;
          mySession.on("streamCreated", (event) => {
            var subscriber = mySession.subscribe(event.stream, undefined);
            var subscribers = this.state.subscribers;
            subscribers.push(subscriber);
            this.setState({ subscribers: subscribers });
          });

          mySession.on("streamDestroyed", (event) => {
            this.deleteSubscriber(event.stream.streamManager);
          });

          mySession.on("exception", (exception) => {
            console.warn(exception);
          });

          this.getToken().then((token) => {
            mySession
                .connect(token, { clientData: this.state.myUserName })
                .then(async () => {
                  let publisher = await this.OV.initPublisherAsync(undefined, {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    resolution: "640x480",
                    frameRate: 30,
                    insertMode: "APPEND",
                    mirror: false,
                  });

                  mySession.publish(publisher);
                  this.setState({
                    mainStreamManager: publisher,
                    publisher: publisher,
                    isHandsAvailable: true,
                  }, () => {
                    console.log("Publisher set in state");
                  });
                })
                .catch((error) => {
                  console.log("There was an error connecting to the session:", error.code, error.message);
                });
          });
        }
    );
  }

  leaveSession() {
    // 세션 종료 로직
    const mySession = this.state.session;
    if (mySession) {
      mySession.disconnect();
    }

    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: `SessionA-${Date.now()}`,
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      mainStreamManager: undefined,
      publisher: undefined,
      timer: 0,
      isTimerRunning: false,
    });
  }

  render() {
    const { mySessionId, myUserName } = this.state;

    return (
        <div className="container">
          <div className="header">
            <h1>Online Meeting</h1>
            <div className="timer-container">
              <h2>Study Timer</h2>
              <p className="timer-value">
                {Math.floor(this.state.timer / 60)}:{(this.state.timer % 60).toString().padStart(2, '0')}
              </p>
              <p className="timer-status">
                Status: {this.state.isTimerRunning ? "Running" : "Paused"}
              </p>
            </div>
            <div>
              <p>Hands Available: {this.state.isHandsAvailable ? "Yes" : "No"}</p>
              <p>Timer Running: {this.state.isTimerRunning ? "Yes" : "No"}</p>
              <p>Current Time: {this.state.timer} seconds</p>
            </div>
          </div>

          <div className="main-content">
            {this.state.session === undefined ? (
                <div id="join">
                  <div id="join-dialog">
                    <h1>Join a video session</h1>
                    <form className="form-group" onSubmit={this.handleJoinSession}>
                      <p>
                        <label>Participant: </label>
                        <input
                            className="form-control"
                            type="text"
                            id="userName"
                            value={myUserName}
                            onChange={this.handleChangeUserName}
                            required
                        />
                      </p>
                      <p>
                        <label>Session: </label>
                        <input
                            className="form-control"
                            type="text"
                            id="sessionId"
                            value={mySessionId}
                            onChange={this.handleChangeSessionId}
                            required
                        />
                      </p>
                      <p className="text-center">
                        <button className="btn btn-lg btn-success" type="submit">
                          JOIN
                        </button>
                      </p>
                    </form>
                  </div>
                </div>
            ) : (
                <div id="session">
                  <div id="session-header">
                    <h1 id="session-title">{mySessionId}</h1>
                    <input
                        className="btn btn-large btn-danger"
                        type="button"
                        id="buttonLeaveSession"
                        onClick={this.leaveSession}
                        value="Leave session"
                    />
                  </div>

                  <div id="video-container">
                    {this.state.publisher !== undefined ? (
                        <div className="stream-container" onClick={() => this.handleMainVideoStream(this.state.publisher)}>
                          <UserVideoComponent streamManager={this.state.publisher} />
                        </div>
                    ) : (
                        <p>Waiting for video stream...</p>
                    )}
                    {this.state.subscribers.map((sub, i) => (
                        <div key={i} className="stream-container" onClick={() => this.handleMainVideoStream(sub)}>
                          <UserVideoComponent streamManager={sub} />
                        </div>
                    ))}
                  </div>
                </div>
            )}
          </div>
        </div>
    );
  }


  async getToken() {
    // 세션 토큰 받기 함수
    try {
      const sessionId = await this.createSession(this.state.mySessionId);
      return await this.createToken(sessionId);
    } catch (error) {
      console.error("Error in getToken:", error);
      // 오류 처리
    }
  }

  async createSession(sessionId) {
    // 세션 생성 함수
    try {
      const response = await axios.post(
          OPENVIDU_SERVER_URL + "/openvidu/api/sessions",
          { customSessionId: sessionId },
          {
            headers: {
              Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
              "Content-Type": "application/json",
            },
          }
      );
      return response.data.id;
    } catch (error) {
      if (error.response && error.response.status === 409) {
        console.log("Session already exists");
        return sessionId; // 이미 존재하는 세션이면 그대로 사용
      } else {
        console.error("Error creating session:", error);
        throw error;
      }
    }
  }

  async createToken(sessionId) {
    // 토큰 생성 함수
    const response = await axios.post(
        OPENVIDU_SERVER_URL + "/openvidu/api/sessions/" + sessionId + "/connection",
        {},
        {
          headers: {
            Authorization: "Basic " + btoa("OPENVIDUAPP:" + OPENVIDU_SERVER_SECRET),
            "Content-Type": "application/json",
          },
        }
    );
    return response.data.token;
  }
}

export default OnlineMeeting;