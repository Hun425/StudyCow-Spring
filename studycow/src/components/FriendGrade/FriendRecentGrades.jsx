import React, { useEffect } from "react";
import "./styles/FriendRecentGrades.css";
import useGradeStore from "../../stores/grade";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js에 필요한 컴포넌트들을 등록
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const FriendRecentGrades = ({userId}) => {
  const {
    selectedSubject,
    subjectGrades,
    fetchSelectedSubjectGrade,
  } = useGradeStore((state) => ({
    selectedSubject: state.selectedSubject,
    subjectGrades: state.subjectGrades,
    fetchSelectedSubjectGrade: state.fetchSelectedSubjectGrade,
  }));

  useEffect(() => {
    if (selectedSubject) {
      console.log(selectedSubject)
      fetchSelectedSubjectGrade(userId, selectedSubject);
    }
  }, [userId, selectedSubject, fetchSelectedSubjectGrade]);

  // subjectGrades 데이터를 정렬하고 최근 5개만 선택
  const graphData = Object.entries(subjectGrades)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .slice(-5);

  // Chart.js에 사용될 데이터 객체
  const data = {
    labels: graphData.map(([date]) => date), // X축 레이블로 날짜 사용
    datasets: [
      {
        label: "성적",
        data: graphData.map(([, gradeInfo]) => gradeInfo.testScore), // subjectGrades의 testScore를 사용
        borderColor: "rgb(75, 192, 192)", // 선 색상 설정
        tension: 0, // 선의 곡률 설정 (0: 직선, 1: 최대 곡률)
      },
    ],
  };

  // Chart.js 옵션 설정
  const options = {
    responsive: true, // 반응형 차트 설정
    maintainAspectRatio: false, // 컨테이너 크기에 맞춰 차트 크기 조정
    plugins: {
      legend: {
        position: "top", // 범례 위치 설정
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          },
          afterLabel: function (context) {
            const dataIndex = context.dataIndex;
            const gradeInfo = graphData[dataIndex][1];
            if (gradeInfo.scoreDetails) {
              return gradeInfo.scoreDetails.map(
                (detail) => `${detail.catName}: ${detail.wrongCnt}개 틀림`
              );
            }
            return [];
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
      y: {
        ticks: {
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="subjectGradeGraph">
      <Line options={options} data={data} />
    </div>
  );
};

export default FriendRecentGrades;
