package com.studycow.dto.calculate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RankUserDto {
    /** 순위 */
    private int rank;
    /** 유저 id */
    private int id;
    /** 유저 닉네임 */
    private String userNickName;
    /** 기준 날짜 */
    private LocalDate procDate;
    /** 학습시간 합계 */
    private int sumTime;
}
