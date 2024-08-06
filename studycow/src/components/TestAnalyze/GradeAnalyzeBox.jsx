import "./styles/GradeAnalyzeBox.css";
import RecentGradeGraph from "./RecendGradeGraph";
import LearningStatus from "./LearningStatus"; // Import LearningStatus component

const GradeAnalyzeBox = () => {
  return (
    <div className="selectedSubjectBox">
      <div className="upsidePartBox">
        <RecentGradeGraph />
        <LearningStatus />
      </div>
    </div>
  );
};

export default GradeAnalyzeBox;
