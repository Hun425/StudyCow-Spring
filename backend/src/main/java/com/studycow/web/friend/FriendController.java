package com.studycow.web.friend;

import com.studycow.dto.friend.FriendDto;
import com.studycow.dto.friend.FriendRequestDto;
import com.studycow.dto.friend.FriendRequestSendRequestDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.friend.FriendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <pre>
 *     친구 관리 컨트롤러 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17(Eclipse Temurin)
 */
@Tag(name = "Friend", description = "친구 관리")
@RestController
@RequestMapping("/friend")
@CrossOrigin("*")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;

    @Operation(
            summary = "친구 요청 승인",
            description = "친구 요청 승인하여 친구 관계를 추가하며, 요청을 삭제합니다.")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/accept/{friendRequestId}")
    public ResponseEntity<?> acceptFriend(
            @PathVariable("friendRequestId") int friendRequestId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws Exception {
        //회원 정보
        int userId = userDetails.getUser().getUserId();

        friendService.acceptFriendRequest(friendRequestId, userId);
        return new ResponseEntity<>("친구 요청 승인 성공", HttpStatus.OK);
    }

    @Operation(
            summary = "친구 목록 조회",
            description = "나와 맺은 친구 목록을 조회합니다. <br> " +
                    "친구의 id번호, 닉네임, 이메일, 프로필사진, 친구시작일시를 반환합니다. <br>" +
                    "닉네임 검색어, 정렬 기준, 정렬 방향을 설정할 수 있고, null일 경우 전체 조회합니다.")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/list")
    public ResponseEntity<?> listFriends(
            @ModelAttribute ListOptionDto listOptionDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws Exception {
        //사용자 정보 가져오기
        int userId = userDetails.getUser().getUserId();

        List<FriendDto> friendList = friendService.listFriends(userId, listOptionDto);
        return ResponseEntity.ok(friendList);
    }

    @Operation(summary = "친구 요청 전송", description = "친구 요청을 저장합니다.<br> toUserId 전달")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(
            @RequestBody @Valid FriendRequestSendRequestDto friendRequestSendRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws Exception {
        //사용자 정보 가져오기
        int fromUserId = userDetails.getUser().getUserId();

        friendService.saveFriendRequest(fromUserId, friendRequestSendRequestDto.getToUserId());
        return new ResponseEntity<>("친구 요청 전송 성공", HttpStatus.OK);
    }

    @Operation(summary = "친구 요청 받은 목록", description = "받은 친구 요청 목록을 조회합니다.")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/request/received")
    public ResponseEntity<?> receivedFriendRequests(
            @ModelAttribute ListOptionDto listOptionDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws Exception {
        //사용자 정보 가져오기
        int userId = userDetails.getUser().getUserId();

        List<FriendRequestDto> friendRequestDtoList = friendService.listFriendRequestReceived(userId, listOptionDto);
        return ResponseEntity.ok(friendRequestDtoList);
    }

    @Operation(summary = "친구 요청 보낸 목록", description = "보낸 친구 요청 목록을 조회합니다.")
    @GetMapping("/request/sent")
    public ResponseEntity<?> sentFriendRequests(
            @ModelAttribute ListOptionDto listOptionDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws Exception {
        //사용자 정보 가져오기
        int userId = userDetails.getUser().getUserId();

        List<FriendRequestDto> friendRequestDtoList = friendService.listFriendRequestSent(userId, listOptionDto);
        return ResponseEntity.ok(friendRequestDtoList);
    }

    @Operation(summary = "친구 요청 삭제", description = "보내거나 받은 친구 요청을 삭제합니다.")
    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/request/cancel/{friendRequestId}")
    public ResponseEntity<?> cancelFriendRequest(@PathVariable("friendRequestId") int friendRequestId) throws Exception {
        friendService.deleteFriendRequest(friendRequestId);
        return new ResponseEntity<>("친구 요청 삭제 성공", HttpStatus.OK);
    }

    @Operation(summary = "친구 해제", description = "친구 관계를 삭제합니다.")
    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/{friendUserId}")
    public ResponseEntity<?> cancelFriend(@PathVariable("friendUserId") int friendUserId) throws Exception {
        //토큰에서 사용자 정보 가져오기
        CustomUserDetails customUserDetails = (CustomUserDetails) SecurityContextHolder
                .getContext()
                .getAuthentication()
                .getPrincipal();

        int userId = customUserDetails.getUser().getUserId();

        friendService.deleteFriend(friendUserId, userId);
        return new ResponseEntity<>("친구 해제 성공", HttpStatus.OK);
    }

}
