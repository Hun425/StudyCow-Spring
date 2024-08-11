package com.studycow.friend;

import com.studycow.domain.UserGrade;
import com.studycow.dto.friend.FriendDto;
import com.studycow.dto.friend.FriendRequestDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.user.RegisterRequestDto;
import com.studycow.repository.friend.FriendRepository;
import com.studycow.service.friend.FriendService;
import com.studycow.repository.user.UserGradeRepository;
import com.studycow.service.user.UserService;
import com.studycow.web.friend.FriendController;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * 친구 관리 테스트 클래스
 *
 * @author 박봉균
 * @since JDK17(Eclipse Temurin)
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class FriendServiceTest {
    @Autowired
    private FriendController friendController;
    @Autowired
    private FriendService friendService;
    @Autowired
    private FriendRepository friendRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private UserGradeRepository userGradeRepository;

    private List<Integer> userIdList = new ArrayList<>();

    @BeforeEach
    void setUp() {
        // 테스트용 UserGrade 생성
        UserGrade userGrade = new UserGrade(1, "Beginner", 0, 100);
        userGradeRepository.save(userGrade);

        // 회원 검증 위한 회원 생성
        RegisterRequestDto registerRequestDto = new RegisterRequestDto();
        registerRequestDto.setUserEmail("test1@mail.com");
        registerRequestDto.setUserPassword("testPass");
        registerRequestDto.setUserNickName("testNick");
        registerRequestDto.setUserPublic(1);
        userIdList.add(userService.register(registerRequestDto).getUserId());

        registerRequestDto = new RegisterRequestDto();
        registerRequestDto.setUserEmail("test2@mail.com");
        registerRequestDto.setUserPassword("testPass2");
        registerRequestDto.setUserNickName("testNick2");
        registerRequestDto.setUserPublic(1);
        userIdList.add(userService.register(registerRequestDto).getUserId());

        registerRequestDto = new RegisterRequestDto();
        registerRequestDto.setUserEmail("test3@mail.com");
        registerRequestDto.setUserPassword("testPass3");
        registerRequestDto.setUserNickName("testNick3");
        registerRequestDto.setUserPublic(1);
        userIdList.add(userService.register(registerRequestDto).getUserId());
    }


    /**
     * 친구 요청 전송 테스트
     *
     * @throws Exception
     */
    @Test
    void testSendFriendRequest() throws Exception {
        // GIVEN
        int fromUserId = userIdList.get(0);
        int toUserId = userIdList.get(1);

        // WHEN
        friendService.saveFriendRequest(fromUserId, toUserId);

        // THEN
        List<FriendRequestDto> sentRequests = friendService.listFriendRequestSent(fromUserId, new ListOptionDto());
        assertTrue(sentRequests.stream().anyMatch(request -> request.getCounterpartUserId() == toUserId));
    }

    /**
     * 보낸 친구 요청 목록 조회 테스트
     *
     * @throws Exception
     */
    @Test
    void testListFriendRequestSent() throws Exception {
        // GIVEN
        int fromUserId = userIdList.get(0);
        int toUserId = userIdList.get(1);
        ListOptionDto listOptionDto = new ListOptionDto();
        listOptionDto.setSearchText("test");

        // WHEN
        friendService.saveFriendRequest(fromUserId, toUserId);
        List<FriendRequestDto> result = friendService.listFriendRequestSent(fromUserId, listOptionDto);

        // THEN
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.stream().allMatch(request -> request.getCounterpartUserNickname().contains("test")));
    }

    /**
     * 받은 친구 요청 목록 조회 테스트
     *
     * @throws Exception
     */
    @Test
    void testListFriendRequestReceived() throws Exception {
        // GIVEN
        int fromUserId = userIdList.get(0);
        int toUserId = userIdList.get(1);
        ListOptionDto listOptionDto = new ListOptionDto();
        listOptionDto.setSearchText("test");

        // WHEN
        friendService.saveFriendRequest(fromUserId, toUserId);
        List<FriendRequestDto> result = friendService.listFriendRequestReceived(toUserId, listOptionDto);

        // THEN
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.stream().allMatch(request -> request.getCounterpartUserNickname().contains("test")));
    }

    /**
     * 친구 요청 승인 테스트
     *
     * @throws Exception
     */
    @Test
    void testAcceptFriendRequest() throws Exception {
        // GIVEN
        int friendRequestId = 1;
        int fromUserId = userIdList.get(0);
        int toUserId = userIdList.get(1);

        // WHEN
        friendService.saveFriendRequest(fromUserId, toUserId);
        friendService.acceptFriendRequest(friendService.recentFriendRequestId(), toUserId);

        // THEN
        assertFalse(() -> friendRepository.existsFriendRequestById(friendRequestId));
        List<FriendDto> friends = friendRepository.listFriends(fromUserId, new ListOptionDto());
        assertTrue(friends.stream().anyMatch(friend -> friend.getFriendUserId() == toUserId));
    }

    /**
     * 친구 목록 조회 테스트
     *
     * @throws Exception
     */
    @Test
    void testListFriends() throws Exception {
        // GIVEN
        int fromUserId = userIdList.get(0);
        int toUserId1 = userIdList.get(1);
        int toUserId2 = userIdList.get(2);
        int userId = userIdList.get(0);
        ListOptionDto listOptionDto = new ListOptionDto();
        listOptionDto.setSearchText("test");
        listOptionDto.setIsDESC(true);

        // WHEN
        friendService.saveFriendRequest(fromUserId, toUserId1);
        friendService.acceptFriendRequest(friendService.recentFriendRequestId(), toUserId1);
        friendService.saveFriendRequest(fromUserId, toUserId2);
        friendService.acceptFriendRequest(friendService.recentFriendRequestId(), toUserId2);
        List<FriendDto> result = friendService.listFriends(userId, listOptionDto);

        // THEN
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.stream().allMatch(friendDto -> friendDto.getFriendNickname().contains("test")));
        assertTrue(result.size() > 1);
        assertTrue(result.get(0).getFriendDate().isAfter(result.get(1).getFriendDate()));
    }

    /**
     * 친구 해제 테스트
     *
     * @throws Exception
     */
    @Test
    void testCancelFriend() throws Exception {
        // GIVEN
        int fromUserId = userIdList.get(0);
        int toUserId = userIdList.get(1);
        int userId = userIdList.get(0);

        // WHEN
        friendService.saveFriendRequest(fromUserId, toUserId);
        friendService.acceptFriendRequest(friendService.recentFriendRequestId(), toUserId);
        friendService.deleteFriend(toUserId, userId);

        // THEN
        List<FriendDto> friends = friendRepository.listFriends(userId, new ListOptionDto());
        assertTrue(friends.stream().noneMatch(friend -> friend.getFriendUserId() == toUserId));
    }

    /**
     * 친구 요청 삭제 테스트
     *
     * @throws Exception
     */
    @Test
    void testCancelFriendRequest() throws Exception {
        // GIVEN
        int fromUserId = userIdList.get(0);
        int toUserId = userIdList.get(1);
        int friendRequestId = 1;

        // WHEN
        friendService.saveFriendRequest(fromUserId, toUserId);
        friendService.deleteFriendRequest(friendService.recentFriendRequestId());

        // THEN
        assertFalse(friendRepository.existsFriendRequestById(friendRequestId));
    }
}
