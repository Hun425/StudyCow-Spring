import React, { useRef, useEffect } from 'react';
import { OpenVidu } from 'openvidu-browser';
import useTestStore from '../../../stores/test.js';
import UserVideoComponent from '../RoomCam/UserVideoComponent.jsx';




function Test() {
    const {
        mySessionId,
        myUserName,
        session,
        OV,
        subscribers,
        initSession,
    } = useTestStore();

    useEffect(() => {
        initSession(mySessionId);
    }, [initSession, mySessionId]);

    const handleMainVideoStream = (streamManager) => {
        // 메인 비디오 스트림을 처리하는 함수. 필요에 따라 구현하세요.
    };

	return (
        <div>
            <p>Session ID: {mySessionId}</p>
            <p>User Name: {myUserName}</p>
            <div className="row">
                {subscribers.map((sub, i) => (
                    <div key={i} className="stream-container col-md-6 col-xs-6">
                        <UserVideoComponent streamManager={sub} mainVideoStream={handleMainVideoStream} />
                    </div>
                ))}
            </div>
        </div>
	);
}

export default Test;
