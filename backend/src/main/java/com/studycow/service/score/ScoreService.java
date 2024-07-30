package com.studycow.service.score;

import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.RequestScoreDto;
import com.studycow.dto.score.RequestTargetDto;
import com.studycow.dto.score.ScoreDto;
import com.studycow.dto.score.ScoreTargetDto;
import jakarta.persistence.PersistenceException;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 *      성적 관리 서비스 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */
public interface ScoreService {
    /** 유저 과목별 성적 리스트 조회 */
    List<ScoreDto> listScores(int userId, int subCode, int myId) throws Exception;

    /** 단일 성적 조회 */
    ScoreDto scoreDetail(Long scoreId) throws Exception;

    /** 유저 성적 입력 */
    void saveScore(RequestScoreDto requestScoreDto, int userId) throws Exception;

    /** 단일 성적 수정 */
    void modifyScore(RequestScoreDto requestScoreDto, int userId, Long scoreId) throws Exception;

    /** 단일 성적 삭제 */
    void deleteScore(int userId, Long scoreId) throws Exception;

    /** 성적 목표 등록 */
    void saveScoreTarget(RequestTargetDto requestTargetDto, int userId) throws Exception;

    /** 성적 목표 조회 */
    List<ScoreTargetDto> targetList(int userId, int myId) throws PersistenceException;

    /** 성적 목표 삭제 */
    void deleteTarget(int userId, Long targetId) throws Exception;

    /** 성적 목표 수정 */
    void modifyTarget(RequestTargetDto requestTargetDto, int userId, Long targetId) throws Exception;

    /** 미설정 목표 과목 조회 */
    List<SubjectCodeDto> subjectList(int userId) throws PersistenceException;
}
