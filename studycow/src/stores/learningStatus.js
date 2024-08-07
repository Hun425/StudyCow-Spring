import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useInfoStore from "./infos";
import useGradeStore from "./grade"; // grade.js에서 상태 가져오기

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

// Zustand 스토어 생성
const LearningStatusStore = create(
  persist(
    (set) => ({
      subjectInfo: null, // 과목 정보를 저장할 상태
      error: null, // 오류 메시지를 저장할 상태

      // 과목 정보를 가져오는 함수
      fetchSubjectInfo: async (limit = 5) => {
        const { token, userInfo } = useInfoStore.getState();
        const userId = userInfo.userId;

        // grade.js에서 selectedSubject 가져오기
        const { selectedSubject } = useGradeStore.getState();

        if (!token || !userId) {
          console.error("사용자 인증 정보가 없습니다.");
          set({ error: "로그인이 필요합니다." });
          return;
        }

        if (!selectedSubject) {
          console.error("선택된 과목이 없습니다.");
          set({ error: "과목을 선택하세요." });
          return;
        }

        // 요청 헤더 설정
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // URL 구성
        const url = `${API_URL}score/${userId}/list/${selectedSubject}`;

        try {
          // GET 요청을 통해 과목 데이터 가져오기
          const response = await axios.get(url, {
            headers,
            // params: { limit },
            // 위의 params에 리미트 값으로 과목 코드를 가져오는 원인 미상의 버그가 발생
          });

          // 요청이 성공하면 데이터를 상태로 설정
          if (response.status === 200) {
            set({ subjectInfo: response.data, error: null });
            console.log("과목 데이터 조회 성공:", response.data);
          } else {
            // 요청 실패 시 오류 메시지 설정
            set({ error: "정보 불러오기 에러" });
          }
        } catch (error) {
          console.error("API 요청 중 오류 발생:", error);
          set({ error: "API 요청 중 오류 발생" });
        }
      },

      // 상태 초기화 함수
      clearSubjectInfo: () => set({ subjectInfo: null, error: null }),
    }),
    {
      name: "learning-status-storage",
    }
  )
);

export default LearningStatusStore;
