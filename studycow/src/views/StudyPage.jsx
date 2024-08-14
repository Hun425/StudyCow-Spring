import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer"
import "../styles/StudyPage.css";
import { Outlet } from "react-router-dom";

const StudyPage = () => {
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
