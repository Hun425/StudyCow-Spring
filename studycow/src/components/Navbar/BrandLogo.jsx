import Logo from "./img/logo.png";
import "./styles/BrandLogo.css"

function brandLogo() {
  return (
    <>
      <img className="brandLogo" src={Logo} alt="로고" />
    </>
  );
}
export default brandLogo;
