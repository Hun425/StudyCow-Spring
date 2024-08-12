import Navbar from "../components/Navbar/Navbar";
import useInfoStore from "../stores/infos"; // 상태 관리 파일에서 useInfoStore를 가져옵니다
import Main_Unlogin from "../components/MainPage/Main_Unlogin";
import Main_Login from "../components/MainPage/Main_Login";
import { useRef, useEffect } from "react";
import "../styles/MainPage.css";

const MainPage = () => {
  const isLogin = useInfoStore((state) => state.isLogin); // 로그인 상태 체크

  const startMainRef = useRef(null);

  useEffect(() => {
    const updateStartMainMargin = () => {
      const navHeight = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--nav-height");
      if (startMainRef.current) {
        startMainRef.current.style.marginTop = navHeight;
      }
    };

    updateStartMainMargin();
    window.addEventListener("resize", updateStartMainMargin);

    return () => window.removeEventListener("resize", updateStartMainMargin);
  }, []);

  return (
    <>
      <Navbar />
      <div ref={startMainRef} className="main">
        {isLogin ? <Main_Login /> : <Main_Unlogin />}
      </div>
    </>
  );
};

export default MainPage;
