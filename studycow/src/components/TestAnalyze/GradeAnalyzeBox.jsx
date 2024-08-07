import "./styles/GradeAnalyzeBox.css";
import RecentGradeGraph from "./RecendGradeGraph";
import LearningStatus from "./LearningStatus";
import AnalyzeWeakBlock from "./AnalyzeWeakBlock";
import AnalyzeWeakGraph from "./AnalyzeWeakGraph";

const GradeAnalyzeBox = () => {
  return (
    <div className="selectedSubjectBox">
      <div className="upsidePartBox">
        <RecentGradeGraph />
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
