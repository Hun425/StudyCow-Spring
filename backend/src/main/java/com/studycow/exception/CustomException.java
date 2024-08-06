package com.studycow.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <pre>
 *     비지니스 로직 공통 예외 처리 클래스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Getter
@AllArgsConstructor
public class CustomException extends RuntimeException {
    private final ErrorCode errorCode;
}
