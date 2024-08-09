import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useInfoStore from "./infos";
import useRoomStore from "./OpenVidu";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useStudyStore = create(
  persist(
    (set, get) => ({
      studyRoomData: {},
      rooms: [],
      recentRoom: null,

      setStudyRoomData: (data) => set({ studyRoomData: data }),

      submitStudyRoomData: async () => {
        const { token } = useInfoStore.getState();

        try {
          const { studyRoomData } = get();
          const formData = new FormData();
          formData.append("roomTitle", studyRoomData.roomTitle);
          formData.append("roomMaxPerson", studyRoomData.roomMaxPerson);
          formData.append("roomEndDate", studyRoomData.roomEndDate);
          formData.append("roomContent", studyRoomData.roomContent);
          if (studyRoomData.roomThumb) {
            formData.append("roomThumb", studyRoomData.roomThumb);
          }

          await axios.post(API_URL + `room/create`, formData, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          });
          return true;
        } catch (error) {
          console.error("에러가 발생했습니다:", error);
          return false;
        }
      },

      fetchRooms: async () => {
        const { token } = useInfoStore.getState();

        try {
          const response = await axios.get(API_URL + `room/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const rooms = response.data.map((room) => ({
            id: room.id,
            title: room.roomTitle,
            thumb: room.roomThumb,
            maxPerson: room.roomMaxPerson,
            nowPerson: room.roomNowPerson,
          }));
          set({ rooms });
        } catch (error) {
          console.error("방 정보를 가져오는 데 실패했습니다.", error);
        }
      },
      setNavigate: (navigate) => set({ navigate }),

      // 네비게이션바 버튼 함수
      // 채팅창 열기 함수
      showChat: false,
      toggleChat: () =>
        set((state) => {
          const newState = !state.showChat;
          return { showChat: newState };
        }),
      // 플랜 리스트창 열기 함수
      showList: false,
      toggleList: () =>
        set((state) => {
          const newState = !state.showList;
          return { showList: newState };
        }),
      // 랭킹창 열기 함수
      showLank: false,
      toggleLank: () =>
        set((state) => {
          const newState = !state.showLank;
          return { showLank: newState };
        }),

      // 뒤로가기 함수
      goStudyBack: () => {
        const { navigate } = useStudyStore.getState();
        if (navigate) {
          navigate("/study"); // 이전 페이지로 리다이렉트
          window.location.reload(); // 새로고침
          setTimeout(() => {}, 50); // 100ms 후에 새로고침 실행
        }
      },

      // 사이드바 버튼 함수
      // bgm 켜기/끄기 함수
      bgmOn: false,
      setBgm: () =>
        set((state) => {
          const newState = !state.bgmOn;
          return { bgmOn: newState };
        }),
      fetchRecentRoom: async () => {
        const { token } = useInfoStore.getState(); // 토큰은 여전히 useInfoStore에서 가져옵니다.

        try {
          const response = await axios.get(API_URL + `room/recent`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (Array.isArray(response.data) && response.data.length > 0) {
            // 첫 번째 항목을 recentRoom으로 설정
            set({ recentRoom: response.data[0] });
            console.log("가장 최근 방이 업데이트되었습니다:", response.data[0]);
          } else {
            console.log("최근 방이 없습니다.");
            set({ recentRoom: null });
          }
        } catch (error) {
          console.error("방 정보를 가져오는 데 실패했습니다.", error);
          set({ recentRoom: null });
        }
      },

      // 방 입장 시 정보
      logId: 0,
      rankInfo: [],
      myStudyTime: 0,
      setLogId: (data) => set({ logId: data }),
      setRankInfo: (data) => set({ rankInfo: data }),
      setMyStudyTime: (data) => set({ myStudyTime: data }),

      // 방 입장 함수
      registerRoom: async (rId) => {
        const { token } = useInfoStore.getState(); // userNickName을 가져옵니다.
      
        try {
          const response = await axios.post(
            `${API_URL}roomLog/enter/${rId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
      
          if (response.status === 200) {
            const data = response.data;
            console.log("방 입장 성공", data);
      
            const { logId, studyTime, rankDto } = data;
      
            // 상태 업데이트
            const studyStore = useStudyStore.getState();
            studyStore.setLogId(logId);
            studyStore.setMyStudyTime(studyTime);
            studyStore.setRankInfo(rankDto);
      
          } else {
            console.error(`응답 코드 오류: ${response.status}`);
          }
        } catch (error) {
          if (error.response) {
            // 서버가 상태 코드를 응답했을 때
            switch (error.response.status) {
              case 400:
                console.error(
                  "잘못된 요청입니다. 요청을 확인해 주세요.",
                  error.response.data
                );
                break;
              case 500:
                console.error(
                  "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
                  error.response.data
                );
                break;
              default:
                console.error(
                  `알 수 없는 오류가 발생했습니다. 상태 코드: ${error.response.status}`,
                  error.response.data
                );
            }
          } else if (error.request) {
            // 요청이 전송되었으나 응답을 받지 못했을 때
            console.error(
              "응답을 받지 못했습니다. 네트워크를 확인해 주세요.",
              error.request
            );
          } else {
            // 다른 오류
            console.error("요청 중 오류가 발생했습니다.", error.message);
          }
        }
      },

      // 방 상세 정보 조회
      roomDetailInfo: {},
      fetchRoomDetailInfo: async (roomId) => {
        const { token } = useInfoStore.getState();

        try {
          const response = await axios.get(API_URL + `room/${roomId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
          set({ roomDetailInfo: response.data });
        } catch (error) {
          console.log(error);
        }
      },
    }),
    {
      name: "study-storage",
      partialize: (state) => ({
        studyRoomData: state.studyRoomData,
        rooms: state.rooms,
        recentRoom: state.recentRoom,
        logId: state.logId,
        rankInfo: state.rankInfo,
        setMyStudyTime: state.setMyStudyTime,
      }),
    }
  )
);

export default useStudyStore;
