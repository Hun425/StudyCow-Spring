import Navbar from "../components/Navbar/Navbar";
import "../styles/StudyPage.css";
import { Outlet } from "react-router-dom";
import { useRef, useEffect } from "react";

const StudyPage = () => {
  const studyMainRef = useRef(null);

  useEffect(() => {
    const updateStudyMainMargin = () => {
      const navHeight = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--nav-height");
      if (studyMainRef.current) {
        studyMainRef.current.style.marginTop = navHeight;
      }
    };

    updateStudyMainMargin();
    window.addEventListener("resize", updateStudyMainMargin);

    return () => window.removeEventListener("resize", updateStudyMainMargin);
  }, []);

  return (
    <>
      <Navbar />
      <div ref={studyMainRef} className="studyMain">
        <Outlet />
      </div>
    </>
  );
};

export default StudyPage;
