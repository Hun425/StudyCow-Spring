import "../styles/AnalyzePage.css";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";

const AnalyzePage = () => {
  return (
    <>
      <Navbar />
      <div className="analyzeMain">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default AnalyzePage;
