// StudyStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useInfoStore from "./infos";
import usePlanStore from "./plan";

const API_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";




const useStudyStore = create(
  persist(
    (set) => ({
      token: useInfoStore.getState(),
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
        showList: false,
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
        goStudyBack: () => {  
        const { navigate } = useStudyStore.getState();
          if (navigate) {
            navigate('/study');
          }
        },
    // 사이드바 버튼 함수
        // 캠 켜기/끄기 함수
        showCam: false,
        setCam: () =>
          set((state) => {
            const newState = !state.showCam;
            return { showCam: newState };
          }),
        // 소리 켜기/끄기 함수
        soundOn: false,
        setSound: () =>
          set((state) => {
            const newState = !state.soundOn;
            return { soundOn: newState };
          }),
        // 마이크 켜기/끄기 함수
        micOn: false,
        setMic: () =>
          set((state) => {
            const newState = !state.micOn;
            return { micOn: newState };
          }),
          // bgm 켜기/끄기 함수
        bgmOn: false,
        setBgm: () =>
          set((state) => {
            const newState = !state.bgmOn;
            return { bgmOn: newState };
          }),
      
    }),
    {
      name: "study-storage",
    }
  )
);

export default useStudyStore;
