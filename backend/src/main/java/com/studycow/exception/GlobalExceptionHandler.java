package com.studycow.exception;

import com.fasterxml.jackson.databind.JsonMappingException;
import jakarta.persistence.PersistenceException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import javax.naming.AuthenticationException;
import java.io.IOException;
import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * <pre>
 *     전역 예외처리기 설정 클래스
 * </pre>
 *
 * @author 채기훈
 * @since JDK17
 */
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    /**
     * 전역 예외 처리
     *
     * @param e Exception
     * @return ResponseEntity<ErrorResponse>
     */
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    @ExceptionHandler(java.lang.Exception.class)
    protected ResponseEntity<ErrorResponse> handleException(java.lang.Exception e) {
        log.error(e.getMessage(), e);

        ErrorResponse response = new ErrorResponse(ErrorCode.INTERNAL_SERVER_ERROR);
        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    /**
     * <pre>
     * 메서드 값 검증 예외처리 - @Valid 바인딩 에러
     * 주로 @RequestBody , @RequestPart 어노테이션에서 발생
     * </pre>
     *
     * @param e MethodArgumentNotValidException
     * @return ResponseEntity<ErrorResponse>
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    protected ResponseEntity<com.studycow.exception.ErrorResponse> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {

        List<com.studycow.exception.ErrorResponse.FieldError> errors = new ArrayList<>();
        for (FieldError fieldError : e.getFieldErrors()) {
            log.error("name: {}, message: {}", fieldError.getField(), fieldError.getDefaultMessage());
            com.studycow.exception.ErrorResponse.FieldError error = new com.studycow.exception.ErrorResponse.FieldError();
            error.setField(fieldError.getField());
            error.setMessage(fieldError.getDefaultMessage());

            // 날짜 형식 관련 에러 처리
            if (fieldError.getDefaultMessage() != null &&
                    fieldError.getDefaultMessage().contains("Failed to convert property value of type 'java.lang.String' to required type 'java.time.LocalDate'")) {
                error.setMessage("잘못된 날짜 형식입니다. 'YYYY-MM-DD' 형식으로 입력해 주세요.");
            }

            errors.add(error);
        }

        com.studycow.exception.ErrorResponse response = new com.studycow.exception.ErrorResponse(ErrorCode.BAD_REQUEST, errors);
        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    protected ResponseEntity<ErrorResponse> handleMethodArgumentTypeMismatchException(MethodArgumentTypeMismatchException e) {
        ErrorResponse response = new ErrorResponse(ErrorCode.WRONG_REQUEST_MAPPING);

        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    protected ResponseEntity<ErrorResponse> handleJsonMappingException(HttpMessageNotReadableException e) {
        ErrorResponse response = new ErrorResponse(ErrorCode.WRONG_REQUEST_MAPPING);

        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    /**
     * 비로그인 사용자 예외처리
     *
     * @param e AccessDeniedException
     * @return ResponseEntity<ErrorResponse>
     */
    @ExceptionHandler(AccessDeniedException.class)
    protected ResponseEntity<ErrorResponse> handleAccessDeniedException(AccessDeniedException e) {
        log.error(e.getMessage());
        ErrorResponse response = new ErrorResponse(ErrorCode.NOT_AUTHENTICAION);
        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    /**
     * 시큐리티에서 인가 처리 대신해서 사용
     *
     * @param e AuthenticationException
     * @return ResponseEntity<ErrorResponse>
     */
    @ExceptionHandler(AuthenticationException.class)
    protected ResponseEntity<ErrorResponse> handleAuthenticationException(AuthenticationException e) {
        log.error(e.getMessage());
        ErrorResponse response = new ErrorResponse(ErrorCode.USER_NOT_FOUND);
        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    @ExceptionHandler(InsufficientAuthenticationException.class)
    protected ResponseEntity<ErrorResponse> handleInsufficientAuthenticationException(InsufficientAuthenticationException e) {
        log.error(e.getMessage());
        ErrorResponse response = new ErrorResponse(ErrorCode.LOGIN_REQUIRED);
        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    /**
     * IOException 처리
     *
     * @param e IOException
     * @return ResponseEntity<ErrorResponse>
     */
    @ExceptionHandler(IOException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<ErrorResponse> handleIOException(IOException e) {
        log.error(e.getMessage());
        ErrorResponse response = new ErrorResponse(ErrorCode.IO_EXCEPTION);
        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    /**
     * JPA 표준 예외 처리
     *
     * @param e PersistenceException
     * @return ResponseEntity<ErrorResponse>
     */
    @ExceptionHandler(PersistenceException.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ResponseEntity<ErrorResponse> handlePersistenceException(PersistenceException e) {
        log.error(e.getMessage());
        ErrorResponse response = new ErrorResponse(ErrorCode.DATABASE_ERROR);
        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

    /**
     * 날짜 형식 예외 처리
     *
     * @param e DateTimeParseException
     * @return ResponseEntity<ErrorResponse>
     */
    @ExceptionHandler(DateTimeParseException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    protected ResponseEntity<ErrorResponse> handleDateTimeParseException(DateTimeParseException e) {
        log.error(e.getMessage());
        ErrorResponse errorResponse = new ErrorResponse(ErrorCode.WRONG_DATE_FORMAT);
        return ResponseEntity.status(errorResponse.getErrorCode()).body(errorResponse);
    }

    /**
     * 커스텀 예외 처리
     *
     * @param e CustomException
     * @return ResponseEntity<ErrorResponse>
     */
    @ExceptionHandler(CustomException.class)
    protected ResponseEntity<ErrorResponse> handleCustomException(CustomException e) {
        log.error(e.getMessage());
        ErrorCode errorCode = e.getErrorCode();
        ErrorResponse response = new ErrorResponse(errorCode);
        return ResponseEntity.status(response.getErrorCode()).body(response);
    }

}
