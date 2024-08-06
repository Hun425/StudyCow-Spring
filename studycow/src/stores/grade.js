import { create } from "zustand";
import useInfoStore from "./infos";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useGradeStore = create((set) => ({
  selectedSubject: "", // ""이 아닌 null, 0을 사용할 경우 기본값('과목 선택')이 제대로 작동하지 않음
  subjectGrades: {}, // 변환된 데이터를 저장할 상태 변수

  // 선택된 과목을 설정하고, subjectGrades를 초기화하는 함수
  setSelectedSubject: (subject) =>
    set({
      selectedSubject: subject,
      subjectGrades: {}, // 선택된 과목이 바뀌면 subjectGrades 초기화
    }),

  // 성적 데이터를 가져와서 subjectGrades를 업데이트하는 함수
  fetchSelectedSubjectGrade: async (userId, subCode) => {
    const { token } = useInfoStore.getState(); // 토큰 가져오기

    try {
      const response = await axios.get(
        API_URL + `score/${userId}/list/${subCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 인증 헤더 추가
          },
        }
      );

      // 응답 데이터를 변환하여 {testDate: testScore} 형식으로 저장
      const grades = response.data.scores.reduce((acc, score) => {
        acc[score.testDate] = score.testScore;
        return acc;
      }, {});

      set({ subjectGrades: grades }); // 변환된 데이터를 상태에 저장

      console.log("성적 불러오기 성공:", grades); // 성공 로그 출력
    } catch (error) {
      console.error("성적 불러오기 실패:", error); // 에러 로그 출력
    }
  },
}));

export default useGradeStore;
