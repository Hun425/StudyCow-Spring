package com.studycow.dto.user;

import com.studycow.domain.UserGrade;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class RegisterRequestDto {

    @NotNull
    @NotBlank
    private String userEmail;

    @NotNull
    @NotBlank
    private String userPassword;

    @NotNull
    private int userPublic = 0;

    private String userThumb;

    private UserGrade userGrade;

    private int userExp = 0;

    private LocalDateTime userJoinDate = LocalDateTime.now(); ;

    private LocalDateTime userUpdateDate = LocalDateTime.now();

    @NotNull
    @NotBlank
    private String userNickName;

    @NotNull
    @NotBlank
    private LocalDate userBirthday;
}
