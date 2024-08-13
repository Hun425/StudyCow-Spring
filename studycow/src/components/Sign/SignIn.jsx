import React, { useState } from "react";
import useInfoStore from "../../stores/infos";
import Notiflix from 'notiflix';

const SignIn = () => {
  const { sendLoginRequest } = useInfoStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await sendLoginRequest(email, password);
    if (success) {
      Notiflix.Notify.success('로그인 성공');
    } else {
      Notiflix.Notify.failure('비밀번호가 일치하지 않습니다.');
    }
  };

  return (
    <div className="form-container sign-in-container">
      <form onSubmit={handleSubmit}>
        <h1>Sign in</h1>
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
        {error && <p className="error">{error}</p>}
        <button type="submit">Sign In</button>
      </form>
    </div>
  );
};

export default SignIn;
