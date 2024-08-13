import "./styles/SendRequestItem.css";
import useFriendsStore from "../../stores/friends";
import { useCallback } from "react";
import { Confirm } from "notiflix"; // Notiflix import 추가

const SendRequestItem = ({ requestId, nickname, thumbnail }) => {
  const cancelSendRequest = useFriendsStore((state) => state.cancelSendRequest);

  // Notiflix 설정 수정
  Confirm.init({
    titleColor: "#ff5549", // 빨간색 (빨간색은 #ff5549, 초록색은 #008000)
    okButtonBackground: "#ff5549", // 빨간색
    cancelButtonBackground: "#a9a9a9", // 회색
    titleFontSize: "20px", // 제목 폰트 크기 증가
    width: "400px", // 대화상자 너비 설정
    messageColor: "#1e1e1e", // 메시지 색상 설정
    messageFontSize: "16px", // 메시지 폰트 크기 설정
    buttonsFontSize: "14px", // 버튼 폰트 크기 설정
    borderRadius: "20px",
  });

  const handleSendCancel = useCallback(() => {
    // Notiflix Confirm 사용
    Confirm.show(
      "친구 요청 취소",
      `${nickname}님께 보낸 친구 요청을 취소하시겠소?`,
      "네",
      "아니오",
      () => {
        cancelSendRequest(requestId);
      },
      () => {
        // 취소 시 아무 작업도 하지 않음
      }
    );
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
