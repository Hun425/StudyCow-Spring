package com.studycow.service.session;

import com.studycow.dto.session.EnterRequestDto;
import com.studycow.dto.session.SessionDto;
import com.studycow.dto.session.SessionRankDto;
import com.studycow.dto.session.SessionRequestDto;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *      방 세션 관련 서비스 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */
public interface SessionService {
    /** 방 입장 시도 */
    SessionDto enterRoom(EnterRequestDto enterRequestDto, int userId) throws Exception;
    /** 방 퇴장 시도 */
    SessionDto exitRoom(SessionRequestDto sessionRequestDto, int userId) throws Exception;
    /** 공부시간 갱신 */
    SessionDto modifyStudyTime(SessionRequestDto sessionRequestDto, int userId) throws Exception;
    /** 현재 방의 랭크 조회*/
    List<SessionRankDto> roomRank(long roomId, LocalDate studyDate) throws Exception;
}
