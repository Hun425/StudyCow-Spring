package com.studycow.dto.score;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ResponseScoreDto {
    /** 과목 코드 */
    private int subCode;
    /** 과목 이름 */
    private String subName;
    /** 목표 점수 */
    private Integer targetScore;
    /** 목표 등급 */
    private Integer targetGrade;
    /** 해당 과목의 최대 점수 */
    private int maxScore;
    /** 조언 */
    private String advice;
    /** 현재 성적 */
    private Integer nowScore;
    /** 성적 등락 */
    private Integer diffScore;
    /** 지금까지의 과목 학습 기간 */
    private Integer sumStudyTime;
    /** 성적 목록 */
    private List<ScoreDto> scores;
    /** 유형별 오답 개수 */
    private List<ScoreDetailStatsDto> detailStats;

    public ResponseScoreDto(int subCode, String subName, Integer targetScore, Integer targetGrade, int maxScore){
        this.subCode = subCode;
        this.subName = subName;
        this.targetScore = targetScore;
        this.targetGrade = targetGrade;
        this.maxScore = maxScore;
        this.advice = "";
        this.scores = null;
        this.nowScore = null;
        this.diffScore = null;
        this.detailStats = null;
        this.sumStudyTime = null;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ResponseScoreDto{").append("\n");
        sb.append("subCode='").append(subCode).append("\n");
        sb.append("subName='").append(subName).append('\'').append("\n");
        sb.append("targetScore=").append(targetScore).append("\n");
        sb.append("targetGrade=").append(targetGrade).append("\n");
        sb.append("maxScore=").append(maxScore).append("\n");
        sb.append("diffScore=").append(diffScore).append("\n");
        sb.append("scores=[").append("\n");
        for(ScoreDto score : scores){
            sb.append(score.toString());
        }
        sb.append("\n").append("]}");
        return sb.toString();
    }

    /**
     * json으로 변환하는 함수
     *
     * @return String json문자열
     */
    public String toJson() {
        ObjectMapper objectMapper = new ObjectMapper();
        // Java 8 날짜/시간 모듈 등록
        objectMapper.registerModule(new JavaTimeModule());

        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return super.toString();
        }
    }

}
