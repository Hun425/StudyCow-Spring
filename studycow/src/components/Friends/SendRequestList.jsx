import "./styles/SendRequestList.css";
import { useEffect } from "react";
import useFriendsStore from "../../stores/friends";
import SendRequestItem from "./SendRequestItem";

const SendRequestList = () => {
  const { sendRequests, fetchSendRequests } = useFriendsStore();

  useEffect(() => {
    fetchSendRequests();
  }, [fetchSendRequests]);

  return (
    <div>
      <p className="FriendsTitle">보낸 친구 요청 목록</p>
      <div className="listBox02">
        {sendRequests.length > 0 ? (
          sendRequests.map((sendRequest) => (
            <SendRequestItem
              key={sendRequest.id}
              requestId={sendRequest.id}
              nickname={sendRequest.counterpartUserNickname}
              thumbnail={sendRequest.counterpartUserThumb}
            />
          ))
        ) : (
          <p className="NoSendFriendRequest">보낸 친구 요청이 없소!</p>
        )}
      </div>
    </div>
  );
};

export default SendRequestList;
