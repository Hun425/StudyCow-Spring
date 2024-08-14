import "../styles/FriendGradePage.css";
import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer"
import useFriendsStore from "../stores/friends";

const FriendGradePage = () => {
  const { userId } = useParams();
  const { fetchFriendInfo } = useFriendsStore();

  useEffect(() => {
    if (userId) {
      fetchFriendInfo(userId);
    }
  }, [fetchFriendInfo, userId]);

  return (
    <>
      <Navbar />
      <div className="friendGradeMain">
        <Outlet context={{ userId }} />
      </div>
      <Footer />
    </>
  );
};

export default FriendGradePage;
