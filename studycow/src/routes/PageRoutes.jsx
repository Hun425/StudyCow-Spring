import { Route, Routes } from "react-router-dom";

// 메인페이지
import MainPage from "../views/MainPage.jsx";
// 비로그인
import Main_Unlogin from "../components/MainPage/Main_Unlogin.jsx";
// 로그인
import Main_Login from "../components/MainPage/Main_Login.jsx";

// 로그인/회원가입페이지
import SignPage from "../views/SignPage.jsx";

// 마이페이지 - 메인
import MyPage from "../views/MyPage.jsx";
// 마이페이지 - 세부 페이지
import MyPageEdit from "../components/ChangeInfo/ChangeInfo.jsx";
import FriendComponent from "../components/Friends/FriendComponent";
import MyPageGrade from "../components/MyPage/MyPageGrade.jsx";

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

// 성적 등록
import ScoreRegist from "../components/ScoreRegist/ScoreRegist.jsx";

const PageRoutes = () => (
  <Routes>
    {/* 마이페이지 */}
    <Route path="/myaccount" element={<MyPage />}>
      <Route path="" element={<MyPageEdit />} />
      <Route path="friends" element={<FriendComponent />} />
      <Route path="grade" element={<MyPageGrade />} />
    </Route>

    {/* 홈 */}
    <Route path="/" element={<MainPage />} />

    {/* 로그인 */}
    <Route path="/login" element={<SignPage />}></Route>

    {/* 캠스터디 */}
    <Route path="/study" element={<StudyPage />}>
      <Route path="" element={<StudyList />} />
      <Route path="create" element={<StudyCreate />} />
    </Route>
    <Route path="/study/room/:roomId" element={<StudyRoom />} />

    {/* 플랜 */}
    <Route path="/plan" element={<PlanPage />}>
      <Route path="" element={<MyPlanner />} />
      <Route path="create" element={<PlanCreate />} />
    </Route>
    <Route path="/modify/:planId" element={<PlanModify />} />

    {/* 성적분석 */}
    <Route path="/analyze" element={<a>analyze</a>}></Route>

    {/*성적등록*/}
    <Route path="/score/regist" element={<ScoreRegist />} />
  </Routes>
);

export default PageRoutes;
