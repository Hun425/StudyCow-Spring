import React from 'react';
import { useEffect } from "react";
import "./styles/RecentGradeGraph.css";
import useInfoStore from "../../stores/infos";
import useGradeStore from "../../stores/grade";
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

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

const RecentGradeGraph = () => {
  const { userId } = useInfoStore((state) => ({
    userId: state.userInfo.userId,
  }));

  const { selectedSubject, subjectGrades, fetchSelectedSubjectGrade } =
    useGradeStore((state) => ({
      selectedSubject: state.selectedSubject,
      subjectGrades: state.subjectGrades,
      fetchSelectedSubjectGrade: state.fetchSelectedSubjectGrade,
    }));

  useEffect(() => {
    if (selectedSubject) {
      fetchSelectedSubjectGrade(userId, selectedSubject);
    }
  }, [userId, selectedSubject, fetchSelectedSubjectGrade]);

  // subjectGrades 데이터를 정렬하고 최근 5개만 선택
  const graphData = Object.entries(subjectGrades)
    .sort(([dateA], [dateB]) => new Date(dateA) - new Date(dateB))
    .slice(-5)

  // Chart.js에 사용될 데이터 객체
  const data = {
    labels: graphData.map(([date]) => date),  // X축 레이블로 날짜 사용
    datasets: [
      {
        label: '성적',
        data: graphData.map(([, score]) => score),  // Y축 데이터로 점수 사용
        borderColor: 'rgb(75, 192, 192)',  // 선 색상 설정
        tension: 0  // 선의 곡률 설정 (0: 직선, 1: 최대 곡률)
      }
    ]
  };

  // Chart.js 옵션 설정
  const options = {
    responsive: true,  // 반응형 차트 설정
    maintainAspectRatio: false,  // 컨테이너 크기에 맞춰 차트 크기 조정
    plugins: {
      legend: {
        position: 'top',  // 범례 위치 설정
        labels: {
          // 범례의 폰트 설정
          font: {
            size: 14,
            weight: 'bold'
          }
        }
      },
      title: {
        display: true,
        text: '최근 성적 변화 그래프',
        font: {
          // 제목의 폰트 설정
          size: 18,
          weight: 'bold'
        }
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: '날짜',
          font: {
            // X축 제목의 폰트 설정
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          // X축 눈금 레이블의 폰트 설정
          font: {
            size: 12
          }
        }
      },
      y: {
        title: {
          display: true,
          text: '점수',
          font: {
            // Y축 제목의 폰트 설정
            size: 14,
            weight: 'bold'
          }
        },
        ticks: {
          // Y축 눈금 레이블의 폰트 설정
          font: {
            size: 12
          }
        }
      }
    }
  };

  // 차트 렌더링
  return (
    <div className="subject-grade-graph">
      <Line options={options} data={data} />
    </div>
  );
};

export default RecentGradeGraph;