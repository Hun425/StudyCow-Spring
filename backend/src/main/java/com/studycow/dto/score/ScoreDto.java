package com.studycow.dto.score;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScoreDto {
    /** 성적 ID */
    private Long scoreId;
    /** 과목 코드 */
    private int subCode;
    /** 과목 이름 */
    private String subName;
    /** 점수 */
    private int testScore;
    /** 등급(1~9) */
    private Integer testGrade;
    /** 시험 일자 */
    private LocalDate testDate;
    /** 오답 내역 목록 */
    private List<ScoreDetailDto> scoreDetails;

    public ScoreDto(Long scoreId, int subCode, String subName,
                    int testScore, Integer testGrade, LocalDate testDate) {
        this.scoreId = scoreId;
        this.subCode = subCode;
        this.subName = subName;
        this.testScore = testScore;
        this.testGrade = testGrade;
        this.testDate = testDate;
        this.scoreDetails = null;
    }

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("{").append("\n");
        sb.append("testScore=").append(testScore).append("\n");
        sb.append("testGrade=").append(testGrade).append("\n");
        sb.append("testDate=").append(testDate).append("\n");
        sb.append("scoreDetails=[").append("\n");
        if(scoreDetails != null && !scoreDetails.isEmpty()) {
            for (ScoreDetailDto scoreDetail : scoreDetails) {
                sb.append(scoreDetail.toString());
            }
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
