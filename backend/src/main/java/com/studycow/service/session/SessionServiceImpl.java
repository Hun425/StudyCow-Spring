package com.studycow.service.session;

import com.studycow.dto.session.EnterRequestDto;
import com.studycow.dto.session.SessionDto;
import com.studycow.dto.session.SessionRankDto;
import com.studycow.dto.session.SessionRequestDto;
import com.studycow.repository.session.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService{
    private final SessionRepository sessionRepository;

    @Override
    @Transactional
    public SessionDto enterRoom(EnterRequestDto enterRequestDto, int userId) throws Exception {
        //방 입장 시 log 입력
        SessionDto sessionDto = sessionRepository.enterRoom(enterRequestDto, userId);

        //해당 방에서 금일 공부한 시간 조회
        sessionDto.setRoomStudyTime(sessionRepository.roomStudyTime(
                sessionDto.getUserId(),
                sessionDto.getRoomId(),
                sessionDto.getStudyDate()
        ));

        sessionDto.setRankDto(sessionRepository.roomRank(
                sessionDto.getRoomId(), sessionDto.getStudyDate()
        ));
        return sessionDto;
    }

    @Override
    @Transactional
    public SessionDto exitRoom(SessionRequestDto sessionRequestDto, int userId) throws Exception {
        // 방 퇴장 시 log 갱신
        SessionDto sessionDto = sessionRepository.exitRoom(sessionRequestDto, userId);

        // 해당 방에서 금일 공부한 시간 조회
        sessionDto.setRoomStudyTime(sessionRepository.roomStudyTime(
                sessionDto.getUserId(),
                sessionDto.getRoomId(),
                sessionDto.getStudyDate()
        ));
        return sessionDto;
    }

    @Override
    @Transactional
    public SessionDto modifyStudyTime(SessionRequestDto sessionRequestDto, int userId) throws Exception {
        // 세션 공부시간 갱신
        SessionDto sessionDto = sessionRepository.modifyStudyTime(sessionRequestDto, userId);

        // 해당 방에서 금일 공부한 시간 조회
        /*sessionDto.setRoomStudyTime(sessionRepository.roomStudyTime(
                sessionDto.getUserId(),
                sessionDto.getRoomId(),
                sessionDto.getStudyDate()));*/

        // 현재 방의 랭킹 조회
        sessionDto.setRankDto(sessionRepository.roomRank(
                sessionDto.getRoomId(), sessionDto.getStudyDate()
        ));

        return sessionDto;
    }

    /**
     * 현재 방의 랭크 조회
     *
     * @param roomId : 방 id
     * @param studyDate : 공부 기준 날짜
     */
    @Override
    public List<SessionRankDto> roomRank(long roomId, LocalDate studyDate) throws Exception {
        return sessionRepository.roomRank(roomId, studyDate);
    }
}
