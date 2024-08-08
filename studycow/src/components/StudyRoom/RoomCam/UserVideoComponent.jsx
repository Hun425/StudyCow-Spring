import React, { Component } from 'react';
import OpenViduVideoComponent from './OvVideo';
import './UserVideo.css';

export default class UserVideoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            timer: 0
        };
        this.timerInterval = null;
    }

    componentDidMount() {
        // 타이머 시작
        this.timerInterval = setInterval(() => {
            this.setState(prevState => ({
                timer: prevState.timer + 1
            }));
        }, 1000); // 1초마다 타이머 업데이트
    }

    componentWillUnmount() {
        // 컴포넌트가 언마운트 될 때 타이머 정리
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    getNicknameTag() {
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    render() {
        return (
            <div className="streamingContainer">
                {this.props.streamManager !== undefined ? (
                    <div className="streamingComponent">
                        <OpenViduVideoComponent streamManager={this.props.streamManager} />
                        <div className='streamInfoContainer'>
                            <p className='streamInfoName'>{this.getNicknameTag()}</p>
                            <p className='streamInfoTime'>{this.formatTime(this.state.timer)}</p>
                        </div>
                    </div>
                ) : null}
            </div>
        );
    }
}
