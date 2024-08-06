import React, { Component } from 'react';

export default class OpenViduVideoComponent extends Component {
    constructor(props) {
        super(props);
        this.videoRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.streamManager && this.videoRef.current) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.streamManager !== prevProps.streamManager && this.videoRef.current) {
            this.props.streamManager.addVideoElement(this.videoRef.current);
        }
    }

    render() {
        return (
            <video autoPlay ref={this.videoRef} />
        );
    }
}
