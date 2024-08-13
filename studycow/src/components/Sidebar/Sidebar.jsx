import Logo from "./BrandLogo.jsx";
import "./styles/Sidebar.css";
import logo from "../../assets/logo.png";
import useInfoStore from "../../stores/infos.js";
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  // 상태 - 유저 정보 가져오기
  const { userInfo, logout, resign } = useInfoStore();

  // 이동 - 홈으로 단순 이동
  const navigate = useNavigate();
  function goHome() {
    navigate("/");
  }

  return (
    <>
      <div className="Sidebar">
        <div className="SidebarLogo">
          <Logo />
        </div>
        <div className="SidebarUserInfo">
          <img
            className="profileSideImg"
            src={userInfo.userThumb}
            alt="프로필이미지"
          />
          <div className="SidbarUserInfoContent">
            <p>{userInfo.userNickName}</p>
            <a>{userInfo.userEmail}</a>
          </div>
        </div>
        <div className="SidebarContent">
          <Link className="SidebarContentItem" to="">
            회원정보 수정
          </Link>
          <Link className="SidebarContentItem" to="friends">
            친구 관리
          </Link>
          <hr />
        </div>
        <div className="SidebarFooter">
          <div className="SidebarFooterItem">
            <a onClick={logout}>로그아웃</a>
            <a>/</a>
            <a onClick={resign}>회원탈퇴</a>
          </div>
          <div className="SidebarFooterLogo">
            <div className="LogoItem" onClick={goHome}>
              <img className="LogoItemImg" src={logo} alt="로고 이미지" />
              <a>공부했소?</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
