import Logo from "./img/logo.png";
import './styles/BrandLogo.css'

function brandLogo() {
  return (
    <>
    <div className="Logo">
      <div className="LogoImg">
        <img width="60px" src={Logo} alt="로고" />
      </div>
      <div className="LogoItem">
        <a>My Page</a>
      </div>
    </div>
    </>
  );
}
export default brandLogo;