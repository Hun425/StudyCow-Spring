package com.studycow.service.planner;

import com.studycow.domain.UserSubjectPlan;
import com.studycow.dto.plan.PlanCountByDateDto;
import com.studycow.dto.plan.PlannerCreateDto;
import com.studycow.dto.plan.PlannerGetDto;
import com.studycow.dto.user.CustomUserDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * 플래너 관리 Service
 * @author 채기훈
 * @since JDK17
 */
public interface PlannerService  {

    /** 플래너 생성 **/
    void createPlan(CustomUserDetails customUserDetails, PlannerCreateDto plannerCreateDto);

    /** 플래너 생성일 기준 조회 **/
    List<PlannerGetDto> getPlansByDateForUser(int userId, LocalDate localDate);

    /** 플래너 과목코드 기준 조회 **/
    List<PlannerGetDto> getPlansBySubjectForUser(int userId, int subjectId);

    /** 플래너 잔디 조회 **/
    List<PlanCountByDateDto> getPlanCountByDateForUser(int month, int year, int userId);

    /** 플래너 기준 상세 정보 조회 **/
    PlannerGetDto getPlanByIdForUser(int userId, int planId);

    /** 플래너 업데이트 **/
    void updatePlan(int planId, CustomUserDetails customUser, PlannerCreateDto plannerCreateDto );

    /** 플래너 삭제 **/
    void deletePlan(int planId, CustomUserDetails customUser);
}
