import "./styles/MainGrassItem.css";
import { useEffect, useState } from "react";
import axios from "axios";
import useInfoStore from "../../stores/infos";
import GrassCreate from "./GrassCreate";

const API_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/studycow/";

const MainGrassItem = () => {
  const todayMonth = new Date().getMonth() + 1;
  const todayYear = new Date().getFullYear();
  const [thisMonthPlan, setThisMonthPlan] = useState([]);
  const { token } = useInfoStore.getState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          API_URL + `planner/grass/${todayYear}/${todayMonth}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const planData = response.data.reduce((acc, item) => {
          const day = item.planDate.split("-")[2]; // "2024-08-05"에서 일자 "05" 추출
          acc[day] = item.planCount;
          return acc;
        }, {});
        setThisMonthPlan(planData);
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    fetchData();
  }, [todayYear, todayMonth, token]);

  return (
    <div className="mainGrassContainer">
      <div className="charImgPart">
        <h1>캐릭터</h1>
      </div>
      <div className="createdGrass">
        <GrassCreate
          year={todayYear}
          month={todayMonth}
          plans={thisMonthPlan}
        />
      </div>
    </div>
  );
};

export default MainGrassItem;
