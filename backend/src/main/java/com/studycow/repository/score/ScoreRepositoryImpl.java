package com.studycow.repository.score;

import com.querydsl.core.types.Projections;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.CaseBuilder;
import com.querydsl.jpa.JPAExpressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.studycow.domain.*;
import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import static com.studycow.domain.QSubjectCode.subjectCode;
import static com.studycow.domain.QUserScoreTarget.userScoreTarget;
import static com.studycow.domain.QUserSubjectPlan.userSubjectPlan;
import static com.studycow.domain.QUserSubjectScore.userSubjectScore;
import static com.studycow.domain.QWrongProblem.wrongProblem;


/**
 * <pre>
 *      성적 관리 레포지토리 구현
 * </pre>
 * @author 노명환
 * @since JDK17
 */
@Repository
@RequiredArgsConstructor
public class ScoreRepositoryImpl implements ScoreRepository{

    @PersistenceContext
    private final EntityManager em;
    private final JPAQueryFactory queryFactory;

    /**
     * (과목별) 등록한 성적 조회
     * <pre>
     *      현재 로그인한 userId, 입력받은 과목코드를 기반으로
     *      등록된 성적들을 불러온다
     *      과목코드가 null일 경우 회원의 등록 성적 목록을 조회함.
     * </pre>
     * @param userId 내 회원 ID
     * @param subCode 과목 코드(null일 경우 회원의 전체 성적 조회)
     * @return : ScoreDto 리스트
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public List<ScoreDto> listScores(int userId, Integer subCode, Integer limitCnt) throws PersistenceException {
        try{
            return queryFactory
                    .select(Projections.constructor(ScoreDto.class,
                            userSubjectScore.id,
                            userSubjectScore.subjectCode.code,
                            userSubjectScore.subjectCode.name,
                            userSubjectScore.testScore,
                            userSubjectScore.testGrade,
                            userSubjectScore.testDate
                    ))
                    .from(userSubjectScore)
                    .where(userSubjectScore.user.id.eq(userId)
                            .and(hasSubCode(subCode)))
                    .orderBy(userSubjectScore.testDate.desc())
                    .limit(hasLimit(limitCnt))
                    .fetch();

        }catch(Exception e) {
            throw new PersistenceException("성적 조회 중 에러 발생", e);
        }
    }


    /** 단일 성적 조회
     * <pre>
     *      List로부터 받아온 ID를 기반으로
     *      해당 성적을 조회한다. (수정 페이지에 사용)
     * </pre>
     * @param scoreId : 성적 ID
     * @return : ScoreDto
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public ScoreDto scoreDetail(Long scoreId, int userId) throws PersistenceException {
        try {
            UserSubjectScore us = em.find(UserSubjectScore.class, scoreId);
            if(us != null){
                return queryFactory
                        .select(Projections.constructor(ScoreDto.class,
                                userSubjectScore.id,
                                userSubjectScore.subjectCode.code,
                                userSubjectScore.subjectCode.name,
                                userSubjectScore.testScore,
                                userSubjectScore.testGrade,
                                userSubjectScore.testDate
                        ))
                        .from(userSubjectScore)
                        .where(userSubjectScore.id.eq(us.getId()))
                        .fetchOne();
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_SCORE_ID);
            }
        }catch(CustomException e){
            throw e;
        }catch(Exception e) {
            throw new PersistenceException("성적 조회 중 에러 발생", e);
        }
    }

    /** 등록한 성적 상세 조회
     * <pre>
     *      성적 ID를 기반으로 성적의 상세 설명을 조회한다
     * </pre>
     * @param scoreId : 성적 ID
     * @return : ScoreDetailDto 리스트
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public List<ScoreDetailDto> listScoreDetails(Long scoreId) throws PersistenceException {
        return queryFactory
                .select(Projections.constructor(ScoreDetailDto.class,
                        wrongProblem.id,
                        wrongProblem.userSubjectScore.id,
                        wrongProblem.problemCategory.code,
                        wrongProblem.problemCategory.name,
                        wrongProblem.wrongCount))
                .from(wrongProblem)
                .where(wrongProblem.userSubjectScore.id.eq(scoreId))
                .orderBy(wrongProblem.problemCategory.code.asc())
                .fetch();
    }

    /** 성적 등록
     * <pre>
     *      페이지에서 입력한 성적을 등록한다
     * </pre>
     * @param requestScoreDto : 등록할 성적 정보
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public Long saveScore(RequestScoreDto requestScoreDto, User user, SubjectCode subjectCode) throws PersistenceException {
        try {
            LocalDate testDate = requestScoreDto.getTestDate();

            int scoreCnt = queryFactory
                    .selectFrom(userSubjectScore)
                    .where(userSubjectScore.user.eq(user)
                            .and(userSubjectScore.subjectCode.eq(subjectCode))
                            .and(userSubjectScore.testDate.eq(testDate)))
                    .fetch().size();

            if(scoreCnt > 0){
                throw new CustomException(ErrorCode.DUPLICATE_SCORE);
            }
            int testScore = requestScoreDto.getTestScore();
            int testGrade = requestScoreDto.getTestGrade();
            LocalDateTime updateDate = LocalDateTime.now();

            UserSubjectScore userSubjectScore = new UserSubjectScore(
                    null, user, subjectCode, testDate, testScore, testGrade, updateDate, null
            );

            em.persist(userSubjectScore);
            em.flush();

            return userSubjectScore.getId();
        }catch(CustomException e) {
            throw e;
        }catch(Exception e){
            throw new PersistenceException("성적 등록 중 에러 발생", e);
        }
    }

    /** 성적 상세 등록
     * <pre>
     *      페이지에서 입력한 성적을 등록한다
     * </pre>
     * @param scoreId : 성적 id
     * @param requestDetailDto : 오답 문제 유형 정보
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public void saveScoreDetails(RequestDetailDto requestDetailDto, Long scoreId, ProblemCategory problemCategory) throws PersistenceException{
        try{
            UserSubjectScore uss = em.find(UserSubjectScore.class, scoreId);

            WrongProblem wrongProblem = new WrongProblem(null, uss, problemCategory, requestDetailDto.getWrongCnt());
            em.persist(wrongProblem);
        }catch(Exception e){
            throw new PersistenceException("성적 상세 등록 중 에러 발생", e);
        }
    }

    /** 단일 성적 삭제
     * <pre>
     *      선택한 성적을 삭제한다. 등록된 오답 유형 또한 삭제된다.
     * </pre>
     * @param scoreId : 성적 id
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public void deleteScore(User user, Long scoreId) throws PersistenceException {
        try{
            UserSubjectScore us = em.find(UserSubjectScore.class, scoreId);

            if(us != null) {
                if(us.getUser() != user){
                    throw new CustomException(ErrorCode.NOT_AUTHENTICAION);
                }
                queryFactory
                        .delete(wrongProblem)
                        .where(wrongProblem.userSubjectScore.id.eq(us.getId()))
                        .execute();

                queryFactory
                        .delete(userSubjectScore)
                        .where(userSubjectScore.id.eq(us.getId()))
                        .execute();
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_SCORE_ID);
            }
        }catch(CustomException e) {
            throw e;
        }catch(Exception e){
            throw new PersistenceException("성적 삭제 중 에러 발생", e);
        }
    }

    /** 단일 성적 수정
     * <pre>
     *      선택한 성적을 수정한다.
     *      등록된 오답 유형은 삭제된 뒤 입력된다.
     *      입력 : saveScoreDetail
     * </pre>
     * @param requestScoreDto : 수정 성적 정보
     * @throws PersistenceException : JPA 표준 예외
     */
    @Override
    public void modifyScore(RequestScoreDto requestScoreDto, User user, Long scoreId) throws PersistenceException {
        try {
            UserSubjectScore us = em.find(UserSubjectScore.class, scoreId);

            if(us != null) {
                if(us.getUser() != user){
                    throw new CustomException(ErrorCode.NOT_AUTHENTICAION);
                }

                LocalDate testDate = requestScoreDto.getTestDate();
                SubjectCode subjectCode = em.find(SubjectCode.class, requestScoreDto.getSubCode());

                int scoreCnt = queryFactory
                        .selectFrom(userSubjectScore)
                        .where(userSubjectScore.user.eq(user)
                                .and(userSubjectScore.subjectCode.eq(subjectCode))
                                .and(userSubjectScore.testDate.eq(testDate)))
                        .fetch().size();

                if((us.getTestDate() != testDate || us.getSubjectCode() != subjectCode)
                    && scoreCnt > 0){
                    throw new CustomException(ErrorCode.DUPLICATE_SCORE);
                }

                int testScore = requestScoreDto.getTestScore();
                Integer testGrade = requestScoreDto.getTestGrade();

                queryFactory
                        .delete(wrongProblem)
                        .where(wrongProblem.userSubjectScore.id.eq(us.getId()))
                        .execute();

                queryFactory
                        .update(userSubjectScore)
                        .set(userSubjectScore.subjectCode.code, subjectCode.getCode())
                        .set(userSubjectScore.testDate, testDate)
                        .set(userSubjectScore.testScore, testScore)
                        .set(userSubjectScore.testGrade, testGrade)
                        .set(userSubjectScore.updateDate, LocalDateTime.now())
                        .where(userSubjectScore.id.eq(us.getId()))
                        .execute();
            }else{
                throw new CustomException(ErrorCode.NOT_FOUND_SCORE_ID);
            }
        }catch(CustomException e) {
            throw e;
        }catch(Exception e){
            throw new PersistenceException("성적 수정 중 에러 발생", e);
        }
    }

