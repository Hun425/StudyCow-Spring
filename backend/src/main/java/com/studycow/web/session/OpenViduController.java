package com.studycow.web.session;

import java.util.List;
import java.util.Map;


import com.studycow.dto.roomLog.LogRequestDto;
import com.studycow.dto.roomLog.StudyRoomLogDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.roomLog.RoomLogService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import io.openvidu.java.client.Connection;
import io.openvidu.java.client.ConnectionProperties;
import io.openvidu.java.client.OpenVidu;
import io.openvidu.java.client.OpenViduHttpException;
import io.openvidu.java.client.OpenViduJavaClientException;
import io.openvidu.java.client.Session;
import io.openvidu.java.client.SessionProperties;

/**
 * <pre>
 *  OpenVidu 세션 컨트롤러 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@Tag(name = "OpenVidu")
@CrossOrigin(origins = "*")
@RequestMapping("/openvidu")
@RestController
@RequiredArgsConstructor
public class OpenViduController {

    @Value("${OPENVIDU_URL}")
    private String OPENVIDU_URL;

    @Value("${OPENVIDU_SECRET}")
    private String OPENVIDU_SECRET;

    private OpenVidu openvidu;
    private final RoomLogService roomLogService;

    @PostConstruct
    public void init() {
        this.openvidu = new OpenVidu(OPENVIDU_URL, OPENVIDU_SECRET);
    }

    /**
     * 방 입장
     *
     * @param studyRoomId 방 ID이자 세션 ID
     * @param params      Connection properties
     * @return 커넥션 토큰
     */
    @Operation(summary = "방 입장(연결)", description = "방(세션) ID로 세션을 조회하고 없을 시, 세션을 생성합니다.<br>세션이 있는 경우 연결하고 커넥션 토큰을 반환합니다.")
    @PostMapping("/connect/{studyRoomId}")
    public ResponseEntity<?> createConnection(
            @PathVariable("studyRoomId") Long studyRoomId,
            @RequestBody(required = false) Map<String, Object> params,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        try {
            // 세션이 존재하는지 확인
            Session session = openvidu.getActiveSession(studyRoomId.toString());

            // 없을 경우 생성함
            if (session == null) {
                session = initializeSession(studyRoomId.toString());
            }

            // 세션과 연결
            //Connection connection = session.createConnection(new ConnectionProperties());
            ConnectionProperties properties = new ConnectionProperties.Builder().build();
            Connection connection = session.createConnection(properties);

            int userId = userDetails.getUser().getUserId();
            StudyRoomLogDto studyRoomLogDto = roomLogService.enterRoom(studyRoomId, userId);
            //studyRoomLogDto.setToken(connection.getToken());
            //토큰 반환
            return ResponseEntity.ok(studyRoomLogDto);
        } catch (Exception e) {
            return new ResponseEntity<>("방 입장 실패 : " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    @Operation(
            summary = "연결 종료",
            description = "방(세션) ID의 token에 해당하는 연결을 종료합니다.<br>마지막 연결일 경우, 세션을 닫습니다.<br>token : 방id 전달")
    @PostMapping("/disconnect/{studyRoomId}")
    public ResponseEntity<?> disconnect(
            @PathVariable("studyRoomId") Long studyRoomId,
            @RequestBody @Valid LogRequestDto logRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        try {
            String token = logRequestDto.getToken();
            Session session = openvidu.getActiveSession(studyRoomId.toString());

            // Openvidu 에서 사용자 연결 끊기
            List<Connection> connections = session.getConnections();

            // Session.getActiveConnections()에서 반환된 목록에서 원하는 Connection 개체를 찾고 연결 끊기
            boolean tokenMatch = false;
            for (Connection connection : connections) {
                if (connection.getToken().equals(token)) {
                    System.out.println(connection.getToken() + " = " + token);
                    session.forceDisconnect(connection);
                    tokenMatch = true;
                    break;
                }
            }
            // 토큰 일치하지 않아 연결 종료 실패
            if (!tokenMatch) {
                return new ResponseEntity<>("연결 종료 실패 : 일치하는 토큰이 없습니다.", HttpStatus.BAD_REQUEST);
            }

            // 연결된 사용자가 없을 경우 세션을 닫습니다.
            if (session.getConnections().isEmpty()) {
                session.close();
            }

            int userId = userDetails.getUser().getUserId();
            StudyRoomLogDto studyRoomLogDto = roomLogService.exitRoom(logRequestDto, userId);

            return ResponseEntity.ok(studyRoomLogDto);
        } catch (Exception e) {
            return new ResponseEntity<>("연결 종료 실패 : " + e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 방 세션 생성(초기화)
     *
     * @param
     * @return The Session ID
     */
    private Session initializeSession(String studyRoomId) throws OpenViduJavaClientException, OpenViduHttpException {
        //SessionProperties 빌드
        SessionProperties properties = new SessionProperties.Builder()
                .customSessionId(studyRoomId)
                .build();

        // 세션 생성
        Session session = openvidu.createSession(properties);

        // 생성한 세션 번호와 방 번호가 다른 경우
        if (!session.getSessionId().equals(studyRoomId)) {
            throw new RuntimeException("방 ID번호와 세션 ID번호가 다름");
        }

        return session;
    }

}
