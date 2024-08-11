import "./styles/GradeAnalyzeBox.css";
import RecentGradeGraph from "./RecentGradeGraph";
import LearningStatus from "./LearningStatus";
import AnalyzeWeakBlock from "./AnalyzeWeakBlock";
import AnalyzeWeakGraph from "./AnalyzeWeakGraph";

const GradeAnalyzeBox = () => {
  return (
    <div className="selectedSubjectBox">
      <div className="upsidePartBox">
        <div className="recentGradeChangeGraph">
          <h1>최근 성적 변화 그래프</h1>
          <div>
            <RecentGradeGraph />
          </div>
        </div>
        <LearningStatus />
      </div>
      <div className="downsidePartBox">
        <AnalyzeWeakBlock />
        <AnalyzeWeakGraph />
      </div>
    </div>
  );
};

export default GradeAnalyzeBox;
