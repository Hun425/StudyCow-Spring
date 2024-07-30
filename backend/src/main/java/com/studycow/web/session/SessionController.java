package com.studycow.web.session;


import com.studycow.dto.session.EnterRequestDto;
import com.studycow.dto.session.SessionDto;
import com.studycow.dto.session.SessionRequestDto;
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
    @PostMapping("/enter")
    public ResponseEntity<?> enterRoom(
            @RequestBody @Valid EnterRequestDto enterRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            int userId = userDetails.getUser().getUserId();
            SessionDto sessionDto = sessionService.enterRoom(enterRequestDto, userId);
            return ResponseEntity.ok(sessionDto);

        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("방 입장 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "방 퇴장", description="방에서 퇴장하여 지금까지 공부한 시간 및 퇴장시간을 갱신합니다.")
    @PatchMapping("/exit")
    public ResponseEntity<?> exitRoom(
            @RequestBody @Valid SessionRequestDto sessionRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            int userId = userDetails.getUser().getUserId();
            SessionDto sessionDto = sessionService.exitRoom(sessionRequestDto, userId);
            return ResponseEntity.ok(sessionDto);

        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("방 입장 실패", HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "공부시간 갱신", description="현 세션에서 지금까지 공부한 시간을 갱신합니다.")
    @PatchMapping("/record")
    public ResponseEntity<?> modifyStudyTime(
            @RequestBody @Valid SessionRequestDto sessionRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            int userId = userDetails.getUser().getUserId();
            sessionService.modifyStudyTime(sessionRequestDto, userId);
            return new ResponseEntity<>("시간 갱신 성공", HttpStatus.OK);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("시간 갱신 실패", HttpStatus.BAD_REQUEST);
        }
    }
}
