import { create } from "zustand";
import axios from "axios";
import useInfoStore from "./infos";
import Notiflix from 'notiflix';
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useScoreChangeStore = create((set) => ({
  // 현재 상태
  scoreChangeStatus: null, // 상태 (성공, 실패, 로딩 등)

  // 성적 정보를 수정하는 함수
  updatePlanner: async (scoreId, planData) => {
    const { token } = useInfoStore.getState(); // 인증 토큰 가져오기

    try {
      // 로딩 상태로 설정
      set({ scoreChangeStatus: "loading" });

      const response = await axios.patch(
        `${API_URL}score/modify/${scoreId}`,
        planData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // 인증 헤더 설정
          },
        }
      );

      if (response.status === 200) {
        // 성공 상태로 설정
        set({ scoreChangeStatus: "success" });
        Notiflix.Notify.success("성적이 수정되었습니다.");
        
      } else {
        // 실패 상태로 설정
        Notiflix.Notify.failure("성적 수정 실패.");
        
      }
    } catch (error) {
      // 오류 발생 상태로 설정
      Notiflix.Notify.failure("성적 수정 실패.");
      
    }
  },

  // 성적 정보를 삭제하는 함수
  deletePlanner: async (scoreId) => {
    const { token } = useInfoStore.getState(); // 인증 토큰 가져오기

    try {
      // 로딩 상태로 설정
      set({ scoreChangeStatus: "loading" });

      const response = await axios.delete(`${API_URL}score/delete/${scoreId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 헤더 설정
        },
      });

      if (response.status === 200) {
        // 성공 상태로 설정
        set({ scoreChangeStatus: "success" });
        Notiflix.Notify.success("성적이 삭제되었습니다.");
      } else {
        // 실패 상태로 설정
        set({ scoreChangeStatus: "error" });
        Notiflix.Notify.failure("성적 삭제 실패.");
      }
    } catch (error) {
      // 오류 발생 상태로 설정
      set({ scoreChangeStatus: "error" });
      Notiflix.Notify.failure("성적 삭제 실패.");
    }
  },

  // 상태 초기화 함수 (필요에 따라 사용)
  resetStatus: () => set({ scoreChangeStatus: null }),
}));

export default useScoreChangeStore;
