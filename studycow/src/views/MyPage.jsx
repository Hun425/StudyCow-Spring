import { useEffect } from 'react';
import '../styles/MyPage.css'
import Sidebar from '../components/Sidebar/Sidebar'
import { Outlet, Navigate } from 'react-router-dom';
import useInfoStore from '../stores/infos';

function MyPage() {
  useEffect(() => {
    document.title = "마이페이지";
  }, []);

  // 상태 - 유저 정보 가져오기
  const { isLogin } = useInfoStore();

  console.log(isLogin)
  
  if (!isLogin) {
    return <Navigate to="/login" />;  // 로그인 상태가 아니면 로그인페이지로 redirect
  } 
    return (
    <>
    <div className='MyPage'>
      <div className="MyPageContainer">
        <div className="MyPageSidebar">
          <Sidebar/>
        </div>
        <div className="MyPageContent">
          <Outlet />
        </div>
      </div>  
    </div>
    </>
  );
}

export default MyPage;
