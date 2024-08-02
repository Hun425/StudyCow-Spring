// stores/scoreRegist.js

import { create } from "zustand";
import axios from "axios";
import useInfoStore from "./infos";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const useScoreStore = create((set) => ({
  score: {
    subCode: 0,
    testDate: "",
    testScore: 0,
    testGrade: 0,
    scoreDetails: [], // 수정: "scoreDetails"로 변경
  },
  // 점수 등록 데이터 업데이트
  updateScore: (field, value) =>
    set((state) => ({
      score: {
        ...state.score,
        [field]: value,
      },
    })),

  // 서버로 점수 데이터 전송
  submitScore: async () => {
    const { token } = useInfoStore.getState(); // 토큰 가져오기
    const { score } = useScoreStore.getState(); // 상태에서 score 가져오기

    // 데이터를 전송하기 전, 콘솔에 로그
    console.log("전송할 데이터:", JSON.stringify(score));

    try {
      const response = await axios.post(API_URL + "score/regist", score, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {
        alert("점수 등록에 성공했습니다.");
        // 상태 초기화 또는 추가 작업 수행
      } else {
        alert("점수 등록에 실패했습니다.");
      }
    } catch (error) {
      console.error("점수 등록 중 오류 발생:", error);
      alert("점수 등록 중 오류가 발생했습니다.");
    }
  },
}));

export default useScoreStore;
