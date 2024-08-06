package com.studycow.web.planner;

import com.studycow.dto.plan.PlanCountByDateDto;
import com.studycow.dto.plan.PlannerCreateDto;
import com.studycow.dto.plan.PlannerGetDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.planner.PlannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.checkerframework.checker.units.qual.A;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import retrofit2.http.Path;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *     플래너 관리 컨트롤러 클래스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@RestController
@RequiredArgsConstructor
@RequestMapping("/planner")
@Tag(name = "Planner", description = "플래너 기본 기능")
public class PlannerController {

    private final PlannerService plannerService;

    @Operation(summary = "플래너 생성", description = "해당 유저의 플래너를 추가합니다")
    @PostMapping("create")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<String> createSubjectPlan(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                    @RequestBody @Valid PlannerCreateDto plannerCreateDto) {
        plannerService.createPlan(customUserDetails, plannerCreateDto);
        return ResponseEntity.status(HttpStatus.CREATED).body("등록 성공");
    }

    @Operation(summary = "플래너 일자별 조회", description = "요청한 날짜에 해당하는 플래너들의 목록을 반환합니다")
    @GetMapping("list/day")
    public ResponseEntity<List<PlannerGetDto>> listDayPlan(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                                           @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        int userId = customUserDetails.getUser().getUserId();
        List<PlannerGetDto> plans = plannerService.getPlansByDateForUser(userId, date);
        return ResponseEntity.ok(plans);
    }

    @Operation(summary = "플래너 과목별 조회", description = "요청한 과목에 해당하는 플래너들의 목록을 반환합니다")
    @GetMapping("list/subject")
    public ResponseEntity<List<PlannerGetDto>> listSubjectPlan(@AuthenticationPrincipal CustomUserDetails user,
                                                               @RequestParam int subjectId) {
        int userId = user.getUser().getUserId();
        List<PlannerGetDto> plans = plannerService.getPlansBySubjectForUser(userId, subjectId);
        return ResponseEntity.ok(plans);
    }

    @Operation(summary = "플래너 월 및 일자별 기준 개수 조회", description = "선택한 월의 플래너 일자별 개수를 출력합니다.")
    @GetMapping("grass/{year}/{month}")
    public ResponseEntity<List<PlanCountByDateDto>> grassPlan(@AuthenticationPrincipal CustomUserDetails user,
                                                              @PathVariable int year,
                                                              @PathVariable int month) {
        List<PlanCountByDateDto> grass = plannerService.getPlanCountByDateForUser(month, year, user.getUser().getUserId());
        return ResponseEntity.ok(grass);
    }

    @Operation(summary = "플래너 상세 조회", description = "선택한 플래너의 상세 정보를 출력합니다")
    @GetMapping("{planId}")
    public ResponseEntity<PlannerGetDto> getPlan(@AuthenticationPrincipal CustomUserDetails user,
                                                 @PathVariable int planId) {
        int userId = user.getUser().getUserId();
        PlannerGetDto plan = plannerService.getPlanByIdForUser(userId, planId);
        return ResponseEntity.ok(plan);
    }

    @Operation(summary = "플래너 수정", description = "선택한 플래너의 상세 정보를 수정합니다.")
    @PatchMapping("{planId}")
    public ResponseEntity<String> updatePlan(@AuthenticationPrincipal CustomUserDetails user,
                                             @PathVariable int planId,
                                             @RequestBody @Valid PlannerCreateDto plannerCreateDto) {
        plannerService.updatePlan(planId, user, plannerCreateDto);
        return ResponseEntity.ok("업데이트 성공");
    }

    @Operation(summary = "플래너 삭제", description = "선택한 플래너를 삭제합니다")
    @DeleteMapping("{planId}")
    public ResponseEntity<String> deletePlan(@AuthenticationPrincipal CustomUserDetails user,
                                             @PathVariable int planId) {
        plannerService.deletePlan(planId, user);
        return ResponseEntity.ok("삭제 성공");
    }

    @Operation(summary = "플래너 상태 변경", description = "완료인 플래너는 미완료, 미완료인 플래너는 완료처리합니다.")
    @PostMapping("{planId")
    public ResponseEntity<String> changePlanStatus(@AuthenticationPrincipal CustomUserDetails user,
                                                   @PathVariable int planId){
        plannerService.changePlanStatus(planId, user);
        return ResponseEntity.ok("상태 변경 성공");
    }
}