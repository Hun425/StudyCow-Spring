package com.studycow.dto.target;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScoreTargetDto {
    private Long id;
    private int subCode;
    private String subName;
    private int targetScore;
    private int targetGrade;
    private int subMaxScore;
}
