package com.studycow.service.studyroom;

import com.studycow.dto.calculate.RankDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;

import java.time.LocalDate;
import java.util.List;

/**
 * <pre>
 *      스터디룸 CRUD 서비스 구현 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
public interface StudyRoomService {

    /** 스터디룸 생성 */
    void createStudyRoom(StudyRoomDto studyRoomDto) throws Exception;

    /** 스터디룸 상세 조회 */
    StudyRoomDto getStudyRoomInfo(Long studyRoomId) throws Exception;

    /** 스터디룸 목록 조회 */
    List<StudyRoomDto> listStudyRoom(ListOptionDto listOptionDto) throws Exception;

    /** 스터디룸 수정 */
    void updateStudyRoom(Long studyRoomId, StudyRoomRequestDto studyRoomRequestDto, int userId) throws Exception;

    /** 최근 입장한 스터디룸 목록 조회 */
    List<StudyRoomDto> recentStudyRoom(int userId) throws Exception;

    /** 날짜 별 랭킹 조회 */
    RankDto getRanks(LocalDate date, Integer limit) throws Exception;

}
