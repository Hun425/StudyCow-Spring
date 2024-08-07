package com.studycow.dto.user;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.studycow.domain.UserGrade;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;

/**
 * <pre>
 *     유저 상세 정보 Dto
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoDto {

    private int userId;
    private String userEmail;
    private int userPublic;
    private String userThumb;
    private UserGradeDto userGrade;
    private int userExp;
    private LocalDateTime userJoinDate;
    private LocalDateTime userUpdateDate;
    private String userNickName;

}
