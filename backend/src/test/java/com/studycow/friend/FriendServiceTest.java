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

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;


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

    private int userId1;
    private int userId2;
    private int userId3;

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
        userId1 = userService.register(registerRequestDto).getUserId();

        registerRequestDto = new RegisterRequestDto();
        registerRequestDto.setUserEmail("test2@mail.com");
        registerRequestDto.setUserPassword("testPass2");
        registerRequestDto.setUserNickName("testNick2");
        registerRequestDto.setUserPublic(1);
        userId2 = userService.register(registerRequestDto).getUserId();

        registerRequestDto = new RegisterRequestDto();
        registerRequestDto.setUserEmail("test3@mail.com");
        registerRequestDto.setUserPassword("testPass3");
        registerRequestDto.setUserNickName("testNick3");
        registerRequestDto.setUserPublic(1);
        userId3 = userService.register(registerRequestDto).getUserId();
    }

    @Test
    void testSendFriendRequest() throws Exception {
        // Given
        int fromUserId = userId1;
        int toUserId = userId2;

        // When
        friendService.saveFriendRequest(fromUserId, toUserId);

        // Then
        List<FriendRequestDto> sentRequests = friendService.listFriendRequestSent(fromUserId, new ListOptionDto());
        assertTrue(sentRequests.stream().anyMatch(request -> request.getCounterpartUserId() == toUserId));
    }

    @Test
    void testListFriendRequestSent() throws Exception {
        // Given
        int fromUserId = userId1;
        int toUserId = userId2;
        ListOptionDto listOptionDto = new ListOptionDto();
        listOptionDto.setSearchText("test");

        // When
        friendService.saveFriendRequest(fromUserId, toUserId);
        List<FriendRequestDto> result = friendService.listFriendRequestSent(fromUserId, listOptionDto);

        // Then
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.stream().allMatch(request -> request.getCounterpartUserNickname().contains("test")));
    }

    @Test
    void testListFriendRequestReceived() throws Exception {
        // Given
        int fromUserId = userId1;
        int toUserId = userId2;
        ListOptionDto listOptionDto = new ListOptionDto();
        listOptionDto.setSearchText("test");

        // When
        friendService.saveFriendRequest(fromUserId, toUserId);
        List<FriendRequestDto> result = friendService.listFriendRequestReceived(toUserId, listOptionDto);

        // Then
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.stream().allMatch(request -> request.getCounterpartUserNickname().contains("test")));
    }

    @Test
    void testAcceptFriendRequest() throws Exception {
        // Given
        int friendRequestId = 1;
        int fromUserId = userId1;
        int toUserId = userId2;

        // When
        friendService.saveFriendRequest(fromUserId, toUserId);
        friendService.acceptFriendRequest(friendService.recentFriendRequestId(), toUserId);

        // Then
        assertFalse(() -> friendRepository.existsFriendRequestById(friendRequestId));
        List<FriendDto> friends = friendRepository.listFriends(fromUserId, new ListOptionDto());
        assertTrue(friends.stream().anyMatch(friend -> friend.getFriendUserId() == toUserId));
    }

    @Test
    void testListFriends() throws Exception {
        // Given
        int fromUserId = userId1;
        int toUserId1 = userId2;
        int toUserId2 = userId3;
        int userId = userId1;
        ListOptionDto listOptionDto = new ListOptionDto();
        listOptionDto.setSearchText("test");
        listOptionDto.setIsDESC(true);

        // When
        friendService.saveFriendRequest(fromUserId, toUserId1);
        friendService.acceptFriendRequest(friendService.recentFriendRequestId(), toUserId1);
        friendService.saveFriendRequest(fromUserId, toUserId2);
        friendService.acceptFriendRequest(friendService.recentFriendRequestId(), toUserId2);
        List<FriendDto> result = friendService.listFriends(userId, listOptionDto);

        // Then
        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.stream().allMatch(friendDto -> friendDto.getFriendNickname().contains("test")));
        assertTrue(result.size() > 1);
        assertTrue(result.get(0).getFriendDate().isAfter(result.get(1).getFriendDate()));
    }

    @Test
    void testCancelFriend() throws Exception {
        // Given
        int fromUserId = userId1;
        int toUserId = userId2;
        int userId = userId1;

        // When
        friendService.saveFriendRequest(fromUserId, toUserId);
        friendService.acceptFriendRequest(friendService.recentFriendRequestId(), toUserId);
        friendService.deleteFriend(toUserId, userId);

        // Then
        List<FriendDto> friends = friendRepository.listFriends(userId, new ListOptionDto());
        assertTrue(friends.stream().noneMatch(friend -> friend.getFriendUserId() == toUserId));
    }

    @Test
    void testCancelFriendRequest() throws Exception {
        // Given
        int fromUserId = userId1;
        int toUserId = userId2;
        int friendRequestId = 1;

        // When
        friendService.saveFriendRequest(fromUserId, toUserId);
        friendService.deleteFriendRequest(friendService.recentFriendRequestId());

        // Then
        assertFalse(friendRepository.existsFriendRequestById(friendRequestId));
    }
}
