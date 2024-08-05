import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useInfoStore from "./infos";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

// 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getCurrentDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const usePlanStore = create(
  persist(
    (set) => ({
      today: getCurrentDate(),
      date: getCurrentDate(),
      plans: [],
      subPlans: [],
      todayPlans: [],
      subCode: 0,
      setSubPlans: (subPlans) => set({ subPlans: subPlans }),
      filterPlansBySubCode: (subCode) =>
        set((state) => ({
          subPlans: state.plans.filter(
            (plan) => plan.subCode === parseInt(subCode, 10)
          ),
          subCode: parseInt(subCode, 10),
        })),
      updateSubPlanStatus: (planId) => {
        set((state) => ({
          subPlans: state.subPlans.map((plan) =>
            plan.planId === planId
              ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
              : plan
          ),
        }));
      },
      updateTodayPlanStatus: (planId) => {
        set((state) => ({
          subPlans: state.subPlans.map((plan) =>
            plan.planId === planId
              ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
              : plan
          ),
        }));
      },
      createPlannerUrl: API_URL + "planner/create",
      modifyPlannerUrl: (planId) => API_URL + `planner/${planId}`,
      deletePlannerUrl: (planId) => API_URL + `planner/${planId}`, // DELETE URL 추가
      updatePlanStatus: (planId) => {
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.planId === planId
              ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
              : plan
          ),
        }));
      },
      saveDate: (day) => set({ date: day }),
      getTodayPlanRequest: async (date) => {
        const { token } = useInfoStore.getState();
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        try {
          const response = await axios.get(API_URL + "planner/list/day", {
            params: { date },
            headers,
          });
          if (response.status === 200) {
            set({ todayPlans: response.data ?? [] });
            return true;
          } else {
            throw new Error("정보불러오기 에러");
          }
        } catch (e) {
          console.log(e);
          return false;
        }
      },
      getDatePlanRequest: async (date) => {
        const { token } = useInfoStore.getState();
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        try {
          const response = await axios.get(API_URL + "planner/list/day", {
            params: { date },
            headers,
          });
          if (response.status === 200) {
            set({ plans: response.data ?? [] });
            return true;
          } else {
            throw new Error("정보불러오기 에러");
          }
        } catch (e) {
          console.log(e);
          return false;
        }
      },
      deletePlan: async (planId) => {
        const { token } = useInfoStore.getState();
        console.log("Deleting plan with ID:", planId); // 로그 추가
        console.log("Authorization token:", token); // 로그 추가
        try {
          const response = await axios.delete(API_URL + `planner/${planId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Response status:", response.status); // 로그 추가

          if (response.status === 200) {
            // 상태 코드 200으로 수정
            set((state) => ({
              plans: state.plans.filter((plan) => plan.planId !== planId),
            }));
            return true;
          } else {
            console.error(
              "플래너 삭제에 실패했습니다. 서버 응답 코드:",
              response.status
            );
            return false;
          }
        } catch (error) {
          console.error("플래너 삭제 중 오류가 발생했습니다:", error);
          return false;
        }
      },
    }),
    {
      name: "plan-storage",
    }
  )
);

export default usePlanStore;
