package com.studycow.dto.target;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 성적 목표 수정 요청 Dto
 * @author 노명환
 * @since JDK17
 */

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RequestTargetDto {
    private int subCode;
    private int targetScore;
    private int targetGrade;
}
