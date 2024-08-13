import "./styles/FriendItem.css";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import useFriendsStore from "../../stores/friends";
import { Confirm } from "notiflix";

const FriendItem = ({ thumbnail, nickname, userId }) => {
  const removeFriend = useFriendsStore((state) => state.removeFriend);
  const navigate = useNavigate();

  Confirm.init({
    titleColor: "#ff5549", // 빨간색 (빨간색은 #ff5549, 초록색은 #008000)
    okButtonBackground: "#ff5549", // 빨간색
    cancelButtonBackground: "#a9a9a9", // 회색
    titleFontSize: "20px", // 제목 폰트 크기 증가
    width: "400px", // 대화상자 너비 설정
    messageColor: "#1e1e1e", // 메시지 색상 설정
    messageFontSize: "16px", // 메시지 폰트 크기 설정
    buttonsFontSize: "14px", // 버튼 폰트 크기 설정
    borderRadius: "20px",
  });

  const handleDelete = useCallback(() => {
    Confirm.show(
      "친구 삭제",
      `${nickname}님을 친구 목록에서 삭제하시겠소?`,
      "네",
      "아니오",
      () => {
        removeFriend(userId);
      },
      () => {
        // 취소 시 아무 작업도 하지 않음
      }
    );
  }, [removeFriend, nickname, userId]);

  const handleViewProfile = useCallback(() => {
    navigate(`/friend/${userId}`, { state: { userId } });
  }, [navigate, userId]);

  return (
    <div className="friendItem">
      <div className="friendInfo">
        <img
          src={thumbnail}
          alt={`${nickname}의 썸네일`}
          className="friendThumbnail"
        />
        <p className="friendNickname">{nickname}</p>
      </div>
      <div>
        <button onClick={handleViewProfile}>🔍</button>
        <button className="friendDelete" onClick={handleDelete}>
          💔
        </button>
      </div>
    </div>
  );
};

export default FriendItem;
