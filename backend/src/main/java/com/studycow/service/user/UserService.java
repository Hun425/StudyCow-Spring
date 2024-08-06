package com.studycow.service.user;


import com.studycow.dto.plan.PlannerCreateDto;
import com.studycow.dto.user.*;
import org.springframework.http.ResponseEntity;

import java.util.List;

/**
 * <pre>
 *     유저 서비스 구현 클래스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
public interface UserService {

    /** 로그인 메서드 **/
    LoginResponseDto login(LoginRequestDto loginRequestDto) ;

    /** 회원가입 메서드 **/
    SignUpResponseDto register(RegisterRequestDto signUpRequestDto);

    /** 유저 정보 조회 메서드 **/
    UserInfoDto getUserInfo(Long userId);

    /** 유저 업데이트 메서드 **/
    void updateUserInfo(UserUpdateDto userUpdateDto, CustomUserDetails customUserDetails);

    /** 유저 닉네임 검색 메서드 **/
    List<UserInfoDto> getUserInfoByNickName(String nickName);

}
