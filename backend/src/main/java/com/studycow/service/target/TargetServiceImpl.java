package com.studycow.service.target;

import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import com.studycow.repository.common.CommonRepository;
import com.studycow.repository.score.ScoreRepository;
import com.studycow.repository.target.TargetRepository;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * <pre>
 *      목표 관리 서비스 구현
 * </pre>
 * @author 노명환
 * @since JDK17
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class TargetServiceImpl implements TargetService {
    private final TargetRepository targetRepository;
    private final CommonRepository commonRepository;

    /**
     * 성적 목표 등록
     * @param requestTargetDto : 성적 목표 정보
     * @throws Exception
     */
    @Override
    @Transactional
    public void saveScoreTarget(RequestTargetDto requestTargetDto, int userId) throws Exception {
        targetRepository.saveScoreTarget(requestTargetDto, userId);
    }

    /**
     * 목표 목록 조회
     * @param userId : 유저 id
     * @throws Exception
     */
    @Override
    public List<ScoreTargetDto> targetList(int userId, int myId) throws PersistenceException {
        return targetRepository.targetList(userId, myId);
    }

    /**
     * 성적 목표 삭제
     * @param targetId : 목표 id
     * @throws Exception
     */
    @Override
    @Transactional
    public void deleteTarget(int userId, Long targetId) throws Exception {
        targetRepository.deleteScoreTarget(userId, targetId);
    }

    /**
     * 성적 목표 수정
     * @param requestTargetDto : 목표 정보
     * @throws Exception
     */
    @Override
    @Transactional
    public void modifyTarget(RequestTargetDto requestTargetDto, int userId, Long targetId) throws Exception {
        targetRepository.modifyScoreTarget(requestTargetDto, userId, targetId);
    }

    /**
     * 미설정 목표 과목 조회
     * @param userId : 유저 id
     * @throws Exception
     */
    @Override
    public List<SubjectCodeDto> subjectList(int userId) throws PersistenceException {
        return targetRepository.subjectList(userId);
    }

}
