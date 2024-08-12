import { useState } from "react";
import useInfoStore from "../../stores/infos.js";
import upImg from "./img/up.png";
import downImg from "./img/down.png";
import "./styles/UserInformation.css";
import Navbar from "react-bootstrap/Navbar";

function UserInformation() {
  const { userInfo, logout } = useInfoStore();
  
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(prevState => !prevState);
  };

        
  return (
    <>
      <div className="userDropdown">
        {!isOpen && (
          <>
            <div className="userInfoClose" onClick={toggleDropdown}>
              <div>
                <img
                  className="profileImg"
                  src={userInfo.userThumb}
                  alt="프로필이미지"
                />
              </div>
              <div className="userNicnameContainer">
                <a>
                  {userInfo.userNickName}님
                </a>
              </div>
              <div>
                <img className="downImg" src={downImg} alt="아랫방향" />
              </div>
            </div>
          </>
        )}
        {isOpen && (
          <>
            <div className="userInfoOpen" onClick={toggleDropdown}>
              <div>
                <img
                  className="profileImg"
                  src={userInfo.userThumb}
                  alt="프로필이미지"
                />
              </div>
              <div className="userNicnameContainer">
                <a>
                  {userInfo.userNickName}님
                </a>
              </div>
              <div>
                <img className="upImg" src={upImg} alt="윗방향" />
              </div>
            </div>
            <div className="userDropdownContent">
              <div className="userInfoDetail">
                  <p>등급: {userInfo.userGrade.gradeName}</p>
                  <p>경험치: {userInfo.userExp}</p>
                  <p>이메일: {userInfo.userEmail}</p>
                </div>
                <Navbar.Brand className="userInfoItem" href="/myaccount">
                  마이 페이지
                </Navbar.Brand>
                <Navbar.Brand className="userInfoItem" onClick={logout}>
                  로그아웃
                </Navbar.Brand>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default UserInformation;
