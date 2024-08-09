import { create } from "zustand";
import axios from "axios";
import useInfoStore from "./infos";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useScoreChangeStore = create((set) => ({
  // 현재 상태
  scoreChangeStatus: null, // 상태 (성공, 실패, 로딩 등)

  // 플래너 정보를 수정하는 함수
  updatePlanner: async (planId, planData) => {
    const { token } = useInfoStore.getState(); // 인증 토큰 가져오기

    try {
      // 로딩 상태로 설정
      set({ scoreChangeStatus: "loading" });

      const response = await axios.patch(
        `${API_URL}planner/${planId}`,
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
        console.log("플래너 정보가 성공적으로 수정되었습니다.", response.data);
      } else {
        // 실패 상태로 설정
        set({ scoreChangeStatus: "error" });
        console.error("플래너 정보 수정에 실패했습니다.", response.status);
      }
    } catch (error) {
      // 오류 발생 상태로 설정
      set({ scoreChangeStatus: "error" });
      console.error("플래너 정보 수정 중 오류가 발생했습니다.", error);
    }
  },

  // 플래너 정보를 삭제하는 함수
  deletePlanner: async (planId) => {
    const { token } = useInfoStore.getState(); // 인증 토큰 가져오기

    try {
      // 로딩 상태로 설정
      set({ scoreChangeStatus: "loading" });

      const response = await axios.delete(`${API_URL}planner/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // 인증 헤더 설정
        },
      });

      if (response.status === 200) {
        // 성공 상태로 설정
        set({ scoreChangeStatus: "success" });
        console.log("플래너 정보가 성공적으로 삭제되었습니다.");
      } else {
        // 실패 상태로 설정
        set({ scoreChangeStatus: "error" });
        console.error("플래너 정보 삭제에 실패했습니다.", response.status);
      }
    } catch (error) {
      // 오류 발생 상태로 설정
      set({ scoreChangeStatus: "error" });
      console.error("플래너 정보 삭제 중 오류가 발생했습니다.", error);
    }
  },

  // 상태 초기화 함수 (필요에 따라 사용)
  resetStatus: () => set({ scoreChangeStatus: null }),
}));

export default useScoreChangeStore;
