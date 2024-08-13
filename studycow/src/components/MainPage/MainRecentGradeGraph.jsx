import React, { useState, useEffect } from "react";
import useInfoStore from "../../stores/infos";
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
import MainScoreChange from "./MainScoreChange.jsx";
import "./styles/MainRecentGradeGraph.css"

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

  const {
    selectedSubject,
    subjectGrades,
    fetchSelectedSubjectGrade,
    setSelectedSubject,
  } = useGradeStore((state) => ({
    selectedSubject: state.selectedSubject,
    subjectGrades: state.subjectGrades,
    fetchSelectedSubjectGrade: state.fetchSelectedSubjectGrade,
    setSelectedSubject: state.setSelectedSubject,
  }));

  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  useEffect(() => {
    if (selectedSubject) {
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

  // 차트 클릭 이벤트 핸들러
  const handleChartClick = (event, elements) => {
    if (elements.length > 0) {
      const dataIndex = elements[0].index;
      const clickedData = graphData[dataIndex][1]; // 클릭한 데이터의 세부 정보 가져오기
      setModalData(clickedData); // 모달에 표시할 데이터 설정
      setShowModal(true); // 모달 열기
    }
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
    onClick: handleChartClick, // 클릭 이벤트 핸들러 추가
  };

  const handleScoreChange = () => {
    // 성적이 변경된 후 과목 선택을 새로고침하여 데이터를 다시 불러옴
    setSelectedSubject("");
    setTimeout(() => setSelectedSubject(selectedSubject), 0);
  };

  return (
    <div className="main-subject-grade-graph">
      <Line className="main-subject-grade-graph-line" options={options} data={data} />

      {/* 모달 영역 */}
      {showModal && (
        <div className="ScoreChangeModal-overlay">
          <div className="ScoreChangeModal-content">
            <MainScoreChange
              onClose={() => setShowModal(false)}
              initialData={modalData} // 클릭한 데이터를 initialData로 전달
              subjectGrades={subjectGrades} // subjectGrades를 ScoreChange에 전달
              onScoreChange={handleScoreChange} // 부모 컴포넌트에 변경 신호를 보내기 위한 함수 전달
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentGradeGraph;
