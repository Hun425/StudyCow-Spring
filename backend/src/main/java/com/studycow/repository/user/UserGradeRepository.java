package com.studycow.repository.user;

import com.studycow.domain.UserGrade;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 유저 등급 Repository
 * <pre>
 *     유저 등급 관리를 위한 Spring Data JPA
 * </pre>
 * @author 채기훈
 * @since JDK17
 */
public interface UserGradeRepository extends JpaRepository<UserGrade, Integer> {

}
