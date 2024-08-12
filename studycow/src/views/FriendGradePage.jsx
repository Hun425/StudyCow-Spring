import "../styles/FriendGradePage.css";
import { Outlet } from "react-router-dom";
import { useRef, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";

const FriendGradePage = () => {
  const friendGradeMainRef = useRef(null);

  useEffect(() => {
    const updateFriendGradeMainMargin = () => {
      const navHeight = getComputedStyle(
        document.documentElement
      ).getPropertyValue("--nav-height");
      if (friendGradeMainRef.current) {
        friendGradeMainRef.current.style.marginTop = navHeight;
      }
    };

    updateFriendGradeMainMargin();
    window.addEventListener("resize", updateFriendGradeMainMargin);

    return () =>
      window.removeEventListener("resize", updateFriendGradeMainMargin);
  }, []);

  return (
    <>
      <Navbar />
      <div ref={friendGradeMainRef} className="friendGradeMain">
        <Outlet />
      </div>
    </>
  );
};

export default FriendGradePage;
