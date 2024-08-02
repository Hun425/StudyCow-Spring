package com.studycow.dto.score;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ResponseStatsDto {
    private int subCode;
    private String subName;
    private double avgScore;
    private double avgGrade;
    private List<ScoreDetailStatsDto> detailStatsList;

    public ResponseStatsDto(int subCode, String subName, double avgScore, double avgGrade){
        this.subCode = subCode;
        this.subName = subName;
        this.avgScore = avgScore;
        this.avgGrade = avgGrade;
        this.detailStatsList = null;
    }
}
