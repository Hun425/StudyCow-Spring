package com.studycow.config;

import com.studycow.domain.User;
import com.studycow.domain.UserGrade;
import com.studycow.repository.user.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * 로그인 테스트 데이터 클래스
 * <pre>
 *     로그인 테스트를 위한 사전 데이터를 생성해줍니다
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Component
@RequiredArgsConstructor
public class DataInitializer {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;
    //@PostConstruct
    public void init() {

        UserGrade grade = new UserGrade();
        grade.setGradeCode(1);
        grade.setGradeName("Basic"); // 예시로 추가, 실제 값에 맞게 설정


        //테스트 초기 회원 생성
        User user = new User();

        /*
        //테스트 데이터 삽입
        User user1 = new User();
        user1.setUserName("TestUser");
                user1.setUserEmail("chae0738@naver.com");
                user1.setUserPassword(passwordEncoder.encode("asdf"));
                user1.setUserPublic(1);
                user1.setUserExp(0);
                user1.setUserJoinDate(LocalDateTime.now());
                user1.setUserUpdateDate(LocalDateTime.now());
                user1.setUserNickname("TestNick");
                user1.setUserBirthday(LocalDate.of(1990, 1, 1));
                user1.setUserGrade(grade); // 설정된 UserGrade 할당
                userRepository.save(user1);
        */
    }
}
