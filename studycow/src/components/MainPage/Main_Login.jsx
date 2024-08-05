import "./styles/Main_Login.css";
import MainPlanItem from "./MainPlanItem";
import MainGrassItem from "./MainGrassItem";
import MainGradeItem from "./MainGradeItem";
import MainRecentRoom from "./MainRecentRoom";

const Main_login = () => {
  return (
    <div className="mainTotalContainer">
      <div className="uppartContainer">
        <MainPlanItem />
        <MainGrassItem />
      </div>
      <div className="downpartContainer">
        <MainGradeItem />
        <MainRecentRoom />
      </div>
    </div>
  );
};

export default Main_login;
