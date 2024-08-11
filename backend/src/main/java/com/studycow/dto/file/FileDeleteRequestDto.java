package com.studycow.dto.file;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * 파일 삭제 요청 DTO 클래스
 *
 * @author 박봉균
 * @since JDK17(Eclipse Temurin)
 */
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Valid
public class FileDeleteRequestDto {
    /** 삭제할 파일 링크 */
    @NotBlank(message = "입력값에 삭제할 파일 링크가 없습니다.")
    @Size(min = 1, max = 100, message = "파일 링크의 길이는 1~100입니다.")
    private String fileLink;
}
