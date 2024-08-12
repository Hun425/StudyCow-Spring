import "./styles/FriendList.css";
import React, { useEffect } from "react";
import useFriendsStore from "../../stores/friends";
import FriendItem from "./FriendItem";

const FriendList = () => {
  const { friends, fetchFriends, removeFriend } = useFriendsStore();

  useEffect(() => {
    fetchFriends();
  }, [fetchFriends]);

  return (
    <div>
      <p className="FriendsTitle">친구 목록</p>
      <div className="friendListBox">
        {friends.length > 0 ? (
          friends.map((friend) => (
            <FriendItem
              key={friend.friendUserId}
              userId={friend.friendUserId}
              nickname={friend.friendNickname}
              thumbnail={friend.friendThumb}
              onDelete={removeFriend}
            />
          ))
        ) : (
          <p className="NoAddFriend">아직 추가한 친구가 없소!</p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
