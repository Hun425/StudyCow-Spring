package com.studycow.dto.session;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class SessionRankDto {
    private int rank;
    private int userId;
    private String userName;
    private int studyTime;
}
