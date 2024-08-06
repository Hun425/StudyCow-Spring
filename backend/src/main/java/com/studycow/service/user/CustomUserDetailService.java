package com.studycow.service.user;

import com.studycow.domain.User;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.dto.user.CustomUserInfoDto;
import com.studycow.exception.CustomException;
import com.studycow.exception.ErrorCode;
import com.studycow.repository.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 유저 로그인 Service
 * <pre>
 *     유저 로그인을 위한 UserDetailService
 * </pre>
 * @author 채기훈
 * @since JDK17
 */

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public UserDetails loadUserByUsername(String id) throws UsernameNotFoundException {
        User user = userRepository.findById(Long.parseLong(id))
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        CustomUserInfoDto dto  = modelMapper.map(user, CustomUserInfoDto.class);
        return new CustomUserDetails(dto);
    }
}
