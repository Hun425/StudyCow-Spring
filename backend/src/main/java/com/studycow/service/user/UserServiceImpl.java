package com.studycow.service.user;

import com.studycow.config.jwt.JwtUtil;
import com.studycow.domain.User;
import com.studycow.domain.UserGrade;
import com.studycow.dto.user.*;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import com.studycow.repository.user.UserGradeRepository;
import com.studycow.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * <pre>
 * 유저 서비스 구현 클래스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService  {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final UserGradeRepository userGradeRepository;

    /**
     *  로그인 메서드
     *
     * @param loginRequestDto 로그인 요청 정보
     * @return LoginResponseDto 로그인 응답 정보
     */
    @Override
    @Transactional
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        String userEmail = loginRequestDto.getUserEmail();
        String userPassword = loginRequestDto.getPassword();

        User user = userRepository.findByUserEmail(userEmail)
                .orElseThrow(()->new CustomException(ErrorCode.WRONG_EMAIL));
        if(user ==null) throw new CustomException(ErrorCode.USER_NOT_FOUND);
        if(!passwordEncoder.matches(userPassword,user.getUserPassword())){
            log.error("로그인 실패 비밀번호 오류");
            throw new CustomException(ErrorCode.WRONG_PASSWORD);
        }

        UserGrade currentUserGrade = userGradeRepository.findById(user.getUserGrade().getGradeCode())
                .orElseThrow(()->new CustomException(ErrorCode.NOT_FOUND_GRADE));

        CustomUserInfoDto info = modelMapper.map(user, CustomUserInfoDto.class);
        String accessToken = jwtUtil.createAccessToken(info);

        UserGradeDto userGradeDto = new UserGradeDto();

        userGradeDto.setGradeCode(currentUserGrade.getGradeCode());
        userGradeDto.setGradeName(currentUserGrade.getGradeName());
        userGradeDto.setMaxExp(currentUserGrade.getMaxEXP());
        userGradeDto.setMinExp(currentUserGrade.getMinEXP());

        LoginResponseDto loginResponseDto = new LoginResponseDto();

        loginResponseDto.setToken(accessToken);
        loginResponseDto.setUserEmail(userEmail);
        loginResponseDto.setUserId(user.getId());
        loginResponseDto.setUserExp(user.getUserExp());
        loginResponseDto.setUserNickName(user.getUserNickname());
        loginResponseDto.setUserGrade(userGradeDto);
        loginResponseDto.setUserJoinDate(user.getUserJoinDate());
        loginResponseDto.setUserUpdateDate(user.getUserUpdateDate());
        loginResponseDto.setUserThumb(user.getUserThumb());
        return loginResponseDto;
    }

    /**
     * 회원가입 메서드
     *
     * @param signUpRequestDto 회원가입 정보 요청
     * @return SignUpResponseDto 회원가입 상태 정보 반환
     */
    @Transactional
    public SignUpResponseDto register(RegisterRequestDto signUpRequestDto){

        Optional<UserGrade> optionalUserGrade = userGradeRepository.findById(1);

        if(optionalUserGrade.isPresent()){
            signUpRequestDto.setUserGrade(optionalUserGrade.get());
        }else throw new CustomException(ErrorCode.NOT_FOUND_GRADE);
        if(userRepository.findByUserEmail(signUpRequestDto.getUserEmail()).isPresent()){
            throw new CustomException(ErrorCode.WRONG_EMAIL);
        }
        String password = signUpRequestDto.getUserPassword();

        signUpRequestDto.setUserPassword(passwordEncoder.encode(password));

        User user = modelMapper.map(signUpRequestDto, User.class);
        userRepository.save(user);


        SignUpResponseDto responseDto = new SignUpResponseDto();
        responseDto.setUserId(user.getId());
        responseDto.setMessage("회원가입 성공");

        return responseDto;
    }

    /**
     * 사용자 정보 조회 메서드
     *
     * @param userId 로그인 중인 사용자 정보
     * @return UserInfoDto 사용자 정보 반환
     */
    @Transactional
    @Override
    public UserInfoDto getUserInfo(Long userId){

        Optional<User> user = userRepository.findById(userId);


        if(user.isPresent()  ){
            return modelMapper.map(user.get(), UserInfoDto.class);
        }

        return null;
    }

    /**
     * 사용자 정보 업데이트
     *
     * @param userUpdateDto 업데이트 정보 요청
     * @param customUserDetails 로그인 중인 사용자 정보
     */
    @Transactional
    @Override
    public void updateUserInfo(UserUpdateDto userUpdateDto, CustomUserDetails customUserDetails){

        CustomUserInfoDto CurrentUser = customUserDetails.getUser();
        Optional<User>user = userRepository.findById((long)CurrentUser.getUserId());

        int currentId = customUserDetails.getUser().getUserId();
        log.info("currnetId: {}"+currentId);

        // 유저가 존재하고, 요청한 유저와 업데이트 유저의 정보가 같으면 수행
        if(user.isPresent()){

            User newuser = user.get();
            newuser.setUserEmail(userUpdateDto.getUserEmail());
            newuser.setUserThumb(userUpdateDto.getUserThumb());
            newuser.setUserNickname(userUpdateDto.getUserNickname());
            newuser.setUserPublic(userUpdateDto.getUserPublic());

            userRepository.save(newuser);
        }
    }

    /**
     * 사용자 이름 검색 메서드
     *
     * @param nickName 검색할 사용자 이름
     * @return List<UserInfoDto> 검색 문자를 포함하는 사용자 모두 반환
     */
    @Transactional
    @Override
    public List<UserInfoDto> getUserInfoByNickName(String nickName){
        List<User> infos = userRepository.findByUserNicknameContainingIgnoreCase(nickName)
                .orElseThrow(()->new CustomException(ErrorCode.USER_NOT_FOUND));

        return infos.stream()
                .map(user->modelMapper.map(user, UserInfoDto.class))
                .collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void updateUserPublic(CustomUserDetails customUserDetails){
        Optional<User> user = userRepository.findById((long)customUserDetails.getUser().getUserId());
        if(!user.isPresent()){
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
        int currentStatus = user.get().getUserPublic();
        if(currentStatus == 1)user.get().setUserPublic(0);
        else user.get().setUserPublic(1);

    }
}
