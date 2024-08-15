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
      <div className="MainPageSideBar">
        <UserGradeImage/>
        <MainRecentRoom />
      </div>
      <div className="mainInfoPart">
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
