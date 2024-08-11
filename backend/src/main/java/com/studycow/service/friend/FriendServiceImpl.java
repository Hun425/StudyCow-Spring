package com.studycow.service.friend;

import com.studycow.domain.FriendRequest;
import com.studycow.dto.friend.FriendDto;
import com.studycow.dto.friend.FriendRequestDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import com.studycow.repository.friend.FriendRepository;
import com.studycow.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;


/**
 * <pre>
 *      친구 관리 서비스 구현 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Service
public class FriendServiceImpl implements FriendService {
    private final FriendRepository friendRepository;
    private final UserRepository userRepository;

    /**
     * 친구 맺은 목록 조회
     *
     * @param userId 내 회원 ID
     * @return FriendDto 리스트
     * @throws Exception
     */
    @Override
    public List<FriendDto> listFriends(int userId, ListOptionDto listOptionDto) throws Exception {
        return friendRepository.listFriends(userId, listOptionDto);
    }

    /**
     * 친구 요청 승인
     *
     * @param friendRequestId 친구 요청 번호
     * @throws Exception
     */
    @Transactional
    @Override
    public void acceptFriendRequest(int friendRequestId, int userId) throws Exception {
        // 친구 요청 존재 여부 검증
        if(!friendRepository.existsFriendRequestById(friendRequestId)) {
            throw new CustomException(ErrorCode.NOT_FOUND_FRIEND_REQUEST);
        }

        // 승인 권한 검증
        if(!friendRepository.isToUser(friendRequestId, userId)) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ACCEPT_FRIEND);
        }

        // 친구 관계 저장 및 요청 삭제
        friendRepository.acceptFriendRequest(friendRequestId, userId);
    }

    /**
     * 보낸 친구 요청 삭제
     *
     * @param friendRequestId 친구 요청 번호
     * @throws Exception
     */
    @Transactional
    @Override
    public void deleteFriendRequest(int friendRequestId) throws Exception {
        // 친구 요청 존재 여부 검증
        if(!friendRepository.existsFriendRequestById(friendRequestId)) {
            throw new CustomException(ErrorCode.NOT_FOUND_FRIEND_REQUEST);
        }

        friendRepository.deleteFriendRequest(friendRequestId);
    }

    /**
     * 친구 요청 저장
     *
     * @param fromUserId 보내는 회원 번호
     * @param toUserId   받는 회원 번호
     * @throws Exception
     */
    @Transactional
    @Override
    public void saveFriendRequest(int fromUserId, int toUserId) throws Exception {
        // 요청 검증
        if(fromUserId == toUserId) {
            throw new CustomException(ErrorCode.SAME_FROM_TO);
        }

        // 요청 회원 검증
        userRepository.findById((long) fromUserId)
                .orElseThrow(() -> new CustomException(ErrorCode.FROM_USER_NOT_FOUND));
        // 받는 회원 검증
        userRepository.findById((long) toUserId)
                .orElseThrow(() -> new CustomException(ErrorCode.TO_USER_NOT_FOUND));
        //친구 관계 존재 여부 검증
        if(friendRepository.existsFriend(fromUserId,toUserId)) {
            throw new CustomException(ErrorCode.DUPLICATE_FRIEND);
        }
        //친구 요청 중복 검증
        if(friendRepository.existsFriendRequest(fromUserId, toUserId)) {
            throw new CustomException(ErrorCode.DUPLICATE_FRIEND_REQUEST);
        }

        // 요청 전송
        friendRepository.saveFriendRequest(fromUserId, toUserId);
    }

    /**
     * 최근 저장된 friendRequest 조회
     *
     * @return
     */
    @Override
    public int recentFriendRequestId() throws Exception {
        return friendRepository.recentFriendRequestId();
    }

    /**
     * 받은 친구 요청 목록 조회
     *
     * @return FriendRequestDto 리스트
     * @throws Exception
     */
    public List<FriendRequestDto> listFriendRequestReceived(int userId, ListOptionDto listOptionDto) throws Exception {
        List<FriendRequest> friendRequestList = friendRepository.listFriendRequestReceived(userId, listOptionDto);

        return friendRequestList
                .stream()
                .map(friendRequest -> new FriendRequestDto(
                        friendRequest.getId(),
                        friendRequest.getFromUser().getId(),
                        friendRequest.getFromUser().getUserNickname(),
                        friendRequest.getFromUser().getUserThumb(),
                        friendRequest.getRequestStatus(),
                        friendRequest.getRequestDate(),
                        friendRequest.getRequestUpdateDate()
                ))
                .toList();
    }

    /**
     * 보낸 친구 요청 목록 조회
     *
     * @return FriendRequestDto 리스트
     * @throws Exception
     */
    public List<FriendRequestDto> listFriendRequestSent(int userId, ListOptionDto listOptionDto) throws Exception {
        List<FriendRequest> friendRequestList = friendRepository.listFriendRequestSent(userId, listOptionDto);

        return friendRequestList
                .stream()
                .map(friendRequest -> new FriendRequestDto(
                        friendRequest.getId(),
                        friendRequest.getToUser().getId(),
                        friendRequest.getToUser().getUserNickname(),
                        friendRequest.getToUser().getUserThumb(),
                        friendRequest.getRequestStatus(),
                        friendRequest.getRequestDate(),
                        friendRequest.getRequestUpdateDate()
                ))
                .toList();
    }

    /**
     * 친구 삭제
     *
     * @param friendUserId
     * @param userId
     * @throws Exception
     */
    @Transactional
    @Override
    public void deleteFriend(int friendUserId, int userId) throws Exception {
        //친구 관계 존재 여부 검증
        if(!friendRepository.existsFriend(friendUserId,userId)) {
            throw new CustomException(ErrorCode.NOT_FOUND_FRIEND);
        }

        friendRepository.deleteFriend(friendUserId, userId);
    }

}
