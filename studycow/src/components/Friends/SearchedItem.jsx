import "./styles/SearchedItem.css";
import useFriendsStore from "../../stores/friends";
import { useCallback } from "react";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

const SearchedItem = ({ friend }) => {
  const sendFriendRequest = useFriendsStore((state) => state.sendFriendRequest);
  const sendRequests = useFriendsStore((state) => state.sendRequests);
  const getRequests = useFriendsStore((state) => state.getRequests);

  Confirm.init({
    titleColor: "#008000", // 초록색 (빨간색은 #ff5549, 초록색은 #008000)
    okButtonBackground: "#008000", // 초록색
    cancelButtonBackground: "#a9a9a9", // 회색
    titleFontSize: "20px", // 제목 폰트 크기 증가
    width: "400px", // 대화상자 너비 설정
    messageColor: "#1e1e1e", // 메시지 색상 설정
    messageFontSize: "16px", // 메시지 폰트 크기 설정
    buttonsFontSize: "14px", // 버튼 폰트 크기 설정
    borderRadius: "20px",
  });

  const handleAddFriendClick = useCallback(() => {
    Confirm.show(
      "친구 요청",
      `${friend.userNickName}님께 친구 요청을 보내시겠소?`,
      "네",
      "아니오",
      () => {
        sendFriendRequest(friend.userId);
      },
      () => {}
    );
  }, [sendFriendRequest, friend.userNickName, friend.userId]);

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
