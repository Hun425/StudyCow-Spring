import React, { useEffect, useRef } from 'react';

const OpenViduVideoComponent = ({ streamManager }) => {
    const videoRef = useRef();

    useEffect(() => {
        if (streamManager && !!videoRef) {
            streamManager.addVideoElement(videoRef.current);
        }
    }, [streamManager]);

    return <video autoPlay={true} ref={videoRef} />;
}

export default OpenViduVideoComponent;