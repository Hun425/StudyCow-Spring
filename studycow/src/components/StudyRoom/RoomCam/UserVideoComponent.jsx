import React, { Component } from 'react';
import OpenViduVideoComponent from './OpenViduVideoComponent'; // OpenViduVideoComponent import

export default class UserVideoComponent extends Component {
    constructor(props) {
        super(props);
        this.handleVideoClicked = this.handleVideoClicked.bind(this);
    }

    getNicknameTag() {
        // 사용자 닉네임을 가져옵니다.
        return JSON.parse(this.props.streamManager.stream.connection.data).clientData;
    }

    handleVideoClicked(event) {
        // 부모 컴포넌트에게 클릭 이벤트를 전달하여 메인 비디오를 업데이트합니다.
        if (this.props.mainVideoStream) {
            this.props.mainVideoStream(this.props.streamManager);
        }
    }

    render() {
        return (
            <div className="streamcomponent" onClick={this.handleVideoClicked}>
                <OpenViduVideoComponent streamManager={this.props.streamManager} />
                <div>
                    <p>{this.getNicknameTag()}</p>
                </div>
            </div>
        );
    }
}
