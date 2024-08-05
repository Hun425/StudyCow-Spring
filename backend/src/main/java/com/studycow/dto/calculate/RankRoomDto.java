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
public class RankRoomDto {
    /** 랭킹 번호 */
    private int rank;
    /** 스터디룸 id 번호 */
    private Long id;
    /** 스터디룸명 */
    private String roomTitle;
    /** 기준 날짜 */
    private LocalDate procDate;
    /** 학습시간 합계 */
    private int sumTime;
}
