/*이메일 닉네임 프로필 이미지 변경 기능*/

import React, { useState, useEffect } from "react";
import useInfoStore from "../../stores/infos";
import "./Styles/ChangeInfo.css";
import { useNavigate } from "react-router-dom";

const ChangeMyInfo = () => {
  // logout 가져오기
  const { userInfo, updateUserInfo, logout } = useInfoStore((state) => ({
    userInfo: state.userInfo,
    updateUserInfo: state.updateUserInfo,
    logout: state.logout, // 로그아웃 함수 가져오기
  }));

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [thumb, setThumb] = useState(null); // 파일 선택에 대한 상태
  const [currentThumb, setCurrentThumb] = useState(null); // 현재 이미지 상태

  const navigate = useNavigate(); // 페이지 이동을 위한 useNavigate 훅

  useEffect(() => {
    // 사용자 정보 초기화
    setEmail(userInfo.userEmail || "");
    setNickname(userInfo.userNickName || "");
    setCurrentThumb(userInfo.userThumb || "");
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 파일이 선택되지 않았을 경우 현재 이미지를 사용
    const imageToUpload = thumb || currentThumb;
    const success = await updateUserInfo(email, nickname, imageToUpload);

    if (success) {
      alert("회원정보가 성공적으로 변경되었습니다.");

      logout(); // 로그아웃 호출

      // 로그인 페이지로 리다이렉트
      navigate("/login");
    } else {
      alert("회원정보 변경에 실패했습니다.");
    }
  };

  const handleFileChange = (e) => {
    setThumb(e.target.files[0]); // 파일 선택 시 상태 업데이트
  };

  return (
    <div className="ChangeInfo-info-form">
      <h2>회원정보 변경</h2>
      <form onSubmit={handleSubmit}>
        <div className="ChangeInfo-form-group">
          <label htmlFor="email">이메일:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="ChangeInfo-form-group">
          <label htmlFor="nickname">닉네임:</label>
          <input
            type="text"
            id="nickname"
            name="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="ChangeInfo-form-group">
          <label htmlFor="thumb">프로필 이미지 변경:</label>
          <input
            type="file"
            id="thumb"
            name="thumb"
            onChange={handleFileChange}
          />
        </div>
        <div className="ChangeInfo-button-group">
          <button type="submit" className="ChangeInfo-submit-button">
            변경
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChangeMyInfo;
