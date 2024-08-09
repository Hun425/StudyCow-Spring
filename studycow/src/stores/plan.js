import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import useInfoStore from "./infos";

// API URL 설정
const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

// 현재 날짜를 YYYY-MM-DD 형식으로 반환하는 함수
const getCurrentDate = () => {
  const today = new Date();
  const options = { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' };
  const formatter = new Intl.DateTimeFormat('ko-KR', options);
  const parts = formatter.formatToParts(today);
  
  const year = parts.find(part => part.type === 'year').value;
  const month = parts.find(part => part.type === 'month').value;
  const day = parts.find(part => part.type === 'day').value;

  return `${year}-${month}-${day}`;
};

const usePlanStore = create(
  persist(
    (set, get) => ({
      today: getCurrentDate(),
      date: getCurrentDate(),
      plans: [],
      subPlans: [],
      todayPlans: [],
      subCode: 0,

      setPlans: (plans) => {
        if (!Array.isArray(plans)) {
          console.error("plans is not an array:", plans);
          plans = [];
        }
        set({ plans });
      },
      setSubPlans: (subPlans) => set({ subPlans }),

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
          plans: state.plans.map((plan) =>
            plan.planId === planId
              ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
              : plan
          ),
        }));
      },

      updateTodayPlanStatus: (planId) => {
        set((state) => ({
          todayPlans: state.todayPlans.map((plan) =>
            plan.planId === planId
              ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
              : plan
          ),
          plans: state.plans.map((plan) =>
            plan.planId === planId
              ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
              : plan
          ),
        }));
      },

      createPlannerUrl: API_URL + "planner/create",
      modifyPlannerUrl: (planId) => API_URL + `planner/${planId}`,
      deletePlannerUrl: (planId) => API_URL + `planner/${planId}`,

      updatePlanStatus: (planId) => {
        set((state) => ({
          plans: state.plans.map((plan) =>
            plan.planId === planId
              ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
              : plan
          ),
          subPlans: state.subPlans.map((plan) =>
            plan.planId === planId
              ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
              : plan
          ),
        }));
      },

      changePlanStatus: async (planId) => {
        const { token } = useInfoStore.getState();
        try {
          const response = await axios.post(
            API_URL + `planner/${planId}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          if (response.status === 200) {
            set((state) => ({
              plans: state.plans.map((plan) =>
                plan.planId === planId
                  ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
                  : plan
              ),
              subPlans: state.subPlans.map((plan) =>
                plan.planId === planId
                  ? { ...plan, planStatus: plan.planStatus === 0 ? 1 : 0 }
                  : plan
              ),
            }));
            return true;
          } else {
            console.error(
              "플래너 상태 변경에 실패했습니다. 서버 응답 코드:",
              response.status
            );
            return false;
          }
        } catch (error) {
          console.error("플래너 상태 변경 중 오류가 발생했습니다:", error);
          return false;
        }
      },

      saveDate: (day) => set({ date: day }),

      getTodayPlanRequest: async () => {
        const { today } = get();
        console.log("오늘은: "+today)
        const { token } = useInfoStore.getState();
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        try {
          const response = await axios.get(API_URL + "planner/list/day", {
            params: { date: today },
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
        console.log("Deleting plan with ID:", planId);
        console.log("Authorization token:", token);
        try {
          const response = await axios.delete(API_URL + `planner/${planId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          console.log("Response status:", response.status);

          if (response.status === 200) {
            set((state) => ({
              plans: state.plans.filter((plan) => plan.planId !== planId),
              subPlans: state.subPlans.filter((plan) => plan.planId !== planId),
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
      name: "plan-storage", // 상태를 로컬 스토리지에 저장
    }
  )
);

export default usePlanStore;
