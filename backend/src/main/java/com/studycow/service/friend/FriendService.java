package com.studycow.service.friend;

import com.studycow.dto.friend.FriendDto;
import com.studycow.dto.friend.FriendRequestDto;
import com.studycow.dto.listoption.ListOptionDto;

import java.util.List;

/**
 * <pre>
 *      친구 관리 서비스 인터페이스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
public interface FriendService {
    /** 친구 맺은 목록 조회 */
    List<FriendDto> listFriends(int userId, ListOptionDto listOptionDto) throws Exception;

    /** 보낸 친구 요청 삭제 */
    void deleteFriendRequest(int friendRequestId) throws Exception;

    /** 친구 요청 승인 */
    void acceptFriendRequest(int friendRequestId, int userId) throws Exception;

    /** 친구 요청 저장 */
    void saveFriendRequest(int fromUserId, int toUserId) throws Exception;

    /** 받은 친구 요청 목록 조회 */
    List<FriendRequestDto> listFriendRequestReceived(int userId, ListOptionDto listOptionDto) throws Exception;

    /** 보낸 친구 요청 목록 조회 */
    List<FriendRequestDto> listFriendRequestSent(int userId, ListOptionDto listOptionDto) throws Exception;

    /** 친구 삭제 */
    void deleteFriend(int friendUserId, int userId) throws Exception;

}
