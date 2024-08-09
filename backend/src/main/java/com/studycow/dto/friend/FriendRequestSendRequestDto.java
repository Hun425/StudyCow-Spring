package com.studycow.dto.friend;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 친구 요청 전송 요청 DTO 클래스
 *
 * @author 박봉균
 * @since JDK17(Eclipse Temurin)
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Valid
public class FriendRequestSendRequestDto {
    /** 친구 요청 보낼 회원 고유번호 */
    @Max(value = Integer.MAX_VALUE, message = "회원 고유번호는 최대 2,147,483,647 입니다.")
    @Min(value = 1, message = "회원 고유번호는 양의 정수입니다.")
    private int toUserId;

}
