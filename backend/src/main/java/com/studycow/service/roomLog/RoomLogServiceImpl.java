package com.studycow.service.roomLog;

import com.studycow.dto.roomLog.StudyRoomLogDto;
import com.studycow.dto.roomLog.SessionRankDto;
import com.studycow.dto.roomLog.LogRequestDto;
import com.studycow.repository.roomLog.RoomLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *      방 내부활동 서비스 구현
 * </pre>
 * @author 노명환
 * @since JDK17
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RoomLogServiceImpl implements RoomLogService {
    private final RoomLogRepository roomLogRepository;

    @Override
    @Transactional
    public StudyRoomLogDto enterRoom(Long roomId, int userId) throws Exception {
        //방 입장 시 log 입력
        StudyRoomLogDto studyRoomLogDto = roomLogRepository.enterRoom(roomId, userId);

        //해당 방에서 금일 공부한 시간 조회
        studyRoomLogDto.setRoomStudyTime(roomLogRepository.roomStudyTime(
                studyRoomLogDto.getUserId(),
                studyRoomLogDto.getRoomId(),
                studyRoomLogDto.getStudyDate()
        ));

        studyRoomLogDto.setRankDto(roomLogRepository.roomRank(
                studyRoomLogDto.getRoomId(), studyRoomLogDto.getStudyDate()
        ));
        return studyRoomLogDto;
    }

    @Override
    @Transactional
    public StudyRoomLogDto exitRoom(LogRequestDto logRequestDto, int userId) throws Exception {
        // 방 퇴장 시 log 갱신
        StudyRoomLogDto studyRoomLogDto = roomLogRepository.exitRoom(logRequestDto, userId);

        // 해당 방에서 금일 공부한 시간 조회
        studyRoomLogDto.setRoomStudyTime(roomLogRepository.roomStudyTime(
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
        StudyRoomLogDto studyRoomLogDto = roomLogRepository.modifyStudyTime(logRequestDto, userId);

        // 현재 방의 랭킹 조회
        studyRoomLogDto.setRankDto(roomLogRepository.roomRank(
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
        return roomLogRepository.roomRank(roomId, studyDate);
    }
}
