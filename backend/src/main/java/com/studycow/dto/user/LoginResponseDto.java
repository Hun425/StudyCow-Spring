package com.studycow.dto.user;

import lombok.*;

/**
 * 토큰 발급 Dto
 * @author 채기훈
 * @since JDK17
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@EqualsAndHashCode(callSuper = true)
@ToString(callSuper = true)
public class LoginResponseDto extends UserInfoDto {

    private String token;

}
