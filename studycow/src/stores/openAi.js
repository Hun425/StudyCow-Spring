import { create } from "zustand";
import axios from "axios";
import useInfoStore from "./infos"; // 사용자 정보 스토어
import Notiflix from "notiflix";

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
        return response.data; // AI 플래너 데이터 반환
      } else {
        Notiflix.Notify.failure("플래너를 생성하지 못했소...");
        return null;
      }
    } catch (error) {
      Notiflix.Notify.failure("플래너를 생성하지 못했소...");
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
          Notiflix.Notify.failure("플래너를 등록하지 못했소...");
          return false;
        }
      }
      return true;
    } catch (error) {
      Notiflix.Notify.failure("플래너를 등록하지 못했소...");
      return false;
    }
  },

  generateAdvice: async (adviceData) => {
    const { token } = useInfoStore.getState(); // 사용자 토큰 가져오기

    try {
      const response = await axios.post(
        `${API_URL}openai/advice-score`,
        adviceData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        return response.data; // 생성된 조언 데이터 반환
      } else {
        Notiflix.Notify.failure("성적 조언을 생성하지 못했소...");
        return null;
      }
    } catch (error) {
      Notiflix.Notify.failure("성적 조언을 생성하지 못했소...");
      return null;
    }
  },
}));

export default useOpenAiStore;
