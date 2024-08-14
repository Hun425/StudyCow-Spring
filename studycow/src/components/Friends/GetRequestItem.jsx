import "./styles/GetRequestItem.css";
import { useCallback } from "react";
import useFriendsStore from "../../stores/friends";
import { Confirm } from "notiflix/build/notiflix-confirm-aio";

const GetRequestItem = ({ requestId, nickname, thumbnail }) => {
  const acceptGetRequest = useFriendsStore((state) => state.acceptGetRequest);

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

  const handleGetAccept = useCallback(() => {
    Confirm.show(
      "친구 요청 수락",
      `${nickname}님의 친구 요청을 수락하시겠소?`,
      "네",
      "아니오",
      () => {
        acceptGetRequest(requestId);
      },
      () => {}
    );
  }, [acceptGetRequest, nickname, requestId]);

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
