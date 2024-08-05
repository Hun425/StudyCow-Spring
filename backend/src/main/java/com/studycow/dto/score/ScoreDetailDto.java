package com.studycow.dto.score;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScoreDetailDto {
    /** 오답 내역 ID */
    private Long wrongDetailId;
    /** 점수 ID */
    private Long scoreId;
    /** 오답 유형 코드 */
    private int catCode;
    /** 오답 유형명 */
    private String catName;
    /** 오답 문항 개수 */
    private int wrongCnt;

    @Override
    public String toString() {
        final StringBuilder sb = new StringBuilder("{").append("\n");
        sb.append("scoreId=").append(scoreId).append("\n");
        sb.append("catName='").append(catName).append('\'').append("\n");
        sb.append("wrongCnt=").append(wrongCnt).append("\n");
        sb.append('}');
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
