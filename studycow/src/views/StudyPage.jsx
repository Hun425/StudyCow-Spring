import React, {useEffect} from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer"
import "../styles/StudyPage.css";
import { Outlet } from "react-router-dom";

const StudyPage = () => {
  useEffect(() => {
    document.title = "캠스터디";
  }, []);

  return (
    <>
      <Navbar />
      <div className="studyMain">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default StudyPage;
