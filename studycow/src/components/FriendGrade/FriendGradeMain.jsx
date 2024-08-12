import "./styles/FriendGradeMain.css";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import useGradeStore from "../../stores/grade";
import useSubjectStore from "../../stores/subjectStore";
import useFriendsStore from "../../stores/friends";
import FriendAnalyzeBox from "./FriendAnalyzeBox";

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
    console.log(subjectCode);
  };

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
          <h1>캐릭터 부분</h1>
        </div>
        <div className="friendGradeStatus">
          <FriendAnalyzeBox userId={friendInfo.userId} subject={selectedSubject}/>
        </div>
      </div>
    </div>
  );
};

export default FriendGradeMain;
