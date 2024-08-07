package com.studycow.service.target;

import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.RequestScoreDto;
import com.studycow.dto.score.ResponseScoreDto;
import com.studycow.dto.score.ResponseStatsDto;
import com.studycow.dto.score.ScoreDto;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import jakarta.persistence.PersistenceException;

import java.util.List;

/**
 * <pre>
 *      목표 관리 서비스 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */
public interface TargetService {
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
