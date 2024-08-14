import React, { useEffect } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import useGradeStore from "../../stores/grade";
import useInfoStore from "../../stores/infos";
import "./styles/AnalyzeWeakGraph.css"; // CSS 파일 import

// Chart.js 컴포넌트 등록
ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyzeWeakGraph = () => {
  // useGradeStore와 useInfoStore에서 필요한 상태와 함수를 가져옴
  const { weaknessParts, fetchWeaknessPart, selectedSubject } = useGradeStore();
  const { userInfo } = useInfoStore();

  // 컴포넌트가 마운트되거나 의존성이 변경될 때 데이터를 가져옴
  useEffect(() => {
    if (userInfo && userInfo.userId && selectedSubject) {
      fetchWeaknessPart(userInfo.userId, selectedSubject);
    }
  }, [userInfo, selectedSubject, fetchWeaknessPart]);

  // weaknessParts 데이터가 5개를 초과할 경우 기타로 묶기
  const getProcessedData = (data) => {
    const entries = Object.entries(data);

    // 데이터가 5개 초과 시, 나머지 항목들을 "기타"로 묶음
    if (entries.length > 5) {
      const sortedEntries = entries.sort((a, b) => b[1] - a[1]); // 값에 따라 내림차순 정렬
      const top5Entries = sortedEntries.slice(0, 5);
      const otherEntries = sortedEntries.slice(5);

      // 기타 항목의 합계 계산
      const otherCount = otherEntries.reduce((sum, entry) => sum + entry[1], 0);

      // 결과를 최종적으로 배열 형태로 반환
      return [
        ...top5Entries,
        ["기타", otherCount], // 기타 항목 추가
      ];
    }

    // 데이터가 5개 이하일 경우, 그대로 반환
    return entries;
  };

  // 도넛 차트에 필요한 데이터 구성
  const processedData = getProcessedData(weaknessParts);
  const total = processedData.reduce((sum, [, value]) => sum + value, 0); // 틀린 유형 개수의 총합 계산
  const chartData = {
    labels: processedData.map(([label]) => label), // 라벨 배열
    datasets: [
      {
        label: "틀린 개수",
        data: processedData.map(([, value]) => value), // 값 배열
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
          "rgba(255, 159, 64, 0.6)",
        ].slice(0, processedData.length), // 데이터 개수에 맞게 색상 배열 조정
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ].slice(0, processedData.length), // 데이터 개수에 맞게 색상 배열 조정
        borderWidth: 1,
      },
    ],
  };

  // 차트 옵션 설정
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (tooltipItem) => {
            const label = tooltipItem.label || "";
            const value = tooltipItem.raw || 0;
            const percentage = ((value / total) * 100).toFixed(2); // 퍼센트 계산
            return `${label}: ${value}개 (${percentage}%)`;
          },
        },
      },
    },
  };

  // 컴포넌트 렌더링
  return (
    <div className="analyze-weak-graph">
      <h3>취약점 분석 그래프</h3>
      <div className="chart-container">
        <Doughnut data={chartData} options={options} />
      </div>
    </div>
  );
};

export default AnalyzeWeakGraph;
