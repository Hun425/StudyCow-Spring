import "../styles/AnalyzePage.css";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";
import { useRef, useEffect } from "react";

const AnalyzePage = () => {
  const analyzeMainRef = useRef(null);

  useEffect(() => {
    const updateAnalyzeMainMargin = () => {
      const navHeight = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--nav-height");
      if (analyzeMainRef.current) {
        analyzeMainRef.current.style.marginTop = navHeight;
      }
    };

    updateAnalyzeMainMargin();
    window.addEventListener("resize", updateAnalyzeMainMargin);

    return () => window.removeEventListener("resize", updateAnalyzeMainMargin);
  }, []);

  return (
    <>
      <Navbar />
      <div ref={analyzeMainRef} className="analyzeMain">
        <Outlet />
      </div>
    </>
  );
};

export default AnalyzePage;
