package com.studycow.dto.roomLog;

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
public class StudyRoomLogDto {
    /** 입장 시 생성된 로그 id */
    private Long logId;
    /** 입장 유저 id */
    private int userId;
    /** 입장 방 id */
    private Long roomId;
    /** 공부 날짜 (06시 기준) */
    private LocalDate studyDate;
    /** 해당 세션에 공부한 시간 */
    private Integer studyTime;
    /** 금일 해당 방에 공부한 시간 */
    private Integer roomStudyTime;
    /** 입장 시간 */
    private LocalDateTime inDate;
    /** 퇴장 시간 */
    private LocalDateTime outDate;
    /** 방 랭킹 정보 */
    private List<SessionRankDto> rankDto;
    /** connection 토큰 */
    //private String token;

    public StudyRoomLogDto(Long logId, int userId, Long roomId,
                           LocalDate studyDate, Integer studyTime, Integer roomStudyTime,
                           LocalDateTime inDate, LocalDateTime outDate) {
        this.logId = logId;
        this.userId = userId;
        this.roomId = roomId;
        this.studyDate = studyDate;
        this.studyTime = studyTime;
        this.roomStudyTime = roomStudyTime;
        this.inDate = inDate;
        this.outDate = outDate;
        this.rankDto = null;
        //this.token = null;
    }
}
