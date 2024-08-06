package com.studycow.web.score;


import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.score.ScoreService;
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
 *     성적 관리 컨트롤러 클래스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

@Tag(name = "Score", description = "성적 관리")
@RestController
@RequestMapping("/score")
@CrossOrigin("*")
@RequiredArgsConstructor
public class ScoreController {

    private final ScoreService scoreService;
    private final ChatGPTController gptController;

    @Operation(summary = "과목별 성적 조회", description = "등록한 과목별 성적을 조회합니다.")
    @GetMapping("/{userId}/list/{subCode}")
    public ResponseEntity<?> listScore(
            @PathVariable int userId,
            @PathVariable int subCode,
            @RequestParam(value = "limit", required = false) Integer limitCnt,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            int myId = userDetails.getUser().getUserId();
            ResponseScoreDto responseScoreDto = scoreService.listScores(userId, subCode, myId, limitCnt);
            if(myId == userId){
                //responseScoreDto.setAdvice(gptController.scoreAdvice(responseScoreDto));
                responseScoreDto.setAdvice("성적을 분석해 줄수 있어요. 한번 해보실래요?");
            }else{
                responseScoreDto.setAdvice("공부 추천은 내 주인에게만 해줄 수 있어요.");
            }
            return ResponseEntity.ok(responseScoreDto);
        } catch(Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "성적 단일 조회", description = "선택한 성적의 상세 정보를 조회합니다.")
    @GetMapping("/{userId}/detail/{scoreId}")
    public ResponseEntity<?> scoreDetail(
            @PathVariable int userId,
            @PathVariable Long scoreId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            int myId = userDetails.getUser().getUserId();
            ScoreDto scoreDto = scoreService.scoreDetail(scoreId, userId, myId);
            return ResponseEntity.ok(scoreDto);
        } catch(Exception e) {
            //e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "성적 등록", description="성적을 등록합니다.")
    @PostMapping("/regist")
    public ResponseEntity<?> registScore(
            @RequestBody @Valid RequestScoreDto requestScoreDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            int userId = userDetails.getUser().getUserId();
            scoreService.saveScore(requestScoreDto, userId);
            return new ResponseEntity<>("성적 등록 성공", HttpStatus.OK);

        } catch(Exception e) {
            //e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "성적 수정", description="성적을 수정합니다.")
    @PatchMapping("/modify/{scoreId}")
    public ResponseEntity<?> modifyScore(
            @RequestBody @Valid RequestScoreDto requestScoreDto,
            @PathVariable Long scoreId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            int userId = userDetails.getUser().getUserId();
            scoreService.modifyScore(requestScoreDto, userId, scoreId);
            return new ResponseEntity<>("성적 수정 성공", HttpStatus.OK);
        } catch(Exception e) {
            //e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "성적 삭제", description="성적을 삭제합니다.")
    @DeleteMapping("/delete/{scoreId}")
    public ResponseEntity<?> deleteScore(
            @PathVariable Long scoreId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            int userId = userDetails.getUser().getUserId();
            scoreService.deleteScore(userId, scoreId);
            return new ResponseEntity<>("성적 삭제 성공", HttpStatus.OK);

        } catch(Exception e) {
            //e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /*@Operation(summary = "과목 목표별 최근 5개 성적 조회", description = "과목별 최근 5개 성적을 조회합니다.")
    @GetMapping("/{userId}/auto")
    public ResponseEntity<?> recentScores(@PathVariable int userId) {
        try {
            List<ResponseScoreDto> responseScoreDtoList = scoreService.recentScores(userId);
            return ResponseEntity.ok(responseScoreDtoList);
        } catch(Exception e) {
            //e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }*/

    /*@Operation(summary = "최근 n개월간의 성적 통계", description = "최근 n개월간의 성적 통계를 조회합니다.")
    @GetMapping("/{userId}/stats/{months}")
    public ResponseEntity<?> statsScores(
            @PathVariable int userId,
            @PathVariable int months,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            int myId = userDetails.getUser().getUserId();
            List<ResponseStatsDto> responseScoreDtoList = scoreService.scoreStats(userId, myId, months);
            return ResponseEntity.ok(responseScoreDtoList);
        } catch(Exception e) {
            //e.printStackTrace();
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }*/
}
