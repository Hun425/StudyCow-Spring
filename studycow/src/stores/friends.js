import { create } from "zustand";
import axios from "axios";
import useInfoStore from "./infos";
import defaultProfile from "../assets/defaultProfile.png";
import Notiflix from "notiflix";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useFriendsStore = create((set, get) => ({
  friends: [],
  getRequests: [],
  sendRequests: [],
  searchedNickname: "",
  searchedFriends: [],
  fetchFriends: async () => {
    const { token } = useInfoStore.getState();

    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    try {
      const response = await axios.get(API_URL + "friend/list", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const friendsData = response.data.map((friend) => ({
        ...friend,
        friendThumb: friend.friendThumb ?? defaultProfile,
      }));

      set({ friends: friendsData });
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  },

  removeFriend: async (userId) => {
    const { token } = useInfoStore.getState();

    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    try {
      await axios.delete(API_URL + `friend/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        friends: state.friends.filter(
          (friend) => friend.friendUserId !== userId
        ),
      }));
      Notiflix.Notify.success("해당 친구를 삭제했소...");
    } catch (error) {
      Notiflix.Notify.failure("친구 삭제에 실패했소...");
    }
  },

  fetchGetRequests: async () => {
    const { token } = useInfoStore.getState();

    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    try {
      const response = await axios.get(API_URL + `friend/request/received`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const getRequestsData = response.data.map((getRequest) => ({
        ...getRequest,
        counterpartUserThumb: getRequest.counterpartUserThumb ?? defaultProfile,
      }));

      set({ getRequests: getRequestsData });
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  },

  acceptGetRequest: async (friendRequestId) => {
    const { token } = useInfoStore.getState();

    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    try {
      // POST 요청을 보내는 axios 호출
      await axios.post(
        API_URL + `friend/accept/${friendRequestId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      set((state) => ({
        getRequests: state.getRequests.filter(
          (getRequest) => getRequest.id !== friendRequestId
        ),
      }));
      // 요청 성공 시 추가 작업 (예: 사용자에게 알림, 상태 업데이트 등)
      Notiflix.Notify.success("친구 요청을 수락했소!");
      await useFriendsStore.getState().fetchFriends();
    } catch (error) {
      // 오류 발생 시 에러 메시지 표시
      console.error("친구 요청 수락 실패:", error);
      Notiflix.Notify.failure("친구 요청 수락에 실패했소...");
    }
  },

  fetchSendRequests: async () => {
    const { token } = useInfoStore.getState();

    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    try {
      const response = await axios.get(API_URL + `friend/request/sent`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const sendRequestsData = response.data.map((sendRequest) => ({
        ...sendRequest,
        counterpartUserThumb:
          sendRequest.counterpartUserThumb ?? defaultProfile,
      }));

      set({ sendRequests: sendRequestsData });
    } catch (error) {
      console.error("API 요청 실패:", error);
    }
  },

  cancelSendRequest: async (requestId) => {
    const { token } = useInfoStore.getState();

    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    try {
      await axios.delete(API_URL + `friend/request/cancel/${requestId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      set((state) => ({
        sendRequests: state.sendRequests.filter(
          (sendRequest) => sendRequest.id !== requestId
        ),
      }));
      Notiflix.Notify.success("친구 요청을 취소했소!");
    } catch (error) {
      console.error("친구 요청 취소 실패:", error);
      Notiflix.Notify.failure("친구 요청 취소에 실패했소...");
    }
  },

  setSearchedNickname: (searchedNickname) => set({ searchedNickname }),

  fetchSearchedFriends: async (searchedNickname) => {
    const { token, userInfo } = useInfoStore.getState();
    const { friends } = get();

    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    try {
      const response = await axios.get(API_URL + `user/nickname`, {
        params: { nickname: searchedNickname },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // 검색 결과에서 자기 자신과 이미 친구로 등록된 사용자를 제외
      const filteredFriends = response.data.filter(
        (friend) =>
          friend.userNickName !== userInfo.userNickName &&
          !friends.some((f) => f.friendUserId === friend.userId)
      );

      set({ searchedFriends: filteredFriends });
    } catch (error) {
      console.error("검색 결과 불러오기 실패:", error);
      set({ searchedFriends: [] });
    }
  },

  sendFriendRequest: async (toUserId) => {
    const { token } = useInfoStore.getState();
    const { friends, sendRequests } = get();

    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    // 이미 추가된 친구인지 확인
    if (friends.some((friend) => friend.friendUserId === toUserId)) {
      Notiflix.Notify.failure("이미 친구로 등록되어있지 않소?");
      return;
    }

    // 이미 친구 요청을 보냈는지 확인
    if (
      sendRequests.some(
        (sendRequest) => sendRequest.counterpartUserId === toUserId
      )
    ) {
      Notiflix.Notify.failure("이미 친구 요청을 보냈소!");
      return;
    }

    try {
      await axios.post(
        API_URL + `friend/request`,
        { toUserId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // 보낸 친구 요청 목록 갱신
      await useFriendsStore.getState().fetchSendRequests();
      Notiflix.Notify.success("친구 요청을 보냈소!");
    } catch (error) {
      console.error("친구 요청 실패:", error);
      Notiflix.Notify.failure("친구 요청이 실패했소...");
    }
  },

  friendInfo: {},

  // 친구 정보 조회
  fetchFriendInfo: async (userId) => {
    const { token } = useInfoStore.getState();

    // 토큰 유효성 검사
    if (!token) {
      Notiflix.Notify.failure("제대로 로그인이 되었는지 확인해보소!");
      return;
    }

    try {
      // API 요청 보내기
      const response = await axios.get(API_URL + `user/me`, {
        params: { id: userId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // 응답 데이터를 상태에 저장
      set({ friendInfo: response.data });
    } catch (error) {
      // 에러 처리
      console.error("친구 정보 조회 중 오류 발생:", error);
      if (error.response) {
        console.error("서버 응답 내용:", error.response.data);
      }
    }
  },
}));

export default useFriendsStore;
