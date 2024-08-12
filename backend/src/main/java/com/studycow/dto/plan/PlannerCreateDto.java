package com.studycow.dto.plan;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Range;

import java.time.LocalDate;

/**
 * 플래너 생성 Dto
 * @author 채기훈
 * @since JDK17
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlannerCreateDto {

    /** 과목 코드 */
    private int subCode;
    /** 플랜 날짜 */
    private LocalDate planDate;
    /** 내용 */
    @Size(min = 0, max = 100, message = "글자 수는 0 ~ 100 자 이내여야 합니다.")
    private String planContent;
    /** 계획 학습 시간 */
    private int planStudyTime;
    /** 상태 */
    private int planStatus;

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
