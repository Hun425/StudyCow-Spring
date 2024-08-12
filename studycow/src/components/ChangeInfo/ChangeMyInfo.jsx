import React, { useState, useEffect } from "react";
import useInfoStore from "../../stores/infos";
import "./Styles/ChangeInfo.css";
import { useNavigate } from "react-router-dom";
import Notiflix from 'notiflix';

const ChangeMyInfo = () => {
  const { userInfo, updateUserInfo, logout } = useInfoStore((state) => ({
    userInfo: state.userInfo,
    updateUserInfo: state.updateUserInfo,
    logout: state.logout,
  }));

  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [thumb, setThumb] = useState(null); 
  const [currentThumb, setCurrentThumb] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    setEmail(userInfo.userEmail || "");
    setNickname(userInfo.userNickName || "");
    setCurrentThumb(userInfo.userThumb || "");
  }, [userInfo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageToUpload = thumb || currentThumb;
    const success = await updateUserInfo(email, nickname, imageToUpload);

    if (success) {
      Notiflix.Notify.success("회원정보가 성공적으로 변경되었습니다.");
      logout();
      navigate("/login");
    } else {
      Notiflix.Notify.failure("회원정보 변경에 실패했습니다.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const fileType = file.type;

    if (!fileType.startsWith('image/')) {
        Notiflix.Notify.warning('이미지 파일만 선택할 수 있습니다.');
        setThumb(null);
        setCurrentThumb(userInfo.userThumb || ""); // 기존 이미지로 다시 설정
        e.target.value = ""; // 파일 입력 필드를 초기화
        return;
    }

    setThumb(file);
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
