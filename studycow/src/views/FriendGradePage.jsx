import "../styles/FriendGradePage.css";
import { Outlet, useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import useFriendsStore from "../stores/friends";

const FriendGradePage = () => {
  const { userId } = useParams();
  const { fetchFriendInfo } = useFriendsStore();
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

  useEffect(() => {
    if (userId) {
      fetchFriendInfo(userId);
    }
  }, [fetchFriendInfo, userId]);

  return (
    <>
      <Navbar />
      <div ref={friendGradeMainRef} className="friendGradeMain">
        <Outlet context={{ userId }} />
      </div>
    </>
  );
};

export default FriendGradePage;
