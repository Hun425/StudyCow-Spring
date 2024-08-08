package com.studycow.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * <pre>
 *     Custom 예외 응답을 위한 Enum 클래스
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Getter
@AllArgsConstructor
public enum ErrorCode {

    SUCCESS(HttpStatus.OK, "요청 및 응답 성공"),
    DUPLICATE_USERNAME(HttpStatus.CONFLICT,"중복된 유저 이름입니다."),
    DUPLICATE_USEREMAIL(HttpStatus.CONFLICT,"중복된 유저 이메일입니다."),
    WRONG_PASSWORD(HttpStatus.BAD_REQUEST,"비밀번호가 틀렸습니다."),
    WRONG_EMAIL(HttpStatus.BAD_REQUEST,"존재하지 않는 아이디입니다."),
    WRONG_DATE_FORMAT(HttpStatus.BAD_REQUEST, "잘못된 날짜 형식입니다."),
    WRONG_REQUEST_MAPPING(HttpStatus.BAD_REQUEST,"유효하지 않은 데이터 포맷입니다. 다시 양식에 맞춰 요청해주세요."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR,"서버 오류 발생"),
    DATABASE_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "데이터베이스 오류가 발생했습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED,"유효하지 않은 토큰입니다. 재로그인 해주세요"),
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,"해당하는 유저를 찾을 수 없습니다"),
    BAD_REQUEST(HttpStatus.BAD_REQUEST,"잘못된 요청입니다."),
    DUPLICATE_RESOURCE(HttpStatus.CONFLICT,"중복된 요청입니다"),
    NOT_AUTHENTICAION(HttpStatus.UNAUTHORIZED,"접근 권한이 없습니다. 로그인해주세요"),
    NOT_FOUND_GRADE(HttpStatus.NOT_FOUND,"해당 등급은 존재하지 않습니다"),
    NOT_FOUND_PLANNER(HttpStatus.NOT_FOUND,"해당 플래너가 존재하지 않습니다."),
    LOGIN_REQUIRED(HttpStatus.UNAUTHORIZED,"로그인이 필요한 서비스입니다."),
    NOT_FOUND_SUBJECT_CODE(HttpStatus.NOT_FOUND,"해당 과목코드가 존재하지 않습니다."),

    //파일 관리 오류 코드
    IO_EXCEPTION(HttpStatus.INTERNAL_SERVER_ERROR, "파일 또는 입출력 처리 중 오류가 발생했습니다."),

    //스터디룸 오류 코드
    NOT_FOUND_ROOM(HttpStatus.NOT_FOUND,"해당 스터디룸이 존재하지 않습니다."),
    UNAUTHORIZED_ROOM_UPDATE(HttpStatus.UNAUTHORIZED, "방장만 접근할 수 있는 서비스입니다."),

    // 친구 관리 오류 코드
    DUPLICATE_FRIEND(HttpStatus.CONFLICT, "이미 친구 관계입니다."),
    DUPLICATE_FRIEND_REQUEST(HttpStatus.CONFLICT, "이미 친구 요청을 보냈습니다."),
    FROM_USER_NOT_FOUND(HttpStatus.NOT_FOUND ,"요청을 보내는 사용자를 찾을 수 없습니다."),
    TO_USER_NOT_FOUND(HttpStatus.NOT_FOUND ,"요청을 받는 사용자를 찾을 수 없습니다."),
    SAME_FROM_TO(HttpStatus.BAD_REQUEST, "자기 자신에게 친구 요청을 보낼 수 없습니다."),
    NOT_FOUND_FRIEND_REQUEST(HttpStatus.NOT_FOUND, "존재하지 않는 친구 요청입니다."),
    NOT_FOUND_FRIEND(HttpStatus.NOT_FOUND, "존재하지 않는 친구 관계입니다."),
    UNAUTHORIZED_ACCEPT_FRIEND(HttpStatus.UNAUTHORIZED, "친구 요청 승인 권한이 없습니다.");


    private HttpStatus status;
    private final String message;
}




