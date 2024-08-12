import Logo from "./img/logo.png";
import './styles/BrandLogo.css';
import { useNavigate } from "react-router-dom";

function BrandLogo() {
  // 이동 - 홈으로 단순 이동
  const navigate = useNavigate();
  
  function goHome() {
    navigate("/");
  }

  return (
    <>
      <div className="Logo">
        <div className="LogoImg" onClick={goHome}>
          <img className="LogoImgSize" src={Logo} alt="로고" />
        </div>
        <div className="LogoItem">
          <a>My Page</a>
        </div>
      </div>
    </>
  );
}

export default BrandLogo;
