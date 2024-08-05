package com.studycow.repository.session;


import com.studycow.dto.session.StudyRoomLogDto;
import com.studycow.dto.session.SessionRankDto;
import com.studycow.dto.session.LogRequestDto;
import jakarta.persistence.PersistenceException;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *      방 세션 관련 레포지토리 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

public interface SessionRepository {
    /** 방 입장 시 log 입력 */
    StudyRoomLogDto enterRoom(Long roomId, int userId) throws PersistenceException;

    /** 방 퇴장 시 log 업데이트 */
    StudyRoomLogDto exitRoom(LogRequestDto logRequestDto, int userId) throws PersistenceException;

    /** 해당 방에서 금일 공부한 시간 조회 */
    Integer roomStudyTime(int userId, Long roomId, LocalDate studyDate) throws PersistenceException;

    /** 방 퇴장 시 log 업데이트 */
    StudyRoomLogDto modifyStudyTime(LogRequestDto logRequestDto, int userId) throws PersistenceException;

    /** 현재 방의 랭크 조회 */
    List<SessionRankDto> roomRank(Long roomId, LocalDate studyDate) throws PersistenceException;
}
