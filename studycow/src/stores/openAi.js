// openAi.js

import { create } from "zustand";
import axios from "axios";
import useInfoStore from "./infos"; // 사용자 정보 스토어

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useOpenAiStore = create((set) => ({
  generatePlanner: async (startDay, studyTime) => {
    const { token } = useInfoStore.getState(); // 사용자 토큰 가져오기

    try {
      const response = await axios.get(`${API_URL}openai/auto-planner`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDay,
          studyTime,
        },
      });

      if (response.status === 200) {
        console.log("플래너가 성공적으로 생성되었습니다.", response.data);
        return response.data; // AI 플래너 데이터 반환
      } else {
        console.error("플래너 생성에 실패했습니다.");
        return null;
      }
    } catch (error) {
      console.error("플래너 생성 중 오류가 발생했습니다:", error);
      return null;
    }
  },

  registerPlans: async (plans) => {
    const { token } = useInfoStore.getState(); // 사용자 토큰 가져오기

    try {
      for (let plan of plans) {
        const response = await axios.post(`${API_URL}planner/create`, plan, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (response.status !== 201) {
          console.error("플래너 등록에 실패했습니다:", response);
          return false;
        }
      }
      console.log("모든 플래너가 성공적으로 등록되었습니다.");
      return true;
    } catch (error) {
      console.error("플래너 등록 중 오류가 발생했습니다:", error);
      return false;
    }
  },
}));

export default useOpenAiStore;
