import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useInfoStore from "./infos";
import useRoomStore from "./OpenVidu";
import Notiflix from "notiflix";
import { data } from "@tensorflow/tfjs";

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
          Notiflix.Notify.failure("방 정보를 가져오는 데 실패했소ㅜㅜ");
        }
      },
      setNavigate: (navigate) => set({ navigate }),

      // 네비게이션바 버튼 함수
      // 채팅창 열기 함수
      showChat: true,
      toggleChat: () =>
        set((state) => {
          const newState = !state.showChat;
          return { showChat: newState };
        }),
      // 플랜 리스트창 열기 함수
      showList: true,
      toggleList: () =>
        set((state) => {
          const newState = !state.showList;
          return { showList: newState };
        }),
      // 랭킹창 열기 함수
      showLank: true,
      toggleLank: () =>
        set((state) => {
          const newState = !state.showLank;
          return { showLank: newState };
        }),

      // 뒤로가기 함수
      goStudyBack: async () => {
        const studyStore = useStudyStore.getState();
        const { navigate } = useStudyStore.getState();
        if (navigate) {
          try {
            await studyStore.exitRoom(); // API 호출이 끝날 때까지 기다림
            navigate("/study"); // 이전 페이지로 리다이렉트
            window.location.reload(); // 새로고침
            setTimeout(() => {}, 1); // 50ms 후에 새로고침 실행
          } catch (error) {
            // 오류 처리 로직 추가 가능
          }
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
          } else {
            set({ recentRoom: null });
          }
        } catch (error) {
          set({ recentRoom: null });
        }
      },

      // 방 입장 시 정보
      logId: 0,
      rankInfo: [],
      myStudyTime: 0,
      myStudyTimeSec: 0,
      setMyStudyTimeSec: (data) => set({ myStudyTimeSec: data }),
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

            const { logId, rankDto, roomStudyTime } = data;

            // 상태 업데이트
            const studyStore = useStudyStore.getState();
            studyStore.setLogId(logId);
            studyStore.setMyStudyTime(roomStudyTime);
            studyStore.setMyStudyTimeSec(roomStudyTime * 60);
            studyStore.setRankInfo(rankDto);

            return response.status; // 성공 시 상태 코드 반환
          } else {
            window.location.href = "/study";
            return response.status; // 응답 코드 오류 시 상태 코드 반환
          }
        } catch (error) {
          if (error.response) {
            // 서버가 상태 코드를 응답했을 때
            switch (error.response.status) {
              case 400:
                break;
              case 500:
                break;
              default:
            }
            return error.response.status; // 오류 응답 시 상태 코드 반환
          } else if (error.request) {
            return null; // 네트워크 오류 시 상태 코드 반환 없음
          } else {
            // 다른 오류
            return null; // 기타 오류 시 상태 코드 반환 없음
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
          set({ roomDetailInfo: response.data });
        } catch (error) {
          Notiflix.Notify.failure("방 상세 정보를 불러오지 못했소...");
        }
      },

      // 리스트 랭킹 정보 업데이트
      yesterdayRankInfo: [],
      fetchYesterdayRankInfo: async () => {
        const { token } = useInfoStore.getState();

        try {
          const response = await axios.get(API_URL + `room/rank`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          set({ yesterdayRankInfo: response.data });
        } catch (error) {
          Notiflix.Notify.failure("랭킹 정보를 불러오지 못했소...");
        }
      },

      // 방 퇴장 함수
      exitRoom: async () => {
        const studyStore = useStudyStore.getState();

        const logId = studyStore.logId;
        const myStudyTime = studyStore.myStudyTime;
        const myStudyTimeSec = studyStore.myStudyTimeSec;

        const { token } = useInfoStore.getState(); // userNickName을 가져옵니다.
        const data = {
          logId: logId,
          studyTime: myStudyTimeSec / 60 - myStudyTime,
          token: "",
        };

        try {
          const response = await axios.patch(`${API_URL}roomLog/exit`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            // 상태 업데이트(초기화)
            studyStore.setLogId(0);
            studyStore.setRankInfo([]);
            studyStore.setMyStudyTime(0);
            studyStore.setMyStudyTimeSec(0);
          } else {
            Notiflix.Notify.failure("정상적으로 퇴장이 이뤄지지 못했소...");
          }
        } catch (error) {
          if (error.response) {
            // 서버가 상태 코드를 응답했을 때
            switch (error.response.status) {
              case 400:
                break;
              case 500:
                break;
              default:
            }
          } else if (error.request) {
            // 요청이 전송되었으나 응답을 받지 못했을 때
          } else {
            // 다른 오류
          }
        }
      },

      // 방 점수 갱신 함수
      updateStudyTime: async () => {
        const studyStore = useStudyStore.getState();

        const logId = studyStore.logId;
        const myStudyTime = studyStore.myStudyTime;
        const myStudyTimeSec = studyStore.myStudyTimeSec;

        const { token } = useInfoStore.getState(); // userNickName을 가져옵니다.
        const data = {
          logId: logId,
          studyTime: myStudyTimeSec / 60 - myStudyTime,
          token: "",
        };

        try {
          const response = await axios.patch(`${API_URL}roomLog/record`, data, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            Notiflix.Notify.success("방 시간 갱신에 성공했소!");

            const data = response.data;
            const { rankDto } = data;

            studyStore.setRankInfo(rankDto);
          } else {
            Notiflix.Notify.failure("방 시간 갱신에 실패했소...");
          }
        } catch (error) {
          Notiflix.Notify.failure("방 시간 갱신에 실패했소...");
          if (error.response) {
            // 서버가 상태 코드를 응답했을 때
            switch (error.response.status) {
              case 400:
                break;
              case 500:
                break;
              default:
            }
          } else if (error.request) {
            // // 요청이 전송되었으나 응답을 받지 못했을 때
          } else {
            // 다른 오류
          }
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
