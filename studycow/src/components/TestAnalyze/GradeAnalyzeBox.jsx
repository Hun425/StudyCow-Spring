import "./styles/GradeAnalyzeBox.css";
import RecentGradeGraph from "./RecentGradeGraph";

const GradeAnalyzeBox = () => {
  return (
    <div className="selectedSubjectBox">
      <RecentGradeGraph />
    </div>
  );
};

export default GradeAnalyzeBox;
