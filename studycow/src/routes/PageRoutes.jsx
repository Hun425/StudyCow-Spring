import { Route, Routes } from "react-router-dom";

// 메인페이지
import MainPage from "../views/MainPage.jsx";

// 로그인/회원가입페이지
import SignPage from "../views/SignPage.jsx";

// 마이페이지 - 메인
import MyPage from "../views/MyPage.jsx";
// 마이페이지 - 세부 페이지
import MyPageEdit from "../components/ChangeInfo/ChangeInfo.jsx";
import FriendComponent from "../components/Friends/FriendComponent";

// 플래너페이지
import PlanPage from "../views/PlanPage.jsx";
// 플래너페이지 - 마이페이지
import MyPlanner from "../components/Planner/MyPlanner.jsx";
// 플래너페이지 - 생성
import PlanCreate from "../components/Planner/CreateModify/PlanCreate.jsx";
import PlanModify from "../components/Planner/CreateModify/PlanModify.jsx";

// 캠스터디 - 메인 페이지(스터디룸 리스트)
import StudyPage from "../views/StudyPage.jsx";
import StudyList from "../components/StudyList/StudyList.jsx";
import StudyCreate from "../components/StudyCreate/StudyCreate.jsx";
import StudyRoom from "../components/StudyRoom/StudyRoom.jsx";
import StudyEnter from "../components/StudyEnter/StudyEnter.jsx";

// 성적 등록
import ScoreRegist from "../components/ScoreRegist/ScoreRegist.jsx";

// 성적 분석 페이지
import AnalyzePage from "../views/AnalyzePage.jsx";
import TestAnalyze from "../components/TestAnalyze/TestAnalyze.jsx";

// 친구 성적 보기
import FriendGradePage from "../views/FriendGradePage.jsx";
import FriendGradeMain from "../components/FriendGrade/FriendGradeMain.jsx";

const PageRoutes = () => (
  <Routes>
    {/* 마이페이지 */}
    <Route path="/myaccount" element={<MyPage />}>
      <Route path="" element={<MyPageEdit />} />
      <Route path="friends" element={<FriendComponent />} />
    </Route>

    {/* 홈 */}
    <Route path="/" element={<MainPage />} />

    {/* 로그인 */}
    <Route path="/login" element={<SignPage />}></Route>

    {/* 캠스터디 */}
    <Route path="/study" element={<StudyPage />}>
      <Route path="" element={<StudyList />} />
      <Route path="create" element={<StudyCreate />} />
      <Route path="enter" element={<StudyEnter />} />
    </Route>
    <Route path="/study/room/:roomId" element={<StudyRoom />} />

    {/* 플랜 */}
    <Route path="/plan" element={<PlanPage />}>
      <Route path="" element={<MyPlanner />} />
      <Route path="create" element={<PlanCreate />} />
    </Route>
    <Route path="/modify/:planId" element={<PlanModify />} />

    {/* 성적분석 */}
    <Route path="/analyze" element={<AnalyzePage />}>
      <Route path="" element={<TestAnalyze />} />
    </Route>

    {/*성적등록*/}
    <Route path="/score/regist" element={<ScoreRegist />} />

    {/* 친구 성적 보기 */}
    <Route path="/friend/:userId" element={<FriendGradePage />}>
      <Route path="" element={<FriendGradeMain />} />
    </Route>
  </Routes>
);

export default PageRoutes;
