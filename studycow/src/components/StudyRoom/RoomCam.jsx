import React, { useState, useEffect, useCallback } from 'react';
import {
	OpenVidu,
	Session as OVSession,
	Publisher,
	Subscriber,
} from 'openvidu-browser';
import axios from 'axios';
import Form from './RoomCam/Form';
import Session from './RoomCam/Session';

const roomId = '1';

function RoomCam() {
	const [session, setSession] = useState('');
	const [sessionId, setSessionId] = useState('');
	const [subscriber, setSubscriber] = useState(null);
	const [publisher, setPublisher] = useState(null);
	const [OV, setOV] = useState(null);

	const OPENVIDU_SERVER_URL = `http://localhost:8080/studycow`;
	const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

	const leaveSession = useCallback(() => {
		if (session) session.disconnect();

		setOV(null);
		setSession('');
		setSessionId('');
		setSubscriber(null);
		setPublisher(null);
	}, [session]);

	const joinSession = () => {
		const OVs = new OpenVidu();
		setOV(OVs);
		setSession(OVs.initSession());
	};

	useEffect(() => {
		window.addEventListener('beforeunload', leaveSession);

		return () => {
			window.removeEventListener('beforeunload', leaveSession);
		};
	}, [leaveSession]);

	const sessionIdChangeHandler = (event) => {
		setSessionId(event.target.value);
	};

	useEffect(() => {
		if (session === '') return;

		session.on('streamDestroyed', (event) => {
			if (subscriber && event.stream.streamId === subscriber.stream.streamId) {
				setSubscriber(null);
			}
		});
	}, [subscriber, session]);

	useEffect(() => {
		if (session === '') return;

		session.on('streamCreated', (event) => {
			const subscribers = session.subscribe(event.stream, '');
			setSubscriber(subscribers);
		});

		const createSession = async (sessionIds) => {
			try {
				const data = JSON.stringify({ customSessionId: sessionIds });
				const response = await axios.post(
					`${OPENVIDU_SERVER_URL}/openvidu/connect/`+roomId,
					data,
					{
						headers: {
							Authorization: `Basic ${btoa(
								`OPENVIDUAPP:${OPENVIDU_SERVER_SECRET}`
							)}`,
							'Content-Type': 'application/json',
						},
					}
				);
        console.log(response.data)

				return response.data;
			} catch (error) {
				if (error.response?.status === 409) {
					return sessionIds;
				}

				return '';
			}
		};

		const getToken = async () => {
			try {
				const token = await createSession(sessionId);
				return token;
			} catch (error) {
				throw new Error('Failed to get token.');
			}
		};

		getToken()
			.then((token) => {
				session
					.connect(token)
					.then(() => {
						if (OV) {
							const publishers = OV.initPublisher(undefined, {
								audioSource: undefined,
								videoSource: undefined,
								publishAudio: true,
								publishVideo: true,
								mirror: true,
							});

							setPublisher(publishers);
							session
								.publish(publishers)
								.then(() => {})
								.catch((e) => {console.log(e)});
						}
					})
					.catch((e) => {console.log(e)});
			})
			.catch((e) => {console.log(e)});
	}, [session, OV, sessionId, OPENVIDU_SERVER_URL]);

	return (
		<div>
			<h1>진행화면</h1>
			<>
				{!session && (
					<Form
						joinSession={joinSession}
						sessionId={sessionId}
						sessionIdChangeHandler={sessionIdChangeHandler}
					/>
				)}
				{session && (
					<Session
						publisher={publisher}
						subscriber={subscriber}
					/>
				)}
			</>
		</div>
	);
}

export default RoomCam;
