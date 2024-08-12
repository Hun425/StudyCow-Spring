import "./styles/GetRequestList.css";
import { useEffect } from "react";
import useFriendsStore from "../../stores/friends";
import GetRequestItem from "./GetRequestItem";

const GetRequestList = () => {
  const { getRequests, fetchGetRequests } = useFriendsStore();

  useEffect(() => {
    fetchGetRequests();
  }, [fetchGetRequests]);

  return (
    <div>
      <p className="FriendsTitle">받은 친구 요청 목록</p>
      <div className="listBox01">
        {getRequests.length > 0 ? (
          getRequests.map((getRequest) => (
            <GetRequestItem
              key={getRequest.id}
              requestId={getRequest.id}
              nickname={getRequest.counterpartUserNickname}
              thumbnail={getRequest.counterpartUserThumb}
            />
          ))
        ) : (
          <p className="NoFriendsRequest">받은 친구 요청이 없소!</p>
        )}
      </div>
    </div>
  );
};

export default GetRequestList;