    /**
     * 특정 과목 목표 조회
     * @param userId
     * @param subCode
     * @return
     * @throws PersistenceException
     */
    @Override
    public ResponseScoreDto subTarget(int userId, int subCode) throws PersistenceException {
        try{
            return queryFactory
                    .select(Projections.constructor(ResponseScoreDto.class,
                            subjectCode.code,
                            subjectCode.name,
                            userScoreTarget.targetScore,
                            userScoreTarget.targetGrade,
                            subjectCode.maxScore
                    ))
                    .from(subjectCode)
                    .leftJoin(userScoreTarget).on(
                            subjectCode.code.eq(userScoreTarget.subjectCode.code)
                                    .and(userScoreTarget.user.id.eq(userId)))
                    .where(subjectCode.code.eq(subCode))
                    .fetchOne();
        }catch(IllegalStateException e) {
            throw e;
        } catch(Exception e) {
            throw new PersistenceException("과목 목표 조회 중 에러 발생", e);
        }
    }

    /**
     * 성적 조회 전 과목 목표 조회
     * @param userId
     * @return
     * @throws PersistenceException
     */
    @Override
    public List<ResponseScoreDto> targetList(int userId) throws PersistenceException {
        try{
            User user = em.find(User.class, userId);

            return queryFactory
                    .select(Projections.constructor(ResponseScoreDto.class,
                            userScoreTarget.subjectCode.code,
                            userScoreTarget.subjectCode.name,
                            userScoreTarget.targetScore,
                            userScoreTarget.targetGrade,
                            userScoreTarget.subjectCode.maxScore
                    ))
                    .from(userScoreTarget)
                    .where(userScoreTarget.user.id.eq(user.getId()))
                    .fetch();

        }catch(IllegalStateException e) {
            throw e;
        } catch(Exception e) {
            throw new PersistenceException("성적 조회 중 에러 발생", e);
        }
    }

