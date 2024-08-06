import { create } from 'zustand';
import { OpenVidu } from 'openvidu-browser';
import axios from 'axios';

const OPENVIDU_SERVER_URL = 'http://localhost:8080/studycow';
const OPENVIDU_SERVER_SECRET = 'MY_SECRET';

// zustand 스토어 생성
const useTestStore = create((set, get) => ({
    OV: new OpenVidu(), // OpenVidu 객체를 스토어에 추가
    mySessionId: '1',
    myUserName: 'Participant' + Math.floor(Math.random() * 100),
    session: undefined,
    mainStreamManager: undefined,
    publisher: undefined,
    subscribers: [],
    setSession: (session) => set({ session }),
    setMainStreamManager: (mainStreamManager) => set({ mainStreamManager }),
    setPublisher: (publisher) => set({ publisher }),
    addSubscriber: (subscriber) => set((state) => ({ subscribers: [...state.subscribers, subscriber] })),
    removeSubscriber: (streamManager) => set((state) => ({
        subscribers: state.subscribers.filter(sub => sub !== streamManager)
    })),
    initSession: async (sessionId) => {
        set({ mySessionId: sessionId }); // sessionId를 업데이트
        const OV = new OpenVidu();
        const session = OV.initSession();

        session.on('streamCreated', (event) => {
            const subscriber = session.subscribe(event.stream, undefined);
            const { subscribers } = get();
            set({ subscribers: [...subscribers, subscriber] });
        });

        session.on('streamDestroyed', (event) => {
            event.preventDefault();
            const { removeSubscriber } = get();
            removeSubscriber(event.stream.streamManager);
        });

        session.on('exception', (exception) => {
            console.warn(exception);
        });

        const token = await get().getToken(sessionId); // 토큰을 가져옵니다.
        await session.connect(token, { clientData: get().myUserName });

        set({ OV, session });
    },
    getToken: async (sessionId) => {
        try {
            const response = await axios.post(
                `${OPENVIDU_SERVER_URL}/openvidu/connect/${sessionId}`,
                {}, // 세션 생성 요청 시 빈 객체를 보냅니다.
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Basic ${btoa('OPENVIDUAPP:' + OPENVIDU_SERVER_SECRET)}`, // 인증 헤더 추가
                    },
                }
            );
            return response.data; // 토큰을 응답 데이터에서 반환합니다.
        } catch (error) {
            console.error('Error fetching token', error);
            throw error; // 오류가 발생하면 예외를 던집니다.
        }
    },
}));

export default useTestStore;
