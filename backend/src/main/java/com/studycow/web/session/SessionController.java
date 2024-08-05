package com.studycow.web.session;


import com.studycow.dto.session.StudyRoomLogDto;
import com.studycow.dto.session.SessionRankDto;
import com.studycow.dto.session.LogRequestDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.session.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *     방 세션 컨트롤러 클래스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

@Tag(name = "Session", description = "방 내부 세션 활동")
@RestController
@RequestMapping("/session")
@CrossOrigin("*")
@RequiredArgsConstructor
public class SessionController {

    private final SessionService sessionService;

    @Operation(summary = "방 입장", description="방에 입장하여 세션id를 부여받고 금일 방에서 공부한 시간을 받습니다.")
    @PostMapping("/enter/{roomId}")
    public ResponseEntity<?> enterRoom(
            @PathVariable Long roomId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            int userId = userDetails.getUser().getUserId();
            StudyRoomLogDto studyRoomLogDto = sessionService.enterRoom(roomId, userId);
            return ResponseEntity.ok(studyRoomLogDto);

        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("방 입장 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "방 퇴장", description="방에서 퇴장하여 지금까지 공부한 시간 및 퇴장시간을 갱신합니다.")
    @PatchMapping("/exit")
    public ResponseEntity<?> exitRoom(
            @RequestBody @Valid LogRequestDto logRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            int userId = userDetails.getUser().getUserId();
            StudyRoomLogDto studyRoomLogDto = sessionService.exitRoom(logRequestDto, userId);
            return ResponseEntity.ok(studyRoomLogDto);

        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("방 입장 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "공부시간 갱신", description="현 세션에서 지금까지 공부한 시간을 갱신합니다.")
    @PatchMapping("/record")
    public ResponseEntity<?> modifyStudyTime(
            @RequestBody @Valid LogRequestDto logRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            int userId = userDetails.getUser().getUserId();
            StudyRoomLogDto studyRoomLogDto = sessionService.modifyStudyTime(logRequestDto, userId);
            return ResponseEntity.ok(studyRoomLogDto);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("시간 갱신 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "랭크 조회", description="현재 방의 공부시간 랭킹을 조회합니다.")
    @GetMapping("/rank/{roomId}")
    public ResponseEntity<?> roomRank(
            @PathVariable Long roomId,
            @RequestParam LocalDate studyDate,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            //int userId = userDetails.getUser().getUserId();
            List<SessionRankDto> rankDtoList = sessionService.roomRank(roomId, studyDate);
            return ResponseEntity.ok(rankDtoList);

        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("방 입장 실패", HttpStatus.BAD_REQUEST);
        }
    }
}
