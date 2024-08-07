package com.studycow.service.score;

import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import jakarta.persistence.PersistenceException;

import java.util.List;

/**
 * <pre>
 *      성적 관리 서비스 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */
public interface ScoreService {
    /** 유저 과목별 성적 리스트 조회 */
    ResponseScoreDto listScores(int userId, int subCode, int myId, Integer limitCnt) throws Exception;

    /** 단일 성적 조회 */
    ScoreDto scoreDetail(Long scoreId, int userId, int myId) throws Exception;

    /** 유저 성적 입력 */
    void saveScore(RequestScoreDto requestScoreDto, int userId) throws Exception;

    /** 단일 성적 수정 */
    void modifyScore(RequestScoreDto requestScoreDto, int userId, Long scoreId) throws Exception;

    /** 단일 성적 삭제 */
    void deleteScore(int userId, Long scoreId) throws Exception;

    /** 과목별 최근 5개 성적 조회 */
    List<ResponseScoreDto> recentScores(int userId) throws Exception;

    /** 회원의 최근 5개 성적 가져오기 */
    List<ScoreDto> recentUserScore(int userId) throws Exception;

    /** 최근 n개월간의 성적 통계 */
    List<ResponseStatsDto> scoreStats(int userId, int myId, int months) throws Exception;
}
