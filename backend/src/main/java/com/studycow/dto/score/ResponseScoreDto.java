package com.studycow.dto.score;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
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
    private int targetScore;
    /** 목표 등급 */
    private int targetGrade;
    /** 해당 과목의 최대 점수 */
    private int maxScore;
    /** 조언 */
    private String advice;
    /** 점수 목록 */
    private List<ScoreDto> scores;

    public ResponseScoreDto(int subCode, String subName, int targetScore, int targetGrade, int maxScore){
        this.subCode = subCode;
        this.subName = subName;
        this.targetScore = targetScore;
        this.targetGrade = targetGrade;
        this.maxScore = maxScore;
        this.advice = "";
        this.scores = null;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("ResponseScoreDto{").append("\n");
        sb.append("subCode='").append(subCode).append("\n");
        sb.append("subName='").append(subName).append('\'').append("\n");
        sb.append("targetScore=").append(targetScore).append("\n");
        sb.append("targetGrade=").append(targetGrade).append("\n");
        sb.append("maxScore=").append(maxScore).append("\n");
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
        try {
            return objectMapper.writeValueAsString(this);
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return super.toString();
        }
    }

}
