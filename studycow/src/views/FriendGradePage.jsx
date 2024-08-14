import "../styles/FriendGradePage.css";
import { Outlet, useParams } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer"
import useFriendsStore from "../stores/friends";

const FriendGradePage = () => {
  const { userId } = useParams();
  const { fetchFriendInfo, friendInfo } = useFriendsStore();

  useEffect(() => {
    if (userId) {
      fetchFriendInfo(userId);
    }
  }, [fetchFriendInfo, userId]);


  useEffect(() => {
    document.title = `${friendInfo.userNickName}님의 성적페이지`;
  }, [friendInfo]);

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
