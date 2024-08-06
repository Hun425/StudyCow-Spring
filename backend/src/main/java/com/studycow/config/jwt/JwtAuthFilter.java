package com.studycow.config.jwt;

import com.studycow.service.user.CustomUserDetailService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Jwt 인증 필터 클래스
 * <pre>
 *     시큐리티의 세션 방식이 아닌, Jwt 방식을 적용하기 위한 필터를 설정합니다
 * </pre>
 * @author 채기훈
 * @since JDK17
 */

@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final CustomUserDetailService customUserDetailService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        String authorizationHeader = request.getHeader("Authorization");
        String path = request.getRequestURI();

        // 로그인 요청 경로를 확인하여 필터를 적용하지 않음
        if (path.startsWith("/api/v1/auth/login")) {
            filterChain.doFilter(request, response);
            return;
        }

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            String token = authorizationHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                int userId = jwtUtil.getUserId(token);

                UserDetails userDetails = customUserDetailService.loadUserByUsername(String.valueOf(userId));
                if (userDetails != null) {
                    UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authentication);

                }

            }
        }
        filterChain.doFilter(request, response);
    }

}
