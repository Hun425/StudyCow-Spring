import React, { useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import useGradeStore from "../../stores/grade";
import useInfoStore from "../../stores/infos";
import "./styles/AnalyzeWeakGraph.css"; // CSS 파일 import

// Chart.js 컴포넌트 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AnalyzeWeakGraph = () => {
  // useGradeStore와 useInfoStore에서 필요한 상태와 함수를 가져옴
  const { weaknessTop3, fetchWeaknessPart, selectedSubject } = useGradeStore();
  const { userInfo } = useInfoStore();

  // 컴포넌트가 마운트되거나 의존성이 변경될 때 데이터를 가져옴
  useEffect(() => {
    if (userInfo && userInfo.userId && selectedSubject) {
      fetchWeaknessPart(userInfo.userId, selectedSubject);
    }
  }, [userInfo, selectedSubject, fetchWeaknessPart]);

  // 차트 데이터 구성
  const chartData = {
    labels: Object.keys(weaknessTop3), // 취약한 부분들을 라벨로 사용
    datasets: [
      {
        label: "틀린 개수",
        data: Object.values(weaknessTop3), // 각 취약 부분의 틀린 개수
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // 차트 옵션 설정
  const options = {
    indexAxis: "y", // 가로 막대 그래프로 설정
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  // 컴포넌트 렌더링
  return (
    <div className="analyze-weak-graph">
      <h3>취약점 분석 그래프</h3>
      <div className="chart-container">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AnalyzeWeakGraph;
