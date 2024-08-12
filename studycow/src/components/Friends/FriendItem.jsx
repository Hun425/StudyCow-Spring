import "./styles/FriendItem.css";
import { useCallback } from "react";
import useFriendsStore from "../../stores/friends";

const FriendItem = ({ thumbnail, nickname, userId }) => {
  const removeFriend = useFriendsStore((state) => state.removeFriend);

  const handleDelete = useCallback(() => {
    const isConfirmed = window.confirm(
      `${nickname}님을 친구 목록에서 삭제하시겠습니까?`
    );
    if (isConfirmed) {
      removeFriend(userId);
    }
  }, [removeFriend, userId, nickname]);

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
        <button>🔍</button>
        <button className="friendDelete" onClick={handleDelete}>
          💔
        </button>
      </div>
    </div>
  );
};

export default FriendItem;
