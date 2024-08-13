import "./styles/Main_Login.css";
import MainPlanItem from "./MainPlanItem";
import MainGrassItem from "./MainGrassItem";
import MainGradeItem from "./MainGradeItem";
import MainRecentRoom from "./MainRecentRoom";
import UserGradeImage from "../GradeImg/GradeImg";

const Main_login = () => {
  return (
    <>
    <div className="mainTotalContainer">
      <div className="mainInfoPart">
        <div className="mainLeftContainer">
          <div className="charImgPart">
            <UserGradeImage /> {/* 유저 등급 이미지 추가 */}
          </div>
          <MainRecentRoom />
        </div>
        <div className="mainRightContainer">
          <div className="mainRightUpperContainer">
            <MainPlanItem />
            <MainGrassItem />
          </div>
          <div className="mainRightDownContainer">
            <MainGradeItem />
          </div>                    
        </div>
      </div>
    </div>
    </>
  );
};

export default Main_login;
