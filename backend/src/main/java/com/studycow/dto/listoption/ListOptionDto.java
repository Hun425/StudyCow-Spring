package com.studycow.dto.listoption;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * <pre>
 *     목록 검색 조건 DTO 클래스
 * </pre>
 *
 * @author 박봉균
 * @since JDK17(Eclipse Temurin)
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ListOptionDto {
    /** 검색어 */
    private String searchText;
    /** 정렬 기준 */
    private String sortKey;
    /** 정렬 방향 (asc(기본), desc) */
    private Boolean isDESC;
}
