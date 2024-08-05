package com.studycow.service.studyroom;

import com.studycow.domain.StudyRoom;
import com.studycow.domain.User;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;
import com.studycow.repository.studyroom.StudyRoomRepository;
import com.studycow.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
                .orElseThrow(() -> new IllegalArgumentException("해당하는 사용자 ID가 존재하지 않습니다."));

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
            throw new IllegalArgumentException("존재하지 않는 방입니다.");
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

}
