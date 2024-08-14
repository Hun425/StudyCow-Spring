import React from 'react';
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer"
import '../styles/PlanPage.css'
import { Outlet } from 'react-router-dom';

const PlanPage = () => {  
  return (
    <>
      <Navbar />
      <div className="planerMain">
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default PlanPage;
