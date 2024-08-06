import "./styles/GradeAnalyzeBox.css";
import RecentGradeGraph from "./RecendGradeGraph";

const GradeAnalyzeBox = () => {
  return (
    <div className="selectedSubjectBox">
      <RecentGradeGraph />
    </div>
  );
};

export default GradeAnalyzeBox;
