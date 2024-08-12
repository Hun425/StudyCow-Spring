import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import useInfoStore from '../../../stores/infos';
import useStudyStore from "../../../stores/study.js";
import './UserVideo.css';

export default class UserVideoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 0,
            handDetected: false
        };
        this.timerInterval = null;
        this.camera = null;
        this.hands = null;
        this.videoElement = React.createRef();
    }

    componentDidMount() {
        const { userInfo } = useInfoStore.getState();
        const { updateStudyTime, setMyStudyTimeSec, myStudyTimeSec } = useStudyStore.getState();
        const nickname = this.getNicknameTag();

        // 타이머를 스터디스토어의 myStudyTimeSec으로 초기화
        this.setState({ timer: myStudyTimeSec });

        // 자신의 캠인지 확인
        if (nickname === userInfo.userNickName) {
            // 타이머 시작
            this.timerInterval = setInterval(() => {
                if (this.state.handDetected) {
                    this.setState(prevState => {
                        const newTimer = prevState.timer + 1;
                        
                        // 1초마다 타이머 업데이트
                        setMyStudyTimeSec(newTimer);

                        // 1분마다 updateStudyTime() 호출
                        if (newTimer % 60 === 0) {
                            updateStudyTime();
                        }

                        return { timer: newTimer };
                    });
                }
            }, 1000);

            // 손동작 감지 5초마다 수행
            this.handDetectionInterval = setInterval(() => {
                if (this.hands && this.videoElement.current) {
                    this.hands.send({ image: this.videoElement.current });
                }
            }, 5000);

            // MediaPipe Hands 초기화
            this.hands = new window.Hands({
                locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/hands@0.4/${file}`
            });
            console.log("핸즈 객체 로드확인:", this.hands); // Hands 객체가 올바르게 로드되었는지 확인

            this.hands.setOptions({
                maxNumHands: 2,
                modelComplexity: 1,
                minDetectionConfidence: 0.7,
                minTrackingConfidence: 0.5
            });
            this.hands.onResults(this.onResults);

            // 카메라 설정
            this.camera = new window.Camera(this.videoElement.current, {
                onFrame: async () => {
                    if (this.hands) {
                        await this.hands.send({ image: this.videoElement.current });
                    }
                },
                width: 640,
                height: 480
            });
            this.camera.start();
        }
    }

    componentWillUnmount() {
        // 컴포넌트가 언마운트 될 때 타이머와 카메라 정리
        if (this.timerInterval) {
            clearInterval(this.timerInterval); // 타이머 인터벌 정리
        }
        if (this.handDetectionInterval) {
            clearInterval(this.handDetectionInterval); // 손동작 감지 인터벌 정리
        }
        if (this.camera) {
            this.camera.stop(); // 카메라 정리
        }
        if (this.hands) {
            // Hands 객체 정리 (해당 메서드가 존재하는지 확인 필요)
            this.hands.close && this.hands.close(); // Hands 객체 정리
        }
    }

    onResults = (results) => {
        // 손이 감지되었는지 여부 업데이트
        if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
            this.setState({ handDetected: true });
        } else {
            this.setState({ handDetected: false });
        }
    }

    getNicknameTag() {
        try {
            return JSON.parse(this.props.streamManager?.stream?.connection?.data || "{}").clientData;
        } catch (error) {
            console.error("getNicknameTag 오류:", error);
            return "";
        }
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    render() {
        const { userInfo } = useInfoStore.getState();
        const nickname = this.getNicknameTag();

        // 자신의 캠일 때만 정보 표시
        const showInfo = nickname === userInfo.userNickName;

        return (
            <div className="streamingContainer">
                {this.props.streamManager !== undefined ? (
                    <div className="streamingComponent">
                        <OpenViduVideoComponent streamManager={this.props.streamManager} />
                        <video
                            ref={this.videoElement}
                            style={{ display: 'none' }}
                        />
                        {showInfo && (
                            <div className='streamInfoContainer'>
                                <p className='streamInfoName'>{nickname}</p>
                                <p className='streamInfoTime'>{this.formatTime(this.state.timer)}</p>
                                <p className='handDetectionStatus'>
                                    {this.state.handDetected ? '타이머 작동 중' : '정지'}
                                </p>
                            </div>
                        )}
                        {!showInfo && (
                            <div className='streamInfoContainer'>
                                <p className='streamInfoName'>{nickname}</p>
                            </div>
                        )}
                    </div>
                ) : null}
            </div>
        );
    }
}
