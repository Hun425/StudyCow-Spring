import "../styles/AnalyzePage.css";
import Navbar from "../components/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const AnalyzePage = () => {
  return (
    <>
      <Navbar />
      <div className="analyzeMain">
        <Outlet />
      </div>
    </>
  );
};

export default AnalyzePage;
