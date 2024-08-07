package com.studycow.service.score;

import com.studycow.dto.common.SubjectCodeDto;
import com.studycow.dto.score.*;
import com.studycow.dto.target.RequestTargetDto;
import com.studycow.dto.target.ScoreTargetDto;
import com.studycow.repository.common.CommonRepository;
import com.studycow.repository.planner.PlannerRepository;
import com.studycow.repository.score.ScoreRepository;
import jakarta.persistence.PersistenceException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
    //private final PlannerRepository plannerRepository;
    private final CommonRepository commonRepository;

    /**
     * 상세 포함 과목별 성적 리스트 조회
     * @param userId : 유저 id
     * @param subCode : 과목 코드
     * @throws Exception
     */
    @Override
    public ResponseScoreDto listScores(int userId, int subCode, int myId, Integer limitCnt) throws Exception {
        // 과목의 목표 조회
        ResponseScoreDto responseScoreDto = scoreRepository.subTarget(userId, subCode, myId);

        // 과목별 성적 리스트
        responseScoreDto.setScores(scoreRepository.listScores(userId, subCode, myId, limitCnt));

        // 오답 유형 리스트 조회
        for(ScoreDto scores : responseScoreDto.getScores()){
            Long scoreId = scores.getScoreId();

            List<ScoreDetailDto> scoreDetailDtoList = scoreRepository.listScoreDetails(scoreId);
            if(scoreDetailDtoList != null && !scoreDetailDtoList.isEmpty())
                scores.setScoreDetails(scoreDetailDtoList);
        }

        // 해당 과목에 대한 총 학습시간
        responseScoreDto.setSumStudyTime(scoreRepository.planStudyTime(userId, subCode));

        int scoreSize = responseScoreDto.getScores().size();

        if(scoreSize > 0) {
            // 가장 최근 성적
            responseScoreDto.setNowScore(responseScoreDto.getScores().get(0).getTestScore());
            // 오답유형 통계
            responseScoreDto.setDetailStats(
                    scoreRepository.statsDetail(
                            userId,
                            subCode,
                            responseScoreDto.getScores().get(scoreSize - 1).getTestDate(),
                            responseScoreDto.getScores().get(0).getTestDate()
                    )
            );
        }
        if(scoreSize > 1)
            // 성적 등락확인
            responseScoreDto.setDiffScore(responseScoreDto.getNowScore() -
                    responseScoreDto.getScores().get(1).getTestScore());

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
     * 과목별 최근 5개 과목 목표별 성적 조회
     * @param userId : 유저 id
     * @throws Exception
     */
    @Override
    public List<ResponseScoreDto> recentScores(int userId) throws Exception {
        // 해당 회원의 과목 목표 리스트
        List<ResponseScoreDto> responseScoreDtoList = scoreRepository.targetList(userId);

        // 과목 목표별 성적 리스트
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
     * 회원의 최근 10개 성적 가져오기
     *
     * @param userId 회원 ID
     * @return List<ScoreDto>
     * @throws Exception
     */
    @Override
    public List<ScoreDto> recentUserScore(int userId) throws Exception {
            // 최근 10개 성적
            List<ScoreDto> recentScoreList = scoreRepository.listScores(userId, null, userId, 10);

            // 오답 유형 리스트 조회
            for (ScoreDto score : recentScoreList) {
                Long scoreId = score.getScoreId();

                List<ScoreDetailDto> scoreDetailDtoList = scoreRepository.listScoreDetails(scoreId);
                if (scoreDetailDtoList != null && !scoreDetailDtoList.isEmpty()) {
                    score.setScoreDetails(scoreDetailDtoList);
                }
            }
            return recentScoreList;
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
        /*if(commonRepository.checkPublic(userId, myId) == 1){
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
        }*/
        return null;
    }

}
