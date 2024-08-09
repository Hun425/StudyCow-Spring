package com.studycow.dto.plan;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 플래너 정보 상세 조회 Dto
 *
 * @author 채기훈
 * @since JDK17
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlannerGetDto {

    private int planId;
    private int userId;
    private int subCode;
    private LocalDate planDate;
    private String planContent;
    private int planStudyTime;
    private int planStatus;
}
