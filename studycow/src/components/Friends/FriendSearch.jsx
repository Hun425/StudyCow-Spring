import "./styles/FriendSearch.css";
import useFriendsStore from "../../stores/friends";
import SearchedItem from "./SearchedItem";

const FriendSearch = () => {
  const {
    searchedNickname,
    searchedFriends,
    setSearchedNickname,
    fetchSearchedFriends,
  } = useFriendsStore();

  const handleSearchInputChange = (event) => {
    setSearchedNickname(event.target.value);
  };

  const handleSearchClick = async () => {
    await fetchSearchedFriends(searchedNickname);
    setSearchedNickname("");
  };

  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      await handleSearchClick();
    }
  };

  return (
    <div>
      <p className="FriendsTitle">친구 검색</p>
      <div className="searchBox">
        <div className="searchBar">
          <input
            className="searchInput"
            type="text"
            placeholder="검색하고자 하는 친구의 이름을 입력하세요."
            value={searchedNickname}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className="searchBtn" onClick={handleSearchClick}>
            찾아보기
          </button>
        </div>
        <div className="friendsList">
          {searchedFriends.length > 0 ? (
            searchedFriends.map((searchedFriend, index) => (
              <SearchedItem key={index} friend={searchedFriend} />
            ))
          ) : (
            <p className="NoFriendAlarm">아직 등록된 친구가 없소!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FriendSearch;
