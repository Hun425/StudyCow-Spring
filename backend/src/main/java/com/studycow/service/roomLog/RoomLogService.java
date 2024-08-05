package com.studycow.service.roomLog;

import com.studycow.dto.roomLog.StudyRoomLogDto;
import com.studycow.dto.roomLog.SessionRankDto;
import com.studycow.dto.roomLog.LogRequestDto;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *      방 내부활동 서비스 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */
public interface RoomLogService {
    /** 방 입장 시도 */
    StudyRoomLogDto enterRoom(Long roomId, int userId) throws Exception;
    /** 방 퇴장 시도 */
    StudyRoomLogDto exitRoom(LogRequestDto logRequestDto, int userId) throws Exception;
    /** 공부시간 갱신 */
    StudyRoomLogDto modifyStudyTime(LogRequestDto logRequestDto, int userId) throws Exception;
    /** 현재 방의 랭크 조회*/
    List<SessionRankDto> roomRank(long roomId, LocalDate studyDate) throws Exception;
}
