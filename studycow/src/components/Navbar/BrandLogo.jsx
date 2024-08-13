import Logo from "./img/logo.png";
import "./styles/BrandLogo.css"

function brandLogo() {
  return (
    <>
    <div className="navLogoContainer">
      <img className="navLogo" src={Logo} alt="로고" />
      <span className="navLogoContent">공부했소?</span>
    </div>
    </>
  );
}
export default brandLogo;
