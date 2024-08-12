import React, { useState } from "react";
import useInfoStore from "../../stores/infos";
import Notiflix from 'notiflix';

const SignUp = () => {
  const { sendLoginRequest, sendRegisterRequest } = useInfoStore();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 비밀번호 확인 검증
    if (password !== confirmPassword) {
      Notiflix.Notify.failure('비밀번호가 일치하지 않습니다.');
      return;
    }

    setError("");
    const success = await sendRegisterRequest(email, password, nickname);
    if (success) {
      Notiflix.Notify.success('회원가입에 성공했습니다!');
      sendLoginRequest(email, password);
    } else {
      Notiflix.Notify.failure('회원가입에 실패했습니다.');
    }
  };

  return (
    <div className="form-container sign-up-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign Up</h1>
        <input
          type="text"
          placeholder="닉네임"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="비밀번호 (확인)"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default SignUp;
