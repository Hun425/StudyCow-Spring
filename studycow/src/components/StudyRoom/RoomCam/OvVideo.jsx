import React, { Component } from 'react';

export default class OpenViduVideoComponent extends Component {

    constructor(props) {
        super(props); // 컴포넌트 마운트 되기 전 this.props 사용하기 위해 호출
        this.videoRef = React.createRef(); // HTML video 요소를 가져옴
    }

    componentDidUpdate(props) {
        if (props && !!this.videoRef) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidMount() {
        if (this.props && !!this.videoRef) {
            // 컴포넌트 랜더링 후, HTML video 요소를 한번 수신함
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return <video autoPlay={true} ref={this.videoRef} />;
    }

}