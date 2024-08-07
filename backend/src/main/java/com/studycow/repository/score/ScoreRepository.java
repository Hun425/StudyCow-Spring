package com.studycow.repository.score;


import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
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
    List<ScoreDto> listScores(int userId, Integer subCode, int myId, Integer limitCnt) throws PersistenceException;


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

    /** 성적 조회 전 과목 정보 조회 */
    ResponseScoreDto subTarget(int userId, int subCode, int myId) throws PersistenceException;

    /** 최근 성적 조회 전 성적 목표 조회 */
    List<ResponseScoreDto> targetList(int userId) throws PersistenceException;

    /** 과목별 n개월간의 평균 점수, 등급 */
    List<ResponseStatsDto> scoreStats(int userId, int months, LocalDate now) throws PersistenceException;

    /** 특정기간동안 틀린 유형 */
    List<ScoreDetailStatsDto> statsDetail(int userId, int subCode, LocalDate startDate, LocalDate endDate) throws PersistenceException;

    /** 플래너 기반 학습한 시간 (planner 임시작성) */
    Integer planStudyTime(int userId, int subCode) throws PersistenceException;
;}
