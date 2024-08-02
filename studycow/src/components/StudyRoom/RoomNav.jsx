import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import Navbutton from './Navbar/Navbutton.jsx'
import listButton from './Navbar/img/listButton.png'
import exitButton from './Navbar/img/exitButton.png'
import chatButton from './Navbar/img/chatButton.png'
import lankingButton from './Navbar/img/lankingButton.png'
import useStudyStore from "../../stores/study.js";
import usePlanStore from "../../stores/plan.js";
import Logo from '../../assets/logo.png'
import "./styles/RoomNav.css"


function RoomNav() {
  const navigate = useNavigate();
  const {today, getTodayPlanRequest} = usePlanStore((state) => ({
    today: state.today,
    getTodayPlanRequest: state.getTodayPlanRequest,
  }));
  const setNavigate = useStudyStore((state) => state.setNavigate);
  const goStudyBack = useStudyStore((state) => state.goStudyBack);
  const toggleChat = useStudyStore((state) => state.toggleChat);
  const toggleList = useStudyStore((state) => state.toggleList);
  const toggleLank = useStudyStore((state) => state.toggleLank);
  
  

  useEffect(() => {
    getTodayPlanRequest(today);
    setNavigate(navigate);
  }, [navigate, setNavigate, today, getTodayPlanRequest]);

  

  return (
    <>
    <div className="StudyNavContainer">
      <div className="StudyNavLogoContainer">
        <Navbutton image={Logo} onButtonClick={goStudyBack}/>
      </div>
      <div className="studyNavButtonContainer">
        <div className="utilButton">
          <Navbutton image={chatButton} onButtonClick={toggleChat}/>
          <Navbutton image={listButton} onButtonClick={toggleList}/>
          <Navbutton image={lankingButton} onButtonClick={toggleLank}/>
        </div>
        <div className="exitButton" >
          <Navbutton image={exitButton} onButtonClick={goStudyBack} />
        </div>
      </div>
    </div>
    </>
  );
}
export default RoomNav;
