package com.studycow.repository.score;


import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import jakarta.persistence.PersistenceException;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *      성적 관리 레포지토리 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

public interface ScoreRepository {
    /** 유저 과목별 성적 리스트 조회 */
    List<ScoreDto> listScores(int userId, Integer subCode, int myId, int limitCnt) throws PersistenceException;


    /** 단일 성적 상세 조회 */
    ScoreDto scoreDetail(Long scoreId, int userId, int myId) throws PersistenceException;

    /** 등록 성적 별 상세 성적 조회 */
    List<ScoreDetailDto> listScoreDetails(Long scoreId) throws PersistenceException;

    /** 유저 성적 입력 */
    Long saveScore(RequestScoreDto requestScoreDto, int userId) throws PersistenceException;

    /** 성적 내 상세 오답 내역 입력 */
    void saveScoreDetails(RequestDetailDto requestDetailDto, Long scoreId) throws PersistenceException;

    /** 단일 성적 삭제 */
    void deleteScore(int userId, Long scoreId) throws PersistenceException;

    /** 단일 성적 수정 */
    void modifyScore(RequestScoreDto requestScoreDto, int userId, Long scoreId) throws PersistenceException;

    /** 성적 목표 등록 */
    void saveScoreTarget(RequestTargetDto requestTargetDto, int userId) throws PersistenceException;

    /** 성적 목표 조회 */
    List<ScoreTargetDto> targetList(int userId, int myId) throws PersistenceException;

    /** 성적 목표 삭제 */
    void deleteScoreTarget(int userId, Long targetId) throws PersistenceException;

    /** 성적 목표 수정 */
    void modifyScoreTarget(RequestTargetDto requestTargetDto, int userId, Long targetId) throws PersistenceException;

    /** 목표 미설정 과목 조회 */
    List<SubjectCodeDto> subjectList(int userId) throws PersistenceException;

    /** 성적 조회 전 과목 목표 조회 */
    ResponseScoreDto subTarget(int userId, int subCode, int myId) throws PersistenceException;

    /** 최근 성적 조회 전 성적 목표 조회 */
    List<ResponseScoreDto> targetList(int userId) throws PersistenceException;

    /** 과목별 n개월간의 평균 점수, 등급 */
    List<ResponseStatsDto> scoreStats(int userId, int months, LocalDate now) throws PersistenceException;

    /** 과목별 n개월간의 틀린 유형 */
    List<ScoreDetailStatsDto> statsDetail(int userId, int subCode, int months, LocalDate now) throws PersistenceException;
}