    /**
     * 과목별 n개월간의 평균 점수, 등급
     * @param userId : 성적을 조회할 유저 id
     * @param months : n개월
     * @return
     * @throws PersistenceException
     */
    @Override
    public List<ResponseStatsDto> scoreStats(int userId, int months, LocalDate now) throws PersistenceException {
        return queryFactory
                .select(Projections.constructor(ResponseStatsDto.class,
                        userSubjectScore.subjectCode.code,
                        userSubjectScore.subjectCode.name,
                        userSubjectScore.testScore.avg().round(),
                        userSubjectScore.testGrade.avg().round()))
                .from(userSubjectScore)
                .where(userSubjectScore.user.id.eq(userId)
                        .and(userSubjectScore.testDate.between(
                                now.minusMonths(months), now
                        )))
                .groupBy(userSubjectScore.subjectCode.code)
                .orderBy(userSubjectScore.subjectCode.code.asc())
                .fetch();
    }

    /**
     * 과목별 특정 기간동안 틀린 유형
     *
     * @param userId
     * @return
     * @throws PersistenceException
     */
    @Override
    public List<ScoreDetailStatsDto> statsDetail(int userId, int subCode, LocalDate startDate, LocalDate endDate) throws PersistenceException {
        return queryFactory
                .select(Projections.constructor(ScoreDetailStatsDto.class,
                        wrongProblem.problemCategory.code,
                        wrongProblem.problemCategory.name,
                        wrongProblem.wrongCount.sum()))
                .from(wrongProblem)
                .where(wrongProblem.userSubjectScore.user.id.eq(userId)
                        .and(wrongProblem.userSubjectScore.subjectCode.code.eq(subCode))
                        .and(wrongProblem.userSubjectScore.testDate.between(
                                startDate, endDate
                        )))
                .groupBy(wrongProblem.problemCategory.code)
                .orderBy(wrongProblem.problemCategory.code.asc())
                .fetch();
    }

    /**
     * 과목 코드 존재 여부에 따른 동적 쿼리
     *
     * @param subCode 과목코드
     * @return BooleanExpression
     */
    private BooleanExpression hasSubCode(Integer subCode) {
        return subCode != null ? userSubjectScore.subjectCode.code.eq(subCode) : null;
    }

    private int hasLimit(Integer limit) {
        return (limit != null && limit > 5) ? limit : 5;
    }

}
