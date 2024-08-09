package com.studycow.service.target;

import com.studycow.domain.SubjectCode;
import com.studycow.domain.User;
import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import com.studycow.repository.common.CommonRepository;
import com.studycow.repository.score.ScoreRepository;
import com.studycow.repository.subjectcode.SubjectCodeRepository;
import com.studycow.repository.target.TargetRepository;
import com.studycow.repository.user.UserRepository;
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
    private final UserRepository userRepository;
    private final SubjectCodeRepository subjectCodeRepository;

    /**
     * 성적 목표 등록
     * @param requestTargetDto : 성적 목표 정보
     * @throws Exception
     */
    @Override
    @Transactional
    public void saveScoreTarget(RequestTargetDto requestTargetDto, int userId) throws Exception {
        //유저 확인
        User user = userRepository.findById((long)userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        SubjectCode subjectCode = subjectCodeRepository.findById(requestTargetDto.getSubCode())
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_SUBJECT_CODE));
        targetRepository.saveScoreTarget(requestTargetDto, user, subjectCode);
    }

    /**
     * 목표 목록 조회
     * @param userId : 유저 id
     * @throws Exception
     */
    @Override
    public List<ScoreTargetDto> targetList(int userId, int myId) throws PersistenceException {
        //유저 확인
        User user = userRepository.findById((long) userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        //로그인 유저와 조회되는 유저 확인 및 조회되는 유저의 공개여부
        if(user.getId() != myId && user.getUserPublic() == 0)
            throw new CustomException(ErrorCode.USER_PRIVATE);

        return targetRepository.targetList(userId);
    }

    /**
     * 성적 목표 삭제
     * @param targetId : 목표 id
     * @throws Exception
     */
    @Override
    @Transactional
    public void deleteTarget(int userId, Long targetId) throws Exception {
        //유저 확인
        User user = userRepository.findById((long) userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        targetRepository.deleteScoreTarget(user, targetId);
    }

    /**
     * 성적 목표 수정
     * @param requestTargetDto : 목표 정보
     * @throws Exception
     */
    @Override
    @Transactional
    public void modifyTarget(RequestTargetDto requestTargetDto, int userId, Long targetId) throws Exception {
        //유저 확인
        User user = userRepository.findById((long) userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        //과목코드 확인
        SubjectCode subjectCode = subjectCodeRepository.findById(requestTargetDto.getSubCode())
                .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND_SUBJECT_CODE));
        //목표점수 확인
        if(subjectCode.getMaxScore() < requestTargetDto.getTargetScore()
        || requestTargetDto.getTargetScore() < 0)
            throw new CustomException(ErrorCode.BAD_TARGET_SCORE);

        targetRepository.modifyScoreTarget(requestTargetDto, user, subjectCode, targetId);
    }

    /**
     * 미설정 목표 과목 조회
     * @param userId : 유저 id
     * @throws Exception
     */
    @Override
    public List<SubjectCodeDto> subjectList(int userId) throws PersistenceException {
        //유저 확인
        User user = userRepository.findById((long) userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        return targetRepository.subjectList(user.getId());
    }

}
