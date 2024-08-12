import "./styles/GetRequestItem.css";
import { useCallback } from "react";
import useFriendsStore from "../../stores/friends";

const GetRequestItem = ({ requestId, nickname, thumbnail }) => {
  const acceptGetRequest = useFriendsStore((state) => state.acceptGetRequest);

  const handleGetAccept = useCallback(() => {
    const isConfirmed = window.confirm(
      `${nickname}님의 친구 요청을 수락하시겠습니까?`
    );
    if (isConfirmed) {
      acceptGetRequest(requestId);
    }
  }, [acceptGetRequest, requestId, nickname]);

  return (
    <div className="getRequestItem">
      <div className="getRequestInfo">
        <img
          src={thumbnail}
          alt={`${nickname}의 썸네일`}
          className="getRequestThumbnail"
        />
        <p className="getRequestNickname">{nickname}</p>
      </div>
      <div>
        <button className="getAccept" onClick={handleGetAccept}>
          ➕
        </button>
      </div>
    </div>
  );
};

export default GetRequestItem;
