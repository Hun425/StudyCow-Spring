import "./styles/FriendGradeMain.css";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import useGradeStore from "../../stores/grade";
import useSubjectStore from "../../stores/subjectStore";
import useFriendsStore from "../../stores/friends";
import FriendAnalyzeBox from "./FriendAnalyzeBox";
import FriendGradeImg from "./FriendGradeImg";

const FriendGradeMain = () => {
  const { userId } = useOutletContext();
  const { selectedSubject, setSelectedSubject } = useGradeStore();
  const { subjects, fetchSubjects } = useSubjectStore();
  const { friendInfo } = useFriendsStore();

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  const handleSubjectChange = (subjectCode) => {
    if (selectedSubject === subjectCode) {
      setSelectedSubject("");
      setTimeout(() => setSelectedSubject(subjectCode), 0);
    } else {
      setSelectedSubject(subjectCode);
    }
  };

  if (friendInfo.userPublic === 0) {
    // 비공개 상태일 때 메시지 표시
    return (
      <div className="friendGradeContainer">
        <h1>{friendInfo.userNickName}님의 페이지는 비공개 상태입니다.</h1>
      </div>
    );
  }

  return (
    <div className="friendGradeContainer">
      <div className="friendGradeHeader">
        <h1>{friendInfo.userNickName}님의 성적관리 페이지입니다.</h1>
        <div className="friendGradeSideNav">
          <div className="friendGradeSubjectSelect">
            <select
              name="subject"
              onChange={(e) => handleSubjectChange(e.target.value)}
              value={selectedSubject}
              className="form-control ml-2"
            >
              <option value="" disabled hidden>
                과목 선택
              </option>
              {subjects.map((subject) => (
                <option key={subject.subCode} value={subject.subCode}>
                  {subject.subName}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      <div className="friendGradeBody">
        <div className="friendCowStatus">
          {/* userGrade.gradeName은 제대로 동작하지 않아 옵셔널 체이닝 사용 */}
          <FriendGradeImg
            gradeName={friendInfo.userGrade?.gradeName}
            userExp={friendInfo.userExp}
            maxExp={friendInfo.userGrade?.maxExp}
          />
        </div>
        <div className="friendGradeStatus">
          <FriendAnalyzeBox
            userId={friendInfo.userId}
            subject={selectedSubject}
          />
        </div>
      </div>
    </div>
  );
};

export default FriendGradeMain;
