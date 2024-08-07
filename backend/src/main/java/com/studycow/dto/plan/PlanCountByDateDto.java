package com.studycow.dto.plan;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

/**
 * <pre>
 *     플래너 잔디 응답용 Dto
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlanCountByDateDto {
    private LocalDate planDate;
    private long planCount;
    private int userId;

}
