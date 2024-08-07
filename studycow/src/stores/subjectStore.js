import create from "zustand";
import axios from "axios";

// API URL 설정
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

// Zustand 스토어 생성
const useSubjectStore = create((set) => ({
  subjects: [], // 과목 목록 저장
  problemTypes: [], // 문제 유형 목록 저장
  error: null, // 오류 메시지 저장

  // 과목 정보 가져오기
  fetchSubjects: async () => {
    try {
      const response = await axios.get(`${API_URL}common/subject`);
      set({ subjects: response.data });
    } catch (error) {
      console.error("Failed to fetch subjects:", error);
      set({ error: "과목 정보를 가져오는 데 실패했습니다." });
    }
  },

  // 세부 과목 정보 가져오기
  fetchProblemTypes: async (subCode) => {
    try {
      const response = await axios.get(`${API_URL}common/subject/${subCode}`);
      set({ problemTypes: response.data });
    } catch (error) {
      console.error("Failed to fetch problem types:", error);
      set({ error: "문제 유형 정보를 가져오는 데 실패했습니다." });
    }
  },
}));

export default useSubjectStore;
