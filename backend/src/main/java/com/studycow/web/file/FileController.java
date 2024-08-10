package com.studycow.web.file;

import com.studycow.dto.file.FileDeleteRequestDto;
import com.studycow.service.file.FileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

/**
 * <pre>
 *     GCS 파일 관리 컨트롤러 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17
 */
@Tag(name = "File", description = "GCS 파일 관리")
@RestController
@RequestMapping("/file")
@CrossOrigin("*")
@RequiredArgsConstructor
public class FileController {
    private final FileService fileService;

    @Operation(
            summary = "파일 업로드",
            description = "Google Cloud Storage 버킷에 파일을 업로드하고 링크를 반환합니다.<br>링크로 어디서나 파일에 접근할 수 있습니다.")
    @ResponseStatus(HttpStatus.OK)
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(MultipartFile file) throws Exception {
        String fileLink = fileService.uploadFile(file);
        return new ResponseEntity<>(fileLink, HttpStatus.OK);
    }

    @Operation(
            summary = "파일 삭제",
            description = "Google Cloud Storage 버킷에 있는 파일을 삭제합니다.<br>링크를 쿼리 파라미터로 전달하여 삭제 요청할 수 있습니다.<br>{'fileLink': 'string'} 전달")
    @ResponseStatus(HttpStatus.OK)
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteFile(@RequestBody @Valid FileDeleteRequestDto fileDeleteRequestDto) throws Exception {
        fileService.deleteFile(fileDeleteRequestDto.getFileLink());
        return new ResponseEntity<>("파일 삭제 성공", HttpStatus.OK);
    }

}
