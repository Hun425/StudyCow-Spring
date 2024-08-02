package com.studycow.service.score;

import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.repository.common.CommonRepository;
import com.studycow.repository.score.ScoreRepository;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 *      성적 관리 서비스 구현
 * </pre>
 * @author 노명환
 * @since JDK17
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class ScoreServiceImpl implements ScoreService{
    private final ScoreRepository scoreRepository;
    private final CommonRepository commonRepository;

    /**
     * 상세 포함 과목별 성적 리스트 조회
     * @param userId : 유저 id
     * @param subCode : 과목 코드
     * @throws Exception
     */
    @Override
    public ResponseScoreDto listScores(int userId, int subCode, int myId) throws Exception {
        ResponseScoreDto responseScoreDto = scoreRepository.subTarget(userId, subCode, myId);

        // 과목별 성적 리스트
        //List<ScoreDto> scoreDtoList = scoreRepository.listScores(userId, subCode, myId);
        responseScoreDto.setScores(scoreRepository.listScores(userId, subCode, myId, 0));

        // 오답 유형 리스트 조회
        for(ScoreDto scores : responseScoreDto.getScores()){
            Long scoreId = scores.getScoreId();

            List<ScoreDetailDto> scoreDetailDtoList = scoreRepository.listScoreDetails(scoreId);
            if(scoreDetailDtoList != null && !scoreDetailDtoList.isEmpty())
                scores.setScoreDetails(scoreDetailDtoList);
        }
        // return scoreDtoList;
        return responseScoreDto;
    }

    /**
     * 단일 성적 상세 조회
     * @param scoreId : 성적 ID
     * @throws Exception
     */
    @Override
    public ScoreDto scoreDetail(Long scoreId, int userId, int myId) throws Exception {
        ScoreDto scoreDto = scoreRepository.scoreDetail(scoreId, userId, myId);

        List<ScoreDetailDto> scoreDetailDtoList = scoreRepository.listScoreDetails(scoreId);
        if(scoreDetailDtoList != null && !scoreDetailDtoList.isEmpty())
            scoreDto.setScoreDetails(scoreDetailDtoList);

        return scoreDto;
    }

    /**
     * 상세 포함 성적 등록
     * @param requestScoreDto : 성적 정보(상세 포함)
     * @throws Exception
     */
    @Override
    @Transactional
    public void saveScore(RequestScoreDto requestScoreDto, int userId) throws Exception {
        //성적 등록 후 scoreId를 return
        Long scoreId = scoreRepository.saveScore(requestScoreDto, userId);
        log.info("return scoreId : {}", scoreId);

        if(requestScoreDto.getScoreDetails() != null
                && !requestScoreDto.getScoreDetails().isEmpty()) {
            for (RequestDetailDto details : requestScoreDto.getScoreDetails()) {
                scoreRepository.saveScoreDetails(details, scoreId);
            }
        }
    }

    /**
     * 상세 포함 성적 수정
     * @param requestScoreDto : 성적 정보(상세 포함)
     * @param scoreId : 성적 id
     * @throws Exception
     */
    @Override
    @Transactional
    public void modifyScore(RequestScoreDto requestScoreDto, int userId, Long scoreId) throws Exception {
        scoreRepository.modifyScore(requestScoreDto, userId, scoreId);

        if(requestScoreDto.getScoreDetails() != null && !requestScoreDto.getScoreDetails().isEmpty()) {
            for (RequestDetailDto details : requestScoreDto.getScoreDetails()) {
                scoreRepository.saveScoreDetails(details, scoreId);
            }
        }
    }

    /**
     * 단일 성적 삭제
     * @param scoreId : 성적 id
     * @throws Exception
     */
    @Override
    @Transactional
    public void deleteScore(int userId, Long scoreId) throws Exception {
        scoreRepository.deleteScore(userId, scoreId);
    }

    /**
     * 성적 목표 등록
     * @param requestTargetDto : 성적 목표 정보
     * @throws Exception
     */
    @Override
    @Transactional
    public void saveScoreTarget(RequestTargetDto requestTargetDto, int userId) throws Exception {
        scoreRepository.saveScoreTarget(requestTargetDto, userId);
    }

    /**
     * 목표 목록 조회
     * @param userId : 유저 id
     * @throws Exception
     */
    @Override
    public List<ScoreTargetDto> targetList(int userId, int myId) throws PersistenceException {
        return scoreRepository.targetList(userId, myId);
    }

    /**
     * 성적 목표 삭제
     * @param targetId : 목표 id
     * @throws Exception
     */
    @Override
    @Transactional
    public void deleteTarget(int userId, Long targetId) throws Exception {
        scoreRepository.deleteScoreTarget(userId, targetId);
    }

    /**
     * 성적 목표 수정
     * @param requestTargetDto : 목표 정보
     * @throws Exception
     */
    @Override
    @Transactional
    public void modifyTarget(RequestTargetDto requestTargetDto, int userId, Long targetId) throws Exception {
        scoreRepository.modifyScoreTarget(requestTargetDto, userId, targetId);
    }

    /**
     * 미설정 목표 과목 조회
     * @param userId : 유저 id
     * @throws Exception
     */
    @Override
    public List<SubjectCodeDto> subjectList(int userId) throws PersistenceException {
        return scoreRepository.subjectList(userId);
    }

    /**
     * 상세 포함 과목별 성적 리스트 조회
     * @param userId : 유저 id
     * @throws Exception
     */
    @Override
    public List<ResponseScoreDto> recentScores(int userId) throws Exception {
        List<ResponseScoreDto> responseScoreDtoList = scoreRepository.targetList(userId);

        // 과목별 성적 리스트
        for(ResponseScoreDto responseScoreDto : responseScoreDtoList) {
            responseScoreDto.setScores(scoreRepository.listScores(userId,
                    responseScoreDto.getSubCode(), userId, 5));

            // 오답 유형 리스트 조회
            for (ScoreDto scores : responseScoreDto.getScores()) {
                Long scoreId = scores.getScoreId();

                List<ScoreDetailDto> scoreDetailDtoList = scoreRepository.listScoreDetails(scoreId);
                if (scoreDetailDtoList != null && !scoreDetailDtoList.isEmpty())
                    scores.setScoreDetails(scoreDetailDtoList);
            }
        }
        // return scoreDtoList;
        return responseScoreDtoList;
    }

    /**
     * 최근 n개월간의 성적 통계
     * @param userId : 성적을 확인하려는 유저
     * @param myId : 토큰으로 조회한 유저
     * @param months : n개월
     * @return
     * @throws Exception
     */
    @Override
    public List<ResponseStatsDto> scoreStats(int userId, int myId, int months) throws Exception {
        if(commonRepository.checkPublic(userId, myId) == 1){
            LocalDate now = LocalDate.now();
            List<ResponseStatsDto> responseStatsList = scoreRepository.scoreStats(
                    userId, months, now);

            for(ResponseStatsDto stats : responseStatsList){
                stats.setDetailStatsList(scoreRepository.statsDetail(
                        userId, stats.getSubCode(), months, now));
            }

            return responseStatsList;
        }else{
            return null;
        }
    }

}
