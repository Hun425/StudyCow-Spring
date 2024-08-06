package com.studycow.repository.planner;

import com.studycow.domain.SubjectCode;
import com.studycow.domain.UserSubjectPlan;
import com.studycow.dto.plan.PlanCountByDateDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

/**
 * 플래너 Repository
 * <pre>
 *     플래너 저장을 위한 Spring Data JPA
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
public interface PlannerRepository extends JpaRepository<UserSubjectPlan,Long> {
    Optional<List<UserSubjectPlan>> findByUserIdAndPlanDate(Long userId, LocalDate planDate);
    Optional<List<UserSubjectPlan>> findByUserIdAndSubCode(Long userId, SubjectCode subCode);
    Optional<UserSubjectPlan> findByUserIdAndPlanId(Long userId, Long planId);

    @Query("SELECT new com.studycow.dto.plan.PlanCountByDateDto(p.planDate, COUNT(p.planId),p.user.id) " +
            "FROM UserSubjectPlan p " +
            "WHERE p.planDate BETWEEN :startDate AND :endDate " +
            "AND p.user.id = :userId " +
            "GROUP BY p.planDate, p.user.id")
    Optional<List<PlanCountByDateDto>> findPlanCountByMonth(@Param("startDate") LocalDate startDate,
                                                  @Param("endDate") LocalDate endDate,
                                                  @Param("userId") int userId);

}
