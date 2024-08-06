package com.studycow.dto.plan;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlanCountByDateDto {
    private LocalDate planDate;
    private long planCount;
    private int userId;

}
