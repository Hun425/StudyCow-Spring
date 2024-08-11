package com.studycow.planner;

import com.studycow.domain.SubjectCode;
import com.studycow.domain.User;
import com.studycow.domain.UserSubjectPlan;
import com.studycow.dto.plan.PlanCountByDateDto;
import com.studycow.dto.plan.PlannerCreateDto;
import com.studycow.dto.plan.PlannerGetDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.dto.user.CustomUserInfoDto;
import com.studycow.exception.CustomException;
import com.studycow.repository.planner.PlannerRepository;
import com.studycow.repository.subjectcode.SubjectCodeRepository;
import com.studycow.repository.user.UserRepository;
import com.studycow.service.planner.PlannerServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.modelmapper.ModelMapper;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * 플래너 단위 테스트 코드
 *
 * @author 채기훈
 * @since JDK17
 */
@SpringBootTest
@ActiveProfiles("test")
@Transactional
class PlannerServiceImplTest {


    @Mock
    private PlannerRepository plannerRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private SubjectCodeRepository subjectCodeRepository;
    @Mock
    private ModelMapper modelMapper;

    @InjectMocks
    private PlannerServiceImpl plannerService;

    private CustomUserInfoDto testUserInfo;
    private User testUser;
    private SubjectCode testSubjectCode;
    private UserSubjectPlan testPlan;
    private CustomUserDetails customUserDetails;
    private PlannerCreateDto plannerCreateDto;

    /**
     * 테스트를 위한 사전 객체 생성
     */
    @BeforeEach
    void setUp() {
        testUserInfo = new CustomUserInfoDto();
        testUserInfo.setUserId(1);
        testUserInfo.setUserName("Test User");
        testUserInfo.setUserEmail("test@example.com");
        testUserInfo.setUserJoinDate(LocalDateTime.now());

        testUser = new User();
        testUser.setId(1);
        testUser.setUserNickname("Test User");

        testSubjectCode = new SubjectCode(1, "Test Subject", 100, 1, LocalDateTime.now());

        testPlan = new UserSubjectPlan();
        testPlan.setUser(testUser);
        testPlan.setSubCode(testSubjectCode);
        testPlan.setPlanId(1L);
        testPlan.setPlanDate(LocalDate.now());
        testPlan.setPlanContent("Test Content");
        testPlan.setPlanStudyTime(60);

        customUserDetails = new CustomUserDetails(testUserInfo);

        plannerCreateDto = new PlannerCreateDto();
        plannerCreateDto.setSubCode(1);
        plannerCreateDto.setPlanDate(LocalDate.now());
        plannerCreateDto.setPlanContent("Test Content");
        plannerCreateDto.setPlanStudyTime(60);
    }

    /**
     * 플래너 생성 로직 테스트
     */
    @Test
    void givenValidPlannerCreateDto_whenCreatePlan_thenPlanIsSaved() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(subjectCodeRepository.findById(1)).thenReturn(Optional.of(testSubjectCode));

        // When
        plannerService.createPlan(customUserDetails, plannerCreateDto);

        // Then
        verify(plannerRepository).save(any(UserSubjectPlan.class));
    }

    /**
     * 유효하지 않는 유저가 플래너를 생성했을때 검증
     */
    @Test
    void givenNonExistentUser_whenCreatePlan_thenThrowCustomException() {
        // Given
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThrows(CustomException.class, () -> plannerService.createPlan(customUserDetails, plannerCreateDto));
    }

    /**
     * 특정 날짜 기준 플래너 조회 테스트
     */
    @Test
    void givenExistingUserAndDate_whenGetPlansByDateForUser_thenReturnPlanList() {
        // Given
        LocalDate testDate = LocalDate.now();
        when(plannerRepository.findByUserIdAndPlanDate(1L, testDate))
                .thenReturn(Optional.of(Arrays.asList(testPlan)));
        when(modelMapper.map(any(), eq(PlannerGetDto.class))).thenReturn(new PlannerGetDto());

        // When
        List<PlannerGetDto> result = plannerService.getPlansByDateForUser(1, testDate);

        // Then
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    /**
     * 특정 과목 기준 플래너 조회 테스트
     */
    @Test
    void givenExistingUserAndSubject_whenGetPlansBySubjectForUser_thenReturnPlanList() {
        // Given
        when(subjectCodeRepository.findById(1)).thenReturn(Optional.of(testSubjectCode));
        when(plannerRepository.findByUserIdAndSubCode(1L, testSubjectCode))
                .thenReturn(Optional.of(Arrays.asList(testPlan)));
        when(modelMapper.map(any(), eq(PlannerGetDto.class))).thenReturn(new PlannerGetDto());

        // When
        List<PlannerGetDto> result = plannerService.getPlansBySubjectForUser(1, 1);

        // Then
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    /**
     * 특정 플래너 기준 상세 조회 테스트
     */
    @Test
    void givenExistingUserAndPlan_whenGetPlanByIdForUser_thenReturnPlan() {
        // Given
        when(plannerRepository.findByUserIdAndPlanId(1L, 1L))
                .thenReturn(Optional.of(testPlan));
        when(modelMapper.map(testPlan, PlannerGetDto.class)).thenReturn(new PlannerGetDto());

        // When
        PlannerGetDto result = plannerService.getPlanByIdForUser(1, 1);

        // Then
        assertNotNull(result);
    }

    /**
     * 특정 월의 일별 플랜 개수 조회 테스트
     */
    @Test
    void givenValidMonthAndYear_whenGetPlanCountByDateForUser_thenReturnPlanCountList() {
        // Given
        YearMonth yearMonth = YearMonth.of(2023, 5);
        LocalDate startDate = yearMonth.atDay(1);
        LocalDate endDate = yearMonth.atEndOfMonth();
        List<PlanCountByDateDto> mockPlanCount = Arrays.asList(new PlanCountByDateDto(LocalDate.now(), 1,1));
        when(plannerRepository.findPlanCountByMonth(startDate, endDate, 1))
                .thenReturn(Optional.of(mockPlanCount));

        // When
        List<PlanCountByDateDto> result = plannerService.getPlanCountByDateForUser(5, 2023, 1);

        // Then
        assertFalse(result.isEmpty());
        assertEquals(1, result.size());
    }

    /**
     * 플래너 업데이트 테스트
     */
    @Test
    void givenExistingPlanAndValidDto_whenUpdatePlan_thenPlanIsUpdated() {
        // Given
        when(plannerRepository.findById(1L)).thenReturn(Optional.of(testPlan));
        when(subjectCodeRepository.findById(1)).thenReturn(Optional.of(testSubjectCode));

        // When
        plannerService.updatePlan(1, customUserDetails, plannerCreateDto);

        // Then
        verify(plannerRepository).save(any(UserSubjectPlan.class));
    }

    /**
     * 플래너 삭제 테스트
     */
    @Test
    void givenExistingPlan_whenDeletePlan_thenPlanIsDeleted() {
        // Given
        when(plannerRepository.findById(1L)).thenReturn(Optional.of(testPlan));

        // When
        plannerService.deletePlan(1, customUserDetails);

        // Then
        verify(plannerRepository).delete(testPlan);
    }

    /**
     * 플래너 상태 변경 테스트
     */
    @Test
    void givenExistingPlan_whenChangePlanStatus_thenStatusIsChanged() {
        // Given
        when(plannerRepository.findById(1L)).thenReturn(Optional.of(testPlan));

        // When
        plannerService.changePlanStatus(1, customUserDetails);

        // Then
        verify(plannerRepository).save(testPlan);
    }
}