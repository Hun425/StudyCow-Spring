package com.studycow.dto.score;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ScoreDetailDto {
    private Long wrongDetailId;
    private Long scoreId;
    private int catCode;
    private String catName;
    private int wrongCnt;
}