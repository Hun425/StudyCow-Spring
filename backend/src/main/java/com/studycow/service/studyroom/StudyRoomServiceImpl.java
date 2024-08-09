package com.studycow.service.studyroom;

import com.studycow.domain.StudyRoom;
import com.studycow.domain.User;
import com.studycow.dto.calculate.RankDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import com.studycow.repository.studyroom.StudyRoomRepository;
import com.studycow.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyRoomServiceImpl implements StudyRoomService {

    private final StudyRoomRepository studyRoomRepository;
    private final UserRepository userRepository;

    /**
     * 스터디룸 생성
     *
     * @param studyRoomDto 스터디룸 DTO
     * @throws Exception
     */
    @Override
    @Transactional
    public void createStudyRoom(StudyRoomDto studyRoomDto) throws Exception {
        User user = userRepository.findById((long) studyRoomDto.getUserId())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        StudyRoom studyRoom = studyRoomDto.toEntity(user);
        studyRoomRepository.createStudyRoom(studyRoom);
    }

    /**
     * 스터디룸 상세 조회
     *
     * @param studyRoomId 스터디룸 고유번호
     * @return StudyRoomDto
     * @throws Exception
     */
    @Override
    public StudyRoomDto getStudyRoomInfo(Long studyRoomId) throws Exception {
        StudyRoomDto studyRoomDto = studyRoomRepository.getStudyRoomInfo(studyRoomId);
        if (studyRoomDto == null) {
            throw new CustomException(ErrorCode.NOT_FOUND_ROOM);
        }
        return studyRoomDto;
    }

    /**
     * 스터디룸 목록 조회
     *
     * @param listOptionDto 검색/정렬 조건
     * @throws Exception
     */
    @Override
    public List<StudyRoomDto> listStudyRoom(ListOptionDto listOptionDto) throws Exception {
        return studyRoomRepository.listStudyRoom(listOptionDto);
    }

    /**
     * 스터디룸 수정
     *
     * @param studyRoomId         스터디룸 고유번호
     * @param studyRoomRequestDto 수정 정보를 담은 DTO
     * @param userId              요청 회원 고유번호
     * @throws Exception
     */
    @Override
    @Transactional
    public void updateStudyRoom(Long studyRoomId, StudyRoomRequestDto studyRoomRequestDto, int userId) throws Exception {
        // 수정하고자 하는 방 조회
        StudyRoomDto studyRoomFound = studyRoomRepository.getStudyRoomInfo(studyRoomId);

        // 방장만 수정 가능
        if (studyRoomFound.getUserId() != userId) {
            throw new CustomException(ErrorCode.UNAUTHORIZED_ROOM_UPDATE);
        }

        studyRoomRepository.updateStudyRoom(studyRoomId, studyRoomRequestDto, userId);
    }

    /**
     * 최근 입장한 스터디룸 목록 조회
     *
     * @param userId
     */
    @Override
    public List<StudyRoomDto> recentStudyRoom(int userId) throws Exception {
        return studyRoomRepository.recentStudyRoom(userId);
    }

    /**
     * 날짜 별 랭킹 조회
     *
     * @param date
     * @param limit
     */
    @Override
    public RankDto getRanks(LocalDate date, Integer limit) throws Exception {
        return new RankDto(studyRoomRepository.rankStudyRoom(date, limit),
                studyRoomRepository.rankUser(date, limit));
    }

}
