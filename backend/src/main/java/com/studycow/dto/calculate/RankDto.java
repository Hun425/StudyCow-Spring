package com.studycow.dto.calculate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class RankDto {
    private List<RankRoomDto> rankRoom;
    private List<RankUserDto> rankUser;
}
