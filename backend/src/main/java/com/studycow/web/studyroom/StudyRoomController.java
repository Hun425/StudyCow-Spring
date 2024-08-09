package com.studycow.web.studyroom;

import com.studycow.dto.calculate.RankDto;
import com.studycow.dto.listoption.ListOptionDto;
import com.studycow.dto.studyroom.StudyRoomDto;
import com.studycow.dto.studyroom.StudyRoomRequestDto;
import com.studycow.dto.user.CustomUserDetails;
import com.studycow.service.file.FileService;
import com.studycow.service.studyroom.StudyRoomService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.TypeMismatchException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.beans.PropertyEditorSupport;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;


/**
 * <pre>
 *     스터디룸 CRUD 컨트롤러 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@Slf4j
@Tag(name = "StudyRoom", description = "스터디룸 CRUD")
@RestController
@RequestMapping("/room")
@CrossOrigin("*")
@RequiredArgsConstructor
public class StudyRoomController {

    private final StudyRoomService studyRoomService;
    private final FileService fileService;

    @Operation(summary = "스터디룸 생성", description = "스터디룸을 생성하여 저장합니다.")
    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("/create")
    public ResponseEntity<?> createStudyRoom(
            @ModelAttribute @Valid StudyRoomRequestDto requestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws Exception {
            //토큰으로 회원 정보 가져오기
            int userId = userDetails.getUser().getUserId(); //생성(방장) 회원 번호

            //요청 변수를 StudyRoomDto에 넣기
            StudyRoomDto studyRoomDto = new StudyRoomDto();
            studyRoomDto.setUserId(userId);
            studyRoomDto.setRoomTitle(requestDto.getRoomTitle());
            studyRoomDto.setRoomMaxPerson(requestDto.getRoomMaxPerson());
            studyRoomDto.setRoomEndDate(requestDto.getRoomEndDate());
            studyRoomDto.setRoomStatus(requestDto.getRoomStatus());
            studyRoomDto.setRoomContent(requestDto.getRoomContent());

            // 요청에 파일 있을 경우 클라우드에 업로드 후 링크 생성
            if (requestDto.getRoomThumb() != null) {
                String fileLink = fileService.uploadFile(requestDto.getRoomThumb());
                studyRoomDto.setRoomThumb(fileLink);
            }

            //방 생성
            studyRoomService.createStudyRoom(studyRoomDto);

            return new ResponseEntity<>("스터디룸 생성 성공", HttpStatus.CREATED);
    }

    @Operation(summary = "상세 조회", description = "스터디룸의 상세 정보를 조회합니다.")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/{studyRoomId}")
    public ResponseEntity<?> getStudyRoomInfo(@PathVariable("studyRoomId") Long studyRoomId) throws Exception {
            StudyRoomDto studyRoomDto = studyRoomService.getStudyRoomInfo(studyRoomId);
            return ResponseEntity.ok(studyRoomDto);
    }

    @Operation(
            summary = "목록 조회",
            description = "스터디룸 목록을 조회합니다.<br>" +
                    "스터디룸명 검색어, 정렬 기준, 정렬 방향을 설정할 수 있고, null일 경우 전체 조회합니다.")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/list")
    public ResponseEntity<?> listStudyRoom(@ModelAttribute ListOptionDto listOptionDto) throws Exception {
            List<StudyRoomDto> studyRoomDtoList = studyRoomService.listStudyRoom(listOptionDto);
            return ResponseEntity.ok(studyRoomDtoList);
    }

    @Operation(summary = "스터디룸 정보 수정", description = "스터디방 상세 정보를 수정합니다.(방장만 가능합니다)")
    @ResponseStatus(HttpStatus.OK)
    @PatchMapping("/{studyRoomId}")
    public ResponseEntity<?> updateStudyRoom(
            @PathVariable("studyRoomId") Long studyRoomId,
            @ModelAttribute @Valid StudyRoomRequestDto studyRoomRequestDto,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) throws Exception {
            //토큰으로 회원 정보 가져오기
            int userId = userDetails.getUser().getUserId(); //요청 회원 번호

            studyRoomService.updateStudyRoom(studyRoomId, studyRoomRequestDto, userId);
            return new ResponseEntity<>("스터디룸 수정 성공", HttpStatus.OK);
    }

    @Operation(summary = "최근 입장 목록 조회", description = "최근 입장한 스터디룸 목록을 조회합니다.")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/recent")
    public ResponseEntity<?> recentRoom(@AuthenticationPrincipal CustomUserDetails userDetails) throws Exception {
            int userId = userDetails.getUser().getUserId();
            List<StudyRoomDto> studyRoomDtoList = studyRoomService.recentStudyRoom(userId);
            return ResponseEntity.ok(studyRoomDtoList);
    }

    @Operation(
            summary = "랭크 조회",
            description = "날짜별로 유저, 방 랭크를 조회합니다. <br>" +
                    "date : 조회날짜 (기본값 06시 기준 금일)<br>limit : 랭크 n위까지 조회(기본값 10)")
    @ResponseStatus(HttpStatus.OK)
    @GetMapping("/rank")
    public ResponseEntity<?> rankRoomUser(
            @RequestParam(value = "date", required = false) LocalDate date,
            @RequestParam(value = "limit", required = false) Integer limit
    ) throws Exception {

            log.info("date : {}, limit : {}", date, limit);
            RankDto rankDto = studyRoomService.getRanks(date, limit);
            return ResponseEntity.ok(rankDto);
    }
}
