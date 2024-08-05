package com.studycow.service.session;

import com.studycow.dto.session.StudyRoomLogDto;
import com.studycow.dto.session.SessionRankDto;
import com.studycow.dto.session.LogRequestDto;
import com.studycow.repository.session.SessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService{
    private final SessionRepository sessionRepository;

    @Override
    @Transactional
    public StudyRoomLogDto enterRoom(Long roomId, int userId) throws Exception {
        //방 입장 시 log 입력
        StudyRoomLogDto studyRoomLogDto = sessionRepository.enterRoom(roomId, userId);

        //해당 방에서 금일 공부한 시간 조회
        studyRoomLogDto.setRoomStudyTime(sessionRepository.roomStudyTime(
                studyRoomLogDto.getUserId(),
                studyRoomLogDto.getRoomId(),
                studyRoomLogDto.getStudyDate()
        ));

        studyRoomLogDto.setRankDto(sessionRepository.roomRank(
                studyRoomLogDto.getRoomId(), studyRoomLogDto.getStudyDate()
        ));
        return studyRoomLogDto;
    }

    @Override
    @Transactional
    public StudyRoomLogDto exitRoom(LogRequestDto logRequestDto, int userId) throws Exception {
        // 방 퇴장 시 log 갱신
        StudyRoomLogDto studyRoomLogDto = sessionRepository.exitRoom(logRequestDto, userId);

        // 해당 방에서 금일 공부한 시간 조회
        studyRoomLogDto.setRoomStudyTime(sessionRepository.roomStudyTime(
                studyRoomLogDto.getUserId(),
                studyRoomLogDto.getRoomId(),
                studyRoomLogDto.getStudyDate()
        ));
        return studyRoomLogDto;
    }

    @Override
    @Transactional
    public StudyRoomLogDto modifyStudyTime(LogRequestDto logRequestDto, int userId) throws Exception {
        // 세션 공부시간 갱신
        StudyRoomLogDto studyRoomLogDto = sessionRepository.modifyStudyTime(logRequestDto, userId);

        // 현재 방의 랭킹 조회
        studyRoomLogDto.setRankDto(sessionRepository.roomRank(
                studyRoomLogDto.getRoomId(), studyRoomLogDto.getStudyDate()
        ));

        return studyRoomLogDto;
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
