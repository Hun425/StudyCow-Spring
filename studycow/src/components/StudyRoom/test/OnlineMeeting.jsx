import React, { Component } from "react";
import { OpenVidu } from "openvidu-browser";
import axios from "axios";
import UserVideoComponent from "./UserVideoComponent";
import "./OnlineMeeting.css";

// 로컬 미디어 서버 주소
const OPENVIDU_SERVER_URL = "https://i11c202.p.ssafy.io:8444";
const OPENVIDU_SERVER_SECRET = "1emdgkrhthajrwk";

class OnlineMeeting extends Component {
  constructor(props) {
    super(props);
    this.userRef = React.createRef();

    this.state = {
      mySessionId: "SessionA",
      myUserName: "Participant" + Math.floor(Math.random() * 100),
      session: undefined,
      mainStreamManager: undefined,
      publisher: undefined, // 로컬 웹캠 스트림
      subscribers: [], // 다른 사용자의 활성 스트림
      isMike: true,
      isCamera: true,
      isSpeaker: true,
      isChat: false,
    };

    this.joinSession = this.joinSession.bind(this);
    this.leaveSession = this.leaveSession.bind(this);
    this.handleMainVideoStream = this.handleMainVideoStream.bind(this);
    this.onbeforeunload = this.onbeforeunload.bind(this);
    this.handleToggle = this.handleToggle.bind(this);
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.onbeforeunload);
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.onbeforeunload);
  }

  onbeforeunload(e) {
    this.leaveSession();
  }

  leaveSession() {
    const mySession = this.state.session;

    if (mySession) {
      mySession.disconnect();
    }

    this.OV = null;
    this.setState({
      session: undefined,
      subscribers: [],
      mySessionId: undefined,
      myUserName: undefined,
      mainStreamManager: undefined,
      publisher: undefined,
    });
  }

  deleteSubscriber(streamManager) {
    let subscribers = this.state.subscribers;
    let index = subscribers.indexOf(streamManager, 0);
    if (index > -1) {
      subscribers.splice(index, 1);
      this.setState({ subscribers: subscribers });
    }
  }

  handleMainVideoStream(stream) {
    if (this.state.mainStreamManager !== stream) {
      this.setState({ mainStreamManager: stream });
    }
  }

  handleToggle(kind) {
    if (this.state.publisher) {
      switch (kind) {
        case "camera":
          this.setState({ isCamera: !this.state.isCamera }, () => {
            this.state.publisher.publishVideo(this.state.isCamera);
          });
          break;

        case "speaker":
          this.setState({ isSpeaker: !this.state.isSpeaker }, () => {
            this.state.subscribers.forEach((s) =>
              s.subscribeToAudio(this.state.isSpeaker)
          );
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
  this.OV = new OpenVidu(); // OpenVidu 객체를 얻음

  this.OV.setAdvancedConfiguration({
    publisherSpeakingEventsOptions: {
      interval: 50,
      threshold: -75,
    },
  });

  this.setState(
    {
      session: this.OV.initSession(),
    },
    () => {
      let mySession = this.state.session;

      // Session 객체가 각각 새로운 stream에 대해 구독 후, subscribers 상태값 업뎃
      mySession.on("streamCreated", (e) => {
        let subscriber = mySession.subscribe(e.stream, undefined);
        var subscribers = this.state.subscribers;
        subscribers.push(subscriber);

        this.setState({ subscribers });
      });

      // 사용자가 화상회의를 떠나면 Session 객체에서 소멸된 stream을 받아와 subscribers 상태값 업뎃
      mySession.on("streamDestroyed", (e) => {
        this.deleteSubscriber(e.stream.streamManager);
      });

      // 서버 측에서 비동기식 오류 발생 시 Session 객체에 의해 트리거되는 이벤트
      mySession.on("exception", (exception) => {
        console.warn(exception);
      });

      // 발언자 감지
      mySession.on("publisherStartSpeaking", (event) => {
        for (let i = 0; i < this.userRef.current.children.length; i++) {
          if (
            JSON.parse(event.connection.data).clientData ===
            this.userRef.current.children[i].innerText
          ) {
            this.userRef.current.children[i].style.borderStyle = "solid";
            this.userRef.current.children[i].style.borderColor = "#1773EA";
          }
        }
      });

      mySession.on("publisherStopSpeaking", (event) => {
        for (let i = 0; i < this.userRef.current.children.length; i++) {
          if (
            JSON.parse(event.connection.data).clientData ===
            this.userRef.current.children[i].innerText
          ) {
            this.userRef.current.children[i].style.borderStyle = "none";
          }
        }
      });

      this.getToken().then((token) => {
        mySession
          .connect(token, {
            clientData: this.state.myUserName,
          })
          .then(() => {
            let publisher = this.OV.initPublisher(undefined, {
              audioSource: undefined,
              videoSource: undefined,
              publishAudio: true,
              publishVideo: true,
              resolution: "640x480",
              frameRate: 30,
              insertMode: "APPEND",
              mirror: "false",
            });

            mySession.publish(publisher);

            this.setState({ mainStreamManager: publisher, publisher });
          })
          .catch((error) => {
            console.log("세션 연결 오류", error.code, error.message);
          });
      });
    }
  );
}

getToken() {
  return this.createSession(this.state.mySessionId).then((sessionId) =>
    this.createToken(sessionId)
  );
}

createSession(sessionId) {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify({ customSessionId: sessionId });

    axios
      .post(OPENVIDU_SERVER_URL + "/openvidu/api/sessions", data, {
        headers: {
          Authorization: `Basic ${btoa(
            `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
          )}`,
          "Content-Type": "application/json",
        },
      })
      .then((res) => {
        resolve(res.data.id);
      })
      .catch((res) => {
        let error = Object.assign({}, res);

        if (error?.response?.status === 409) {
          resolve(sessionId);
        } else if (
          window.confirm(
            'No connection to OpenVidu Server. This may be a certificate error at "' +
              OPENVIDU_SERVER_URL +
              '"\n\nClick OK to navigate and accept it. If no certifica' +
              "te warning is shown, then check that your OpenVidu Server is up and running at" +
              ' "' +
              OPENVIDU_SERVER_URL +
              '"'
          )
        ) {
          window.location.assign(OPENVIDU_SERVER_URL + "/accept-certificate");
        }
      });
  });
}

createToken(sessionId) {
  return new Promise((resolve, reject) => {
    let data = {};

    axios
      .post(
        `${OPENVIDU_SERVER_URL}/openvidu/api/sessions/${sessionId}/connection`,
        data,
        {
          headers: {
            Authorization: `Basic ${btoa(
              `OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
            )}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        resolve(res.data.token);
      })
      .catch((error) => reject(error));
  });
}

render() {
  return (
    <div className="container">
      <div className="header">
        <p className="study-title">Java Study</p>
      </div>
      <div className="middle">
        {this.state.session === undefined ? (
          <div
            style={{
              position: "absolute",
              right: "0",
              left: "0",
              width: "300px",
              margin: "auto",
              height: "300px",
            }}
            id="join"
          >
            <div>
              <h1 style={{ color: "white" }}>Join a video session</h1>
              <form
                style={{ display: "flex", justifyContent: "center" }}
                className="form-group"
                onSubmit={this.joinSession}
              >
                <p className="text-center">
                  <input
                    className="btn btn-lg btn-success"
                    name="commit"
                    type="submit"
                    value="JOIN"
                  />
                </p>
              </form>
            </div>
          </div>
        ) : null}
        <div className="left">
          <div className="video-container">
            {this.state.session !== undefined ? (
              <div
                className={`stream-container-wrapper ${
                  this.state.isChat ? "primary" : ""
                }`}
                ref={this.userRef}
              >
                {this.state.publisher !== undefined ? (
                  <div
                    className="stream-container"
                    key={this.state.publisher.stream.streamId}
                  >
                    <UserVideoComponent
                      streamManager={this.state.publisher}
                    />
                  </div>
                ) : null}
                {this.state.subscribers.map((sub) => (
                  <div
                    className="stream-container"
                    key={sub.stream.streamId}
                  >
                    <UserVideoComponent streamManager={sub} />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div
          className={`right ${this.state.isChat ? "primary" : ""}`}
        >
          <div className="chat">
            <span>채팅자리</span>
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="bottom-box">
          <div
            className={`icon ${!this.state.isCamera ? "primary" : ""}`}
            onClick={() => this.handleToggle("camera")}
          >
            {this.state.isCamera ? "🎥" : "🚫🎥"}
          </div>
          <div
            className={`icon ${!this.state.isMike ? "primary" : ""}`}
            onClick={() => this.handleToggle("mike")}
          >
            {this.state.isMike ? "🎤" : "🚫🎤"}
          </div>
          <div
            className={`icon ${!this.state.isSpeaker ? "primary" : ""}`}
            onClick={() => this.handleToggle("speaker")}
          >
            {this.state.isSpeaker ? "🎧" : "🚫🎧"}
          </div>
          <div className="icon primary" onClick={this.leaveSession}>
            🚪
          </div>
        </div>
        <div
          className="chat-icon-box"
          onClick={() => this.setState({ isChat: !this.state.isChat })}
        >
          💬
        </div>
      </div>
    </div>
  );
}
}

export default OnlineMeeting;
