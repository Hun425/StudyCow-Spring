package com.studycow.dto.session;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 학습시간 갱신 및 방 퇴장 요청 Dto
 * @author 노명환
 * @since JDK17
 */

@Data
@AllArgsConstructor
@NoArgsConstructor

public class LogRequestDto {
    private Long logId;
    private int studyTime;
    private String token;
}
