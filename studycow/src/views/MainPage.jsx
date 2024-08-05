import Navbar from "../components/Navbar/Navbar";
import useInfoStore from "../stores/infos"; // 상태 관리 파일에서 useInfoStore를 가져옵니다
import Main_Unlogin from "../components/MainPage/Main_Unlogin";
import Main_Login from "../components/MainPage/Main_Login";

const MainPage = () => {
  const isLogin = useInfoStore((state) => state.isLogin); // 로그인 상태 체크

  return (
    <>
      <Navbar />
      <div className="main">{isLogin ? <Main_Login /> : <Main_Unlogin />};</div>
    </>
  );
};

export default MainPage;
