package com.studycow.repository.planner;

import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import static com.studycow.domain.QUserSubjectPlan.userSubjectPlan;

@Repository
@RequiredArgsConstructor
public class PlannerRepositoryCustomImpl implements PlannerRepositoryCustom {

    @PersistenceContext
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;


    /**
     * 플래너 기반 학습한 시간 (planner 임시작성)
     *
     * @param userId : 유저 id
     * @param subCode : 과목 코드
     */
    @Override
    public Integer planStudyTime(int userId, int subCode) throws PersistenceException {
        return queryFactory
                .select(
                        (new CaseBuilder()
                                .when(userSubjectPlan.planStatus.eq(1))
                                .then(userSubjectPlan.planStudyTime)
                                .otherwise(userSubjectPlan.planSumTime)).sum()
                )
                .from(userSubjectPlan)
                .where(userSubjectPlan.user.id.eq(userId)
                        .and(userSubjectPlan.subCode.code.eq(subCode)))
                .fetchOne();
    }
}
