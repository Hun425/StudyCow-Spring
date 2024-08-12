import "./styles/FriendAnalyzeBox.css";
import FriendRecentGrades from "./FriendRecentGrades";
import FriendLearningStatus from "./FriendLearningStatus";
import FriendWeakBlock from "./FriendWeakBlock";

const FriendAnalyzeBox = ({ userId }) => {
  return (
    <div className="selectedSubjectContainer">
      <div className="upsideContainer">
        <div className="recentGradesGraph">
          <h3>최근 성적 변화 그래프</h3>
          <div>
            <FriendRecentGrades userId={userId} />
          </div>
        </div>
        <FriendLearningStatus userId={userId} />
      </div>
      <div className="downsideContainer">
        <FriendWeakBlock userId={userId} />
      </div>
    </div>
  );
};

export default FriendAnalyzeBox;
