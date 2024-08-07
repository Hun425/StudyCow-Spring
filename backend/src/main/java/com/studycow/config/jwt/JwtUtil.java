package com.studycow.config.jwt;

import com.studycow.dto.user.CustomUserInfoDto;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.time.ZonedDateTime;
import java.util.Date;

/**
 * Jwt 관련 메서드 클래스
 * <pre>
 *     Jwt를 관리하는 메서드가 모여있는 클래스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Slf4j
@Component
public class JwtUtil {

    private Key key;
    private final long accessTokenExpTime;

    public JwtUtil(
            @Value("${jwt.secret}") String secretKey,
            @Value("${jwt.expiration_time}") String accessTokenExpTime
    ) {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        this.key = Keys.hmacShaKeyFor(keyBytes);
        this.accessTokenExpTime = Long.parseLong(accessTokenExpTime);
    }


    public String createAccessToken(CustomUserInfoDto user){
        return createToken(user, accessTokenExpTime);
    }

    /**
     * AccessToken 생성
     *
     * @param user,accessTokenExpTime 요청한 사용자,accessToken 유효기간
     * @return String 토큰
     */
    private String createToken(CustomUserInfoDto user, long accessTokenExpTime){
        Claims claims = Jwts.claims();
        claims.put("userId",user.getUserId());
        claims.put("userName",user.getUserName());
        claims.put("userEmail",user.getUserEmail());

        ZonedDateTime now = ZonedDateTime.now();
        ZonedDateTime tokenValidity = now.plusSeconds(accessTokenExpTime);

        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(Date.from(now.toInstant()))
                .setExpiration(Date.from(tokenValidity.toInstant()))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * 현재 요청한 사용자 조회
     * @param token 요청자 토큰
     * @return Long 요청자 유저Id
     */
    public int getUserId(String token){
        Claims claims = parseClaims(token);

        return ((Number)claims.get("userId")).intValue();
    }

    /**
     * 토큰 유효성 검증
     * @param token 요청자 토큰
     * @return boolean 유효하면 true, 아니면 false + 예외
     */
    public boolean validateToken(String token){
        try{
            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
            return true;
        }
        catch(io.jsonwebtoken.security.SecurityException | MalformedJwtException e){
            log.info("유효하지 않은 Jwt 토큰입니다.");
        }catch(ExpiredJwtException e){
            log.info("만료된 Jwt 토큰입니다.");
        }catch(UnsupportedJwtException e){
            log.info("지원하지 않는 형식의 토큰값 입니다.");
        }catch(IllegalArgumentException e){
            log.info("Jwt 속성이 비어있습니다.");
        }
        return false;
    }

    /**
     * jwt Claims 분석
     * @param accessToken 토큰
     * @return Claims 반환
     */
    public Claims parseClaims(String accessToken){
        try{
            return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(accessToken).getBody();
        }catch (ExpiredJwtException e){
            return e.getClaims();
        }
    }
}
