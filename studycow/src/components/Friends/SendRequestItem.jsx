import "./styles/SendRequestItem.css";
import useFriendsStore from "../../stores/friends";
import { useCallback } from "react";

const SendRequestItem = ({ requestId, nickname, thumbnail }) => {
  const cancelSendRequest = useFriendsStore((state) => state.cancelSendRequest);

  const handleSendCancel = useCallback(() => {
    const isConfirmed = window.confirm(
      `${nickname}님께 보낸 친구 요청을 취소하시겠습니까?`
    );
    if (isConfirmed) {
      cancelSendRequest(requestId);
    }
  }, [cancelSendRequest, requestId, nickname]);

  return (
    <div className="sendRequestItem">
      <div className="sendRequestInfo">
        <img
          src={thumbnail}
          alt={`${nickname}의 썸네일`}
          className="sendRequestThumbnail"
        />
        <p className="sendRequestNickname">{nickname}</p>
      </div>
      <div>
        <button className="sendCancel" onClick={handleSendCancel}>
          ➖
        </button>
      </div>
    </div>
  );
};

export default SendRequestItem;
