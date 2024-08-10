package com.studycow.user;

import com.studycow.config.jwt.JwtUtil;
import com.studycow.domain.UserGrade;
import com.studycow.dto.user.*;
import com.studycow.exception.CustomException;
import com.studycow.repository.user.UserRepository;
import com.studycow.repository.user.UserGradeRepository;
import com.studycow.service.user.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
class UserServiceTest {

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserGradeRepository userGradeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private RegisterRequestDto registerRequestDto;
    private LoginRequestDto loginRequestDto;

    @BeforeEach
    void setUp() {
        // 테스트용 UserGrade 생성
        UserGrade userGrade = new UserGrade(1, "Beginner", 0, 100);
        userGradeRepository.save(userGrade);

        // 회원가입 요청 DTO 생성
        registerRequestDto = new RegisterRequestDto();
        registerRequestDto.setUserEmail("test@example.com");
        registerRequestDto.setUserPassword("password123");
        registerRequestDto.setUserNickName("TestUser");
        registerRequestDto.setUserPublic(1);

        // 로그인 요청 DTO 생성
        loginRequestDto = new LoginRequestDto();
        loginRequestDto.setUserEmail("test@example.com");
        loginRequestDto.setPassword("password123");
    }

    @Test
    void registerAndLoginTest() {
        // Given: 회원가입 요청

        // When: 회원가입 실행
        SignUpResponseDto signUpResponseDto = userService.register(registerRequestDto);

        // Then: 회원가입 결과 확인
        assertNotNull(signUpResponseDto);
        assertEquals("회원가입 성공", signUpResponseDto.getMessage());
        assertTrue(signUpResponseDto.getUserId() > 0);

        // Given: 로그인 요청

        // When: 로그인 실행
        LoginResponseDto loginResponseDto = userService.login(loginRequestDto);

        // Then: 로그인 결과 확인
        assertNotNull(loginResponseDto);
        assertEquals("test@example.com", loginResponseDto.getUserEmail());
        assertEquals("TestUser", loginResponseDto.getUserNickName());
        assertNotNull(loginResponseDto.getToken());
        assertEquals(1, loginResponseDto.getUserGrade().getGradeCode());
        assertEquals("Beginner", loginResponseDto.getUserGrade().getGradeName());
    }

    @Test
    void registerDuplicateEmailTest() {
        // Given: 첫 번째 회원가입
        userService.register(registerRequestDto);

        // When & Then: 중복된 이메일로 회원가입 시도
        RegisterRequestDto duplicateEmailDto = new RegisterRequestDto();
        duplicateEmailDto.setUserEmail("test@example.com");
        duplicateEmailDto.setUserPassword("differentpassword");
        duplicateEmailDto.setUserNickName("DifferentUser");

        assertThrows(CustomException.class, () -> userService.register(duplicateEmailDto));
    }

    @Test
    void loginWithWrongPasswordTest() {
        // Given: 회원가입
        userService.register(registerRequestDto);

        // When & Then: 잘못된 비밀번호로 로그인 시도
        loginRequestDto.setPassword("wrongpassword");
        assertThrows(CustomException.class, () -> userService.login(loginRequestDto));
    }
}