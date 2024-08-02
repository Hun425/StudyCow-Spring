package com.studycow.repository.common;


import com.studycow.dto.common.CategoryCodeDto;
import com.studycow.dto.common.SubjectCodeDto;
import jakarta.persistence.PersistenceException;

import java.util.List;

/**
 * <pre>
 *      공통 레포지토리 인터페이스
 * </pre>
 * @author 노명환
 * @since JDK17
 */

public interface CommonRepository {
    /** 과목 리스트 조회 */
    List<SubjectCodeDto> viewSubject() throws PersistenceException;
    /** 오답 유형 리스트 조회 */
    List<CategoryCodeDto> viewCategory(int subCode) throws PersistenceException;
    /** 타 유저의 정보 조회 시 공개 여부 확인 */
    int checkPublic(int userId, int myId) throws PersistenceException;
}
