package com.studycow.studyroom;

import com.studycow.domain.UserGrade;
import com.studycow.dto.calculate.RankDto;
import com.studycow.dto.calculate.RankRoomDto;
import com.studycow.dto.calculate.RankUserDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.dto.user.CustomUserInfoDto;
import com.studycow.dto.user.RegisterRequestDto;
import com.studycow.service.file.FileService;
import com.studycow.service.studyroom.StudyRoomService;
import com.studycow.service.user.UserGradeRepository;
import com.studycow.service.user.UserService;
import com.studycow.web.studyroom.StudyRoomController;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;


/**
 * 스터디룸 테스트 클래스
 *
 * @author 박봉균
 * @since JDK17(Eclipse Temurin)
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class StudyRoomControllerTest {

    @Autowired
    private StudyRoomController studyRoomController;
    @Autowired
    @MockBean
    private StudyRoomService studyRoomService;
    @Autowired
    private UserGradeRepository userGradeRepository;
    @Autowired
    private UserService userService;

    @MockBean
    private FileService fileService;

    private CustomUserInfoDto customUserInfoDto;

    @BeforeEach
    void setUp() {
        // 테스트용 UserGrade 생성
        UserGrade userGrade = new UserGrade(1, "Beginner", 0, 100);
        userGradeRepository.save(userGrade);

        // 회원 검증 위한 회원 생성
        RegisterRequestDto registerRequestDto = new RegisterRequestDto();
        registerRequestDto.setUserEmail("testEmail");
        registerRequestDto.setUserPassword("testPass");
        registerRequestDto.setUserNickName("TestNick");
        registerRequestDto.setUserPublic(1);
        userService.register(registerRequestDto);

        customUserInfoDto = new CustomUserInfoDto(1, "testName", "testEmail", "testPass", 1, "testThumb", 1, 0, LocalDateTime.now(), LocalDateTime.now(), "testNick");
    }


    /**
     * 스터디룸 생성 테스트
     *
     * @throws Exception
     */
    @Test
    void createStudyRoomTest() throws Exception {
        /* --- GIVEN --- */
        // 스터디룸 요청 DTO 객체
        StudyRoomRequestDto requestDto = new StudyRoomRequestDto();
        requestDto.setRoomTitle("Test Study Room");
        requestDto.setRoomMaxPerson(5);
        requestDto.setRoomEndDate(LocalDate.now().plusDays(7));
        requestDto.setRoomStatus(1);
        requestDto.setRoomContent("This is a test study room.");
        requestDto.setRoomThumb(new MockMultipartFile("roomThumb", "test.jpg", "image/jpeg", "test data".getBytes()));
        // 회원 정보
        CustomUserDetails userDetails = new CustomUserDetails(customUserInfoDto);

        /* --- WHEN --- */
        // 파일 업로드 모의 동작 설정
        when(fileService.uploadFile(any(MultipartFile.class))).thenReturn("https://test-file-link.com/test.jpg");
        // 스터디룸 생성 API 호출
        ResponseEntity<?> response = studyRoomController.createStudyRoom(requestDto, userDetails);

        /* --- THEN --- */
        // 응답 검증
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
        assertThat(response.getBody()).isEqualTo("스터디룸 생성 성공");
        // 메서드 호출 횟수 및 파라미터 객체 타입 검증
        verify(fileService, times(1)).uploadFile(any(MultipartFile.class));
        verify(studyRoomService, times(1)).createStudyRoom(any(StudyRoomDto.class));
    }

    /**
     * 스터디룸 상세 조회 테스트
     *
     * @throws Exception
     */
    @Test
    void getStudyRoomInfoTest() throws Exception {
        /* --- GIVEN --- */
        // 스터디룸 DTO 객체
        Long studyRoomId = 1L;
        StudyRoomDto studyRoomDto = new StudyRoomDto(
                1L, "Test Study Room", 5, 2, LocalDate.now(), LocalDate.now().plusDays(7),
                1, LocalDateTime.now(), "This is a test study room.", "https://test-file-link.com/test.jpg", 1);

        /* --- WHEN --- */
        // 스터디룸 서비스 getStudyRoomInfo() 모의 동작 설정
        when(studyRoomService.getStudyRoomInfo(studyRoomId)).thenReturn(studyRoomDto);
        // 스터디룸 상세 조회 API 호출
        ResponseEntity<?> response = studyRoomController.getStudyRoomInfo(studyRoomId);

        /* --- THEN --- */
        // 응답 검증
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(studyRoomDto);
        // 메서드 호출 횟수 검증
        verify(studyRoomService, times(1)).getStudyRoomInfo(studyRoomId);
    }

    /**
     * 스터디룸 목록 조회 테스트
     *
     * @throws Exception
     */
    @Test
    void listStudyRoomTest() throws Exception {
        /* --- GIVEN --- */
        // 정렬 조건 DTO 객체
        ListOptionDto listOptionDto = new ListOptionDto();
        listOptionDto.setSearchText("Test");
        listOptionDto.setSortKey("id");
        listOptionDto.setIsDESC(false);
        // 스터디룸 DTO 객체 리스트
        List<StudyRoomDto> studyRoomDtoList = new ArrayList<>();
        studyRoomDtoList.add(new StudyRoomDto(
                1L, "Test Study Room 1", 5, 2, LocalDate.now(), LocalDate.now().plusDays(7),
                1, LocalDateTime.now(), "This is a test study room 1.", "https://test-file-link.com/test1.jpg", 1));
        studyRoomDtoList.add(new StudyRoomDto(
                2L, "Test Study Room 2", 5, 3, LocalDate.now(), LocalDate.now().plusDays(10),
                1, LocalDateTime.now(), "This is a test study room 2.", "https://test-file-link.com/test2.jpg", 2));

        /* --- WHEN --- */
        // 스터디룸 서비스 listStudyRoom() 모의 동작 설정
        when(studyRoomService.listStudyRoom(listOptionDto)).thenReturn(studyRoomDtoList);
        // 스터디룸 목록 조회 API 호출
        ResponseEntity<?> response = studyRoomController.listStudyRoom(listOptionDto);

        /* --- THEN --- */
        // 응답 검증
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(studyRoomDtoList);

        // 메서드 호출 횟수 검증
        verify(studyRoomService, times(1)).listStudyRoom(listOptionDto);
    }

    /**
     * 스터디룸 수정 테스트
     *
     * @throws Exception
     */
    @Test
    void updateStudyRoomTest() throws Exception {
        /* --- GIVEN --- */
        // 스터디룸 생성
        StudyRoomDto createStudyRoomDto = new StudyRoomDto();
        createStudyRoomDto.setId(1L);
        createStudyRoomDto.setRoomTitle("create study room");
        createStudyRoomDto.setRoomMaxPerson(10);
        createStudyRoomDto.setRoomStatus(0);
        createStudyRoomDto.setRoomContent("creating study room");
        createStudyRoomDto.setUserId(1);
        studyRoomService.createStudyRoom(createStudyRoomDto);
        // 스터디룸 요청 DTO 객체(수정)
        Long studyRoomId = 1L;
        StudyRoomRequestDto updateRequestDto = new StudyRoomRequestDto();
        updateRequestDto.setRoomTitle("Updated Test Study Room");
        updateRequestDto.setRoomMaxPerson(10);
        updateRequestDto.setRoomEndDate(LocalDate.now().plusDays(14));
        updateRequestDto.setRoomStatus(1);
        updateRequestDto.setRoomContent("This is an updated test study room.");
        updateRequestDto.setRoomThumb(new MockMultipartFile("roomThumb", "updated-test.jpg", "image/jpeg", "updated test data".getBytes()));
        // 회원 정보
        CustomUserDetails userDetails = new CustomUserDetails(customUserInfoDto);

        /* --- WHEN --- */
        // 파일 관리 모의 동작 설정
        when(fileService.uploadFile(any(MultipartFile.class))).thenReturn("https://test-file-link.com/updated-test.jpg");
        doNothing().when(fileService).deleteFile(any(String.class));
        // 스터디룸 수정 API 호출
        ResponseEntity<?> response = studyRoomController.updateStudyRoom(studyRoomId, updateRequestDto, userDetails);

        /* --- THEN --- */
        // 응답 검증
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("스터디룸 수정 성공");
        // 메서드 호출 횟수 및 파라미터 객체 타입 검증
        verify(studyRoomService, times(1)).updateStudyRoom(eq(studyRoomId), eq(updateRequestDto), eq(userDetails.getUser().getUserId()));
    }

    /**
     * 최근 입장 스터디룸 목록 조회 테스트
     *
     * @throws Exception
     */
    @Test
    void recentRoomTest() throws Exception {
        /* --- GIVEN --- */
        // 스터디룸 DTO 객체 리스트
        int userId = 1;
        List<StudyRoomDto> studyRoomDtoList = new ArrayList<>();
        studyRoomDtoList.add(new StudyRoomDto(
                1L, "Recent Study Room 1", 5, 2, LocalDate.now(), LocalDate.now().plusDays(7),
                1, LocalDateTime.now(), "This is a recent study room 1.", "https://test-file-link.com/recent1.jpg", 1));
        studyRoomDtoList.add(new StudyRoomDto(
                2L, "Recent Study Room 2", 5, 3, LocalDate.now(), LocalDate.now().plusDays(10),
                1, LocalDateTime.now(), "This is a recent study room 2.", "https://test-file-link.com/recent2.jpg", 2));
        // 회원 정보
        CustomUserDetails userDetails = new CustomUserDetails(customUserInfoDto);

        /* --- WHEN --- */
        // 스터디룸 서비스 recentStudyRoom() 모의 동작 설정
        when(studyRoomService.recentStudyRoom(userId)).thenReturn(studyRoomDtoList);
        // 최근 방문 스터디룸 목록 조회 API 호출
        ResponseEntity<?> response = studyRoomController.recentRoom(userDetails);

        /* --- THEN --- */
        // 응답 검증
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(studyRoomDtoList);
        // 메서드 호출 검증
        verify(studyRoomService, times(1)).recentStudyRoom(userId);
    }

    /**
     * 날짜별 랭킹 조회 테스트
     *
     * @throws Exception
     */
    @Test
    void rankRoomUserTest() throws Exception {
        /* --- GIVEN --- */
        LocalDate date = LocalDate.now();
        Integer limit = 10;
        // RankRoomDto 리스트(방 랭킹)
        List<RankRoomDto> rankRoomDtoList = new ArrayList<>();
        rankRoomDtoList.add(new RankRoomDto(1, 1L, "Rank 1 Room", date, 100));
        rankRoomDtoList.add(new RankRoomDto(2, 2L, "Rank 2 Room", date, 80));
        // RankUserDto 리스트(회원 랭킹)
        List<RankUserDto> rankUserDtoList = new ArrayList<>();
        rankUserDtoList.add(new RankUserDto(1, 1, "Rank 1 User", date, 200));
        rankUserDtoList.add(new RankUserDto(2, 2, "Rank 2 User", date, 180));
        // RankDto 객체
        RankDto rankDto = new RankDto(rankRoomDtoList, rankUserDtoList);
        //회원 정보

        /* --- WHEN --- */
        // 스터디룸 서비스 getRanks() 모의 동작
        when(studyRoomService.getRanks(date, limit)).thenReturn(rankDto);
        // 랭킹 조회 API 호출
        ResponseEntity<?> response = studyRoomController.rankRoomUser(date, limit);

        /* --- THEN --- */
        // 응답 검증
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo(rankDto);
        // 메서드 호출 검증
        verify(studyRoomService, times(1)).getRanks(date, limit);
    }

}
