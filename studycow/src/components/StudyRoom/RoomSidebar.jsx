import React from "react";
import Sidebutton from'./Sidebar/Sidebutton.jsx';
import settingButton from"./Sidebar/img/settingButton1.png";
import useStudyStore from "../../stores/studies.js";
import soundOnButton from "./Sidebar/img/volOn.png";
import soundOffButton from "./Sidebar/img/volOff.png";
import camOnButton from "./Sidebar/img/camOn.png";
import camOffButton from "./Sidebar/img/camOff.png";
import musicOnButton from "./Sidebar/img/musicOn.png";
import musicOffButton from "./Sidebar/img/musicOff.png";
import micOnButton from "./Sidebar/img/micOn.png";
import micOffButton from "./Sidebar/img/micOff.png";
import './styles/RoomSidebar.css'

function RoomSidebar() {
  // 사운드 온오프
  const soundOn = useStudyStore((state) => state.soundOn);
  const setSound = useStudyStore((state) => state.setSound);
  const soundButtonImage = soundOn ? soundOnButton : soundOffButton;

  // 캠 온오프
  const showCam = useStudyStore((state) => state.showCam);
  const setCam = useStudyStore((state) => state.setCam);
  const camButtonImage = showCam ? camOnButton : camOffButton;

  // bgm 온오프
  const bgmOn = useStudyStore((state) => state.bgmOn);
  const setBgm = useStudyStore((state) => state.setBgm);
  const musicButtonImage = bgmOn ? musicOnButton : musicOffButton;

  // mic 온오프
  const micOn = useStudyStore((state) => state.micOn);
  const setMic = useStudyStore((state) => state.setMic);
  const micButtonImage = micOn ? micOnButton : micOffButton;
  


  return (
    <>
    <div className="StudySideContainer">
      <div className="StudySideButtonContainer">
        <Sidebutton image={camButtonImage} onButtonClick={setCam}/>
        <Sidebutton image={soundButtonImage} onButtonClick={setSound}/>
        <Sidebutton image={micButtonImage} onButtonClick={setMic}/>
        <Sidebutton image={musicButtonImage} onButtonClick={setBgm}/>
      </div>
      <div className="studySideSettingButtonContainer">
        <Sidebutton image={settingButton} onButtonClick="" />
      </div>
    </div>
    </>
  );
}
export default RoomSidebar;
