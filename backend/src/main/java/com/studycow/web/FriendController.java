package com.studycow.web;

import com.studycow.config.jwt.JwtUtil;
import com.studycow.dto.friend.FriendDto;
import com.studycow.dto.friend.FriendRequestDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.friend.FriendService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 *     친구 관리 컨트롤러 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@Tag(name = "Friend", description = "친구 관리")
@RestController
@RequestMapping("/friend")
@CrossOrigin("*")
@RequiredArgsConstructor
public class FriendController {

    private final FriendService friendService;
    //private final JwtUtil jwtUtil;

    @Operation(
            summary = "친구 요청 승인",
            description = "친구 요청 승인하여 친구 관계를 추가하며, 요청을 삭제합니다.")
    @PostMapping("/accept/{friendRequestId}")
    public ResponseEntity<?> acceptFriend(@PathVariable("friendRequestId") int friendRequestId) {
        try {
            friendService.acceptFriendRequest(friendRequestId);
            return new ResponseEntity<>("친구 요청 승인 성공", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("친구 요청 승인 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            summary = "친구 목록 조회",
            description = "나와 맺은 친구 목록을 조회합니다. <br> " +
                    "친구의 id번호, 닉네임, 이메일, 프로필사진, 친구시작일시를 반환합니다. <br>" +
                    "닉네임 검색어, 정렬 기준, 정렬 방향을 설정할 수 있고, null일 경우 전체 조회합니다.")
    @GetMapping("/list")
    public ResponseEntity<?> listFriends(
            @ModelAttribute ListOptionDto listOptionDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            //사용자 정보 가져오기
            int userId = userDetails.getUser().getUserId();

            List<FriendDto> friendList = friendService.listFriends(userId, listOptionDto);
            return ResponseEntity.ok(friendList);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("친구 목록 조회 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "친구 요청 전송", description = "친구 요청을 저장합니다.<br> toUserId 전달")
    @PostMapping("/request")
    public ResponseEntity<?> sendFriendRequest(
            @RequestBody Map<String, Integer> requestBody,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            //사용자 정보 가져오기
            int fromUserId = userDetails.getUser().getUserId();

            //RequestBody 맵에서 회원 번호 가져오기
            int toUserId = requestBody.get("toUserId");

            friendService.saveFriendRequest(fromUserId, toUserId);
            return new ResponseEntity<>("친구 요청 전송 성공", HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("친구 요청 전송 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "친구 요청 받은 목록", description = "받은 친구 요청 목록을 조회합니다.")
    @GetMapping("/request/received")
    public ResponseEntity<?> receivedFriendRequests(
            @ModelAttribute ListOptionDto listOptionDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            //사용자 정보 가져오기
            int userId = userDetails.getUser().getUserId();

            List<FriendRequestDto> friendRequestDtoList = friendService.listFriendRequestReceived(userId, listOptionDto);
            return ResponseEntity.ok(friendRequestDtoList);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("받은 친구 요청 목록 조회 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "친구 요청 보낸 목록", description = "보낸 친구 요청 목록을 조회합니다.")
    @GetMapping("/request/sent")
    public ResponseEntity<?> sentFriendRequests(
            @ModelAttribute ListOptionDto listOptionDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            //사용자 정보 가져오기
            int userId = userDetails.getUser().getUserId();
            List<FriendRequestDto> friendRequestDtoList = friendService.listFriendRequestSent(userId, listOptionDto);
            return ResponseEntity.ok(friendRequestDtoList);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("보낸 친구 요청 목록 조회 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "친구 요청 취소", description = "보낸 친구 요청을 삭제합니다.")
    @DeleteMapping("/request/cancel/{friendRequestId}")
    public ResponseEntity<?> cancelFriendRequest(@PathVariable("friendRequestId") int friendRequestId) {
        try {
            friendService.deleteFriendRequest(friendRequestId);
            return new ResponseEntity<>("친구 요청 취소 성공", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("친구 요청 취소 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "친구 해제", description = "친구 관계를 삭제합니다.")
    @DeleteMapping("/{friendUserId}")
    public ResponseEntity<?> cancelFriend(@PathVariable("friendUserId") int friendUserId) {
        try {
            //토큰에서 사용자 정보 가져오기
            CustomUserDetails customUserDetails = (CustomUserDetails) SecurityContextHolder
                    .getContext()
                    .getAuthentication()
                    .getPrincipal();

            int userId = customUserDetails.getUser().getUserId();

            friendService.deleteFriend(friendUserId, userId);
            return new ResponseEntity<>("친구 해제 성공", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("친구 해제 실패", HttpStatus.BAD_REQUEST);
        }
    }

}
