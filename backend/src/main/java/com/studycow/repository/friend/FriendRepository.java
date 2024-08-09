package com.studycow.repository.friend;

import com.studycow.domain.FriendRequest;
import com.studycow.dto.friend.FriendDto;
import com.studycow.dto.listoption.ListOptionDto;
import jakarta.persistence.PersistenceException;

import java.util.List;

/**
 * <pre>
 *      친구 관리 레포지토리 인터페이스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
public interface FriendRepository {
    /** 친구 맺은 목록 조회 */
    List<FriendDto> listFriends(int userId, ListOptionDto listOptionDto) throws PersistenceException;

    /** 친구 요청 삭제 */
    void deleteFriendRequest(int friendRequestId) throws PersistenceException;

    /** 친구 관계 승인/저장 */
    void acceptFriendRequest(int friendRequestId, int userId) throws PersistenceException;

    /** 친구 요청 전송 */
    void saveFriendRequest(int fromUserId, int toUserId) throws PersistenceException;

    /** 받은 친구 요청 목록 조회 */
    List<FriendRequest> listFriendRequestReceived(int userId, ListOptionDto listOptionDto) throws PersistenceException;

    /** 보낸 친구 요청 목록 조회 */
    List<FriendRequest> listFriendRequestSent(int userId, ListOptionDto listOptionDto) throws PersistenceException;

    /** 친구 삭제 */
    void deleteFriend(int friendUserId, int userId) throws PersistenceException;

    /** 친구 관계 존재 여부 */
    boolean existsFriend(int fromUserId, int toUserId) throws PersistenceException;

    /** 친구 요청 존재 여부 */
    boolean existsFriendRequest(int fromUserId, int toUserId) throws PersistenceException;

    /** 친구 요청 존재 여부(요청번호로 조회) */
    boolean existsFriendRequestById(int friendRequestId) throws PersistenceException;

    /** 친구 요청 승인 권한 검증(받은 유저인지) */
    boolean isToUser(int friendRequestId, int userId) throws PersistenceException;
}
