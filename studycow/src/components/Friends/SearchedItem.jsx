import "./styles/SearchedItem.css";
import useFriendsStore from "../../stores/friends";

const SearchedItem = ({ friend }) => {
  const sendFriendRequest = useFriendsStore((state) => state.sendFriendRequest);
  const sendRequests = useFriendsStore((state) => state.sendRequests);
  const getRequests = useFriendsStore((state) => state.getRequests);

  const handleAddFriendClick = async () => {
    await sendFriendRequest(friend.userId);
  };

  // 이미 친구요청을 했는지 구분하기 위해 사용
  const isRequestSent =
    sendRequests.some(
      (request) => request.counterpartUserId === friend.userId
    ) ||
    getRequests.some((request) => request.counterpartUserId === friend.userId);

  return (
    <div className="searchedItem">
      <div>
        <p className="searchedItemInfo">
          {friend.userNickName} ({friend.userEmail})
        </p>
      </div>
      <button
        className="addFriendBtn"
        onClick={handleAddFriendClick}
        disabled={isRequestSent} // 이미 보낸 요청인 경우 비활성화
      >
        {isRequestSent ? "요청 불가" : "친구 추가"}
      </button>
    </div>
  );
};

export default SearchedItem;
