package com.studycow.repository.studyroom;

import com.studycow.domain.StudyRoom;
import com.studycow.dto.calculate.RankRoomDto;
import com.studycow.dto.calculate.RankUserDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;
import jakarta.persistence.PersistenceException;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *      스터디룸 CRUD 레포지토리 인터페이스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
public interface StudyRoomRepository {
    /** 스터디룸 생성 */
    void createStudyRoom(StudyRoom studyRoom) throws PersistenceException;

    /** 스터디룸 상세 조회 */
    StudyRoomDto getStudyRoomInfo(Long studyRoomId) throws PersistenceException;

    /** 스터디룸 목록 조회 */
    List<StudyRoomDto> listStudyRoom(ListOptionDto listOptionDto) throws PersistenceException;

    /** 스터디룸 수정 */
    void updateStudyRoom(Long studyRoomId, StudyRoomRequestDto requestDto, int userId) throws PersistenceException, IOException;

    /** 최근 입장한 스터디룸 목록 조회 */
    List<StudyRoomDto> recentStudyRoom(int userId) throws PersistenceException;

    /** 날짜별 방 랭킹 */
    List<RankRoomDto> rankStudyRoom(LocalDate date, Integer limit) throws PersistenceException;

    /** 날짜별 유저 랭킹 */
    List<RankUserDto> rankUser(LocalDate date, Integer limit) throws PersistenceException;
}
