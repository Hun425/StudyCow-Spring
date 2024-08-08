package com.studycow.web.target;


import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.RequestScoreDto;
import com.studycow.dto.score.ResponseScoreDto;
import com.studycow.dto.score.ScoreDto;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.score.ScoreService;
import com.studycow.service.target.TargetService;
import com.studycow.web.openai.ChatGPTController;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * <pre>
 *     목표 관리 컨트롤러 클래스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

@Tag(name = "Target", description = "목표 관리")
@RestController
@RequestMapping("/target")
@CrossOrigin("*")
@RequiredArgsConstructor
public class TargetController {

    private final TargetService targetService;
    private final ChatGPTController gptController;

    @Operation(summary = "목표 등록", description="목표를 등록합니다.")
    @PostMapping("/regist")
    public ResponseEntity<?> registTarget(
            @RequestBody @Valid RequestTargetDto requestTargetDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )throws Exception {
            int userId = userDetails.getUser().getUserId();
            targetService.saveScoreTarget(requestTargetDto, userId);
            return new ResponseEntity<>("목표 등록 성공", HttpStatus.OK);
    }

    @Operation(summary = "성적 목표 조회", description = "유저의 성적 목표를 조회합니다.")
    @GetMapping("/{userId}")
    public ResponseEntity<?> targetList(
            @PathVariable int userId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )throws Exception {
        int myId = userDetails.getUser().getUserId();
        List<ScoreTargetDto> scoreTargetDtoList = targetService.targetList(userId, myId);
        return ResponseEntity.ok(scoreTargetDtoList);
    }

    @Operation(summary = "성적 목표 삭제", description="성적 목표를 삭제합니다.")
    @DeleteMapping("/{targetId}")
    public ResponseEntity<?> deleteTarget(
            @PathVariable String targetId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )throws Exception {
            int userId = userDetails.getUser().getUserId();
            Long target = Long.parseLong(targetId);
            targetService.deleteTarget(userId, target);
            return new ResponseEntity<>("성적 목표 삭제 성공", HttpStatus.OK);
    }

    @Operation(summary = "목표 수정", description="목표를 수정합니다.")
    @PatchMapping("/modify/{targetId}")
    public ResponseEntity<?> modifyTarget(
            @RequestBody @Valid RequestTargetDto requestTargetDto,
            @PathVariable String targetId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    )throws Exception {
            int userId = userDetails.getUser().getUserId();
            Long target = Long.parseLong(targetId);
            targetService.modifyTarget(requestTargetDto, userId, target);
            return new ResponseEntity<>("목표 수정 성공", HttpStatus.OK);
    }

    @Operation(summary = "미설정 목표 과목 조회", description = "아직 목표로 설정하지 않은 과목들을 조회합니다.")
    @GetMapping("/{userId}/subject")
    public ResponseEntity<?> subjectList(@PathVariable int userId) throws Exception{
            List<SubjectCodeDto> subjectCodeDtoList = targetService.subjectList(userId);
            return ResponseEntity.ok(subjectCodeDtoList);
    }
}
