package com.studycow.dto.user;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <pre>
 *     유저 등급 정보 Dto
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserGradeDto {

    private int gradeCode;
    private String gradeName;
    private int minExp;
    private int maxExp;

}
