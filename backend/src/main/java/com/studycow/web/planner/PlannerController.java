package com.studycow.web.planner;

import com.studycow.dto.plan.PlannerCreateDto;
import com.studycow.dto.plan.PlannerGetDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.planner.PlannerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
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
@CrossOrigin("*")
@Tag(name = "Planner", description = "플래너 기본 기능")
public class PlannerController {

    private final PlannerService plannerService;


    @Operation(summary = "플래너 생성", description = "해당 유저의 플래너를 추가합니다")
    @PostMapping("create")
    public ResponseEntity<?> createSubjectPlan(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                               @RequestBody @Valid PlannerCreateDto plannerCreateDto) {
        try {
            plannerService.createPlan(customUserDetails, plannerCreateDto);
            return new ResponseEntity<>("등록 성공", HttpStatus.CREATED);
        }catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "플래너 일자별 조회", description = "요청한 날짜에 해당하는 플래너들의 목록을 반환합니다 ")
    @GetMapping("list/day")
    public ResponseEntity<?> listDayPlan(@AuthenticationPrincipal CustomUserDetails customUserDetails,
                                         @RequestParam
                                         @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)LocalDate date) {
        try{
            int userId = customUserDetails.getUser().getUserId();
            List<PlannerGetDto> plans = plannerService.getPlansByDateForUser(userId, date);
            return new ResponseEntity<>(plans, HttpStatus.OK);
        }catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }



    }

    @Operation(summary = "플래너 과목별 조회", description = "요청한 과목에 해당하는 플래너들의 목록을 반환합니다")
    @GetMapping("list/subject")
    public ResponseEntity<?> listSubjectPlan(@AuthenticationPrincipal CustomUserDetails user,
                                             @RequestParam int subjectId) {

        try{
            int userId = user.getUser().getUserId();

            List<PlannerGetDto> plans = plannerService.getPlansBySubjectForUser(userId, subjectId);

            return new ResponseEntity<>(plans, HttpStatus.OK);
        }catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }

    }

    @Operation(summary = "플래너 상세 조회", description = "선택한 플래너의 상세 정보를 출력합니다")
    @GetMapping("{planId}")
    public ResponseEntity<?> getPlan(@AuthenticationPrincipal CustomUserDetails user,
                                     @PathVariable int planId) {

        try{
            int userId = user.getUser().getUserId();

            PlannerGetDto plan = plannerService.getPlanByIdForUser(userId,planId);

            return new ResponseEntity<>(plan, HttpStatus.OK);

        }catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "플래너 수정", description = "선택한 플래너의 상세 정보를 수정합니다.")
    @PatchMapping("{planId}")
    public ResponseEntity<?> updatePlan(@AuthenticationPrincipal CustomUserDetails user,
                                        @PathVariable int planId,
                                        @RequestBody PlannerCreateDto plannerCreateDto){
        try{
            int userId = user.getUser().getUserId();

            plannerService.updatePlan(planId,user,plannerCreateDto);

            return new ResponseEntity<>("업데이트 성공", HttpStatus.OK);
        }catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "플래너 삭제", description = "선택한 플래너를 삭제합니다")
    @DeleteMapping("{planId}")
    public ResponseEntity<?> deletePlan(@AuthenticationPrincipal CustomUserDetails user,
                                        @PathVariable int planId) {
        try{
            plannerService.deletePlan(planId, user);
            return new ResponseEntity<>("삭제 성공",HttpStatus.OK);
        }catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(summary = "플랜 자동생성", description = "플랜을 자동으로 생성합니다")
    @GetMapping("{planId}")
    public ResponseEntity<?> autoPlan(@AuthenticationPrincipal CustomUserDetails user,
                                     @PathVariable int planId) {

        try{
            int userId = user.getUser().getUserId();

            PlannerGetDto plan = plannerService.getPlanByIdForUser(userId,planId);

            return new ResponseEntity<>(plan, HttpStatus.OK);

        }catch(Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
}
