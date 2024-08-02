
package com.studycow.web.studyroom;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.dto.user.CustomUserInfoDto;
import com.studycow.service.file.FileService;
import com.studycow.service.studyroom.StudyRoomService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


/**
 * <pre>
 *  스터디룸 CRUD 컨트롤러 테스트 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@WebMvcTest(StudyRoomController.class)
public class StudyRoomControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudyRoomService studyRoomService;

    @MockBean
    private FileService fileService;

    @Autowired
    private ObjectMapper objectMapper;

    private StudyRoomRequestDto studyRoomRequestDto;
    private StudyRoomDto studyRoomDto;
    private CustomUserDetails userDetails;

    @BeforeEach
    void setUp() {
        //스터디룸 요청 DTO 객체 생성
        studyRoomRequestDto = new StudyRoomRequestDto();
        studyRoomRequestDto.setRoomTitle("Test Study Room");
        studyRoomRequestDto.setRoomMaxPerson(5);
        studyRoomRequestDto.setRoomEndDate(LocalDate.now().plusDays(30));
        studyRoomRequestDto.setRoomStatus(1);
        studyRoomRequestDto.setRoomContent("This is a test study room");

        //스터디룸 DTO 객체 생성
        studyRoomDto = new StudyRoomDto();
        studyRoomDto.setId(1L);
        studyRoomDto.setRoomTitle("Test Study Room");
        studyRoomDto.setRoomMaxPerson(5);
        studyRoomDto.setRoomEndDate(LocalDate.now().plusDays(30));
        studyRoomDto.setRoomStatus(1);
        studyRoomDto.setRoomContent("This is a test study room");
        studyRoomDto.setUserId(1);

        // CustomUserInfoDto 객체 생성
        CustomUserInfoDto customUserInfoDto = new CustomUserInfoDto(
                1,
                "testName",
                "test@example.com",
                "password123",
                1,
                "thumb_url",
                1,
                0,
                LocalDateTime.now(),
                LocalDateTime.now(),
                "testNickname");

        // CustomUserDetails 객체 생성
        userDetails = new CustomUserDetails(customUserInfoDto);
    }

    /**
     * 스터디룸 생성 테스트
     * <pre>
     *     회원 정보 헤더 사용하므로
     *     .with(user(userDetails))
     *     .with(csrf())
     * </pre>
     *
     * @throws Exception
     */
    @Test
    @WithMockUser
    public void testCreateStudyRoom() throws Exception {
        doNothing().when(studyRoomService).createStudyRoom(any(StudyRoomDto.class));


        mockMvc.perform(MockMvcRequestBuilders.multipart("/room/create")
                        .file("roomThumb", new byte[]{}) // 빈 파일을 첨부하거나 실제 파일을 첨부
                        .param("roomTitle", "Test Study Room")
                        .param("roomMaxPerson", "5")
                        .param("roomEndDate", "2025-08-03")
                        .param("roomStatus", "1")
                        .param("roomContent", "This is a test study room")
                        .with(user(userDetails))
                        .with(csrf())
                        .with(request -> {
                            request.setMethod("POST"); // POST 메서드로 설정
                            return request;
                        }))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.content().string("스터디룸 생성 성공"));
    }

    /**
     * 스터디룸 상세 조회 테스트
     *
     * @throws Exception
    */
    @Test
    @WithMockUser
    public void testGetStudyRoomInfo() throws Exception {
        when(studyRoomService.getStudyRoomInfo(1L)).thenReturn(studyRoomDto);

        mockMvc.perform(get("/room/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.roomTitle").value("Test Study Room"));
    }

    /**
     * 스터디룸 목록 조회 테스트
     *
     * @throws Exception
    */
    @Test
    @WithMockUser
    public void testListStudyRoom() throws Exception {
        when(studyRoomService.listStudyRoom(any(ListOptionDto.class)))
                .thenReturn(Arrays.asList(studyRoomDto));

        mockMvc.perform(get("/room/list"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].roomTitle").value("Test Study Room"));
    }

    /**
     * 스터디룸 수정 테스트
     * <pre>
     *     회원 정보 헤더 사용하므로
     *     .with(user(userDetails))
     *     .with(csrf())
     * </pre>
     *
     * @throws Exception
    */
    @Test
    @WithMockUser
    public void testUpdateStudyRoom() throws Exception {
        doNothing().when(studyRoomService).updateStudyRoom(any(Long.class), any(StudyRoomRequestDto.class), any(Integer.class));

        mockMvc.perform(MockMvcRequestBuilders.multipart("/room/1")
                        .file("roomThumb", new byte[]{}) // 빈 파일을 첨부하거나 실제 파일을 첨부
                        .param("roomTitle", "Test Study Room")
                        .param("roomMaxPerson", "5")
                        .param("roomEndDate", "2025-08-02")
                        .param("roomStatus", "1")
                        .param("roomContent", "This is a test study room")
                        .with(user(userDetails))
                        .with(csrf())
                        .with(request -> {
                                request.setMethod("PATCH"); // PATCH 메서드로 설정
                                return request;
                        }))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("스터디룸 수정 성공"));
    }

}
